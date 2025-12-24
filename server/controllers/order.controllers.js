import razorpay from "../utils/razorpay.js";
import crypto from "crypto";
import Crop from "../models/crop.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import { sendOrderEmail } from "../utils/sendEmail.js";
import { buyerOrderEmail, farmerOrderEmail } from "../utils/emailTemplates.js";
import { log } from "console";

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { cropId, quantity, address, phoneNumber } = req.body;

    const mongoUser = await User.findOne({ clerkId: userId });
    if (!mongoUser) {
      return res.status(403).json({
        success: false,
        message: "User not authorized. Please login again.",
      });
    }

    if (mongoUser.role === "farmer") {
      return res.status(409).json({
        success: false,
        message: "Farmers are not allowed to buy products.",
      });
    }

    if (!cropId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid crop or quantity" });
    }

    if (!address || !phoneNumber) {
      return res.status(400).json({
        message: "Delivery address and phone number are required",
      });
    }

    const crop = await Crop.findById(cropId).populate("reportedBy");

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    if (crop.reportedBy._id.toString() === mongoUser._id.toString()) {
      return res.status(400).json({
        message: "You cannot buy your own crop",
      });
    }

    if (quantity > crop.available) {
      return res.status(400).json({
        message: "Requested quantity not available",
      });
    }

    const totalAmount = Math.round(quantity * crop.price * 100) / 100;

    const order = await Order.create({
      buyer: mongoUser._id,
      farmer: crop.reportedBy._id,
      crop: crop._id,

      quantity,
      pricePerKg: crop.price,
      totalAmount,

      deliveryAddress: address,
      phoneNumber,

      paymentStatus: "PENDING",
      orderStatus: "CREATED",
    });

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};






export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(409).json({ message: "Order already paid" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100, // INR → paise
      currency: "INR",
      receipt: `order_${order._id}`,
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      success: true,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return res.status(500).json({
      message: "Failed to create Razorpay order",
    });
  }
};







export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Payment verification data missing" });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(409).json({ message: "Order already verified" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "FAILED";
      await order.save();

      return res.status(400).json({ message: "Payment verification failed" });
    }

    // 5️⃣ Payment verified → update order
    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    await order.save();
    await order.populate("buyer farmer crop");


    // 6️⃣ Reduce inventory
    const crop = await Crop.findById(order.crop);

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    if (crop.available < order.quantity) {
      return res.status(400).json({ message: "Insufficient crop quantity" });
    }

    crop.available -= order.quantity;
    await crop.save();

    // 7️⃣ Update buyer & farmer stats
    await User.findByIdAndUpdate(order.buyer, {
      $inc: {
        totalSpent: order.totalAmount,
        totalOrder: 1,
      },
    });

    await User.findByIdAndUpdate(order.farmer, {
      $inc: {
        totalEarning: order.totalAmount,
        totalOrder: 1,
      },
    });


  
    sendOrderEmail({
      to: order.buyer.email,
      subject: "AgroConnect | Order Confirmed",
      html: buyerOrderEmail(order),
    }).catch((err) => console.error("Buyer email failed:", err.message));

    // 📧 Send email to Farmer
    sendOrderEmail({
      to: order.farmer.email,
      subject: "AgroConnect | New Order Received",
      html: farmerOrderEmail(order),
    }).catch((err) => console.error("Farmer email failed:", err.message));

    return res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed",
      order,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};









export const getAllOrderDetails = async (req, res) => {
  try {
    // 1️⃣ Clerk user
    const { userId } = req.auth();

    // 2️⃣ Find Mongo user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not authorized",
      });
    }

    // 3️⃣ Build query based on role
    let query = {};

    if (user.role === "buyer") {
      query.buyer = user._id;
    } else if (user.role === "farmer") {
      query.farmer = user._id;
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid role",
      });
    }

    // 4️⃣ Fetch orders
    const orders = await Order.find(query)
      .populate("crop", "name imageUrl price")
      .populate("buyer", "name mobileNo")
      .populate("farmer", "name mobileNo")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      role: user.role,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

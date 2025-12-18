import razorpay from "../utils/razorpay.js";
import crypto from "crypto";
import Crop from "../models/crop.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

/**
 * STEP 1: Create Order in DB (with address & phone)
 * Payment is NOT done here
 */
export const createOrder = async (req, res) => {
  try {
    // 1️⃣ Get Clerk user
    const { userId } = req.auth();

    // 2️⃣ Extract data from frontend
    const { cropId, quantity, address, phoneNumber } = req.body;

    // 3️⃣ Find Mongo user
    const mongoUser = await User.findOne({ clerkId: userId });
    if (!mongoUser) {
      return res.status(403).json({
        success: false,
        message: "User not authorized. Please login again.",
      });
    }

    // 4️⃣ Buyer role check
    if (mongoUser.role === "farmer") {
      return res.status(409).json({
        success: false,
        message: "Farmers are not allowed to buy products.",
      });
    }

    // 5️⃣ Validate inputs
    if (!cropId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid crop or quantity" });
    }

    if (!address || !phoneNumber) {
      return res.status(400).json({
        message: "Delivery address and phone number are required",
      });
    }

    // 6️⃣ Fetch crop
    const crop = await Crop.findById(cropId).populate("reportedBy");

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    // 7️⃣ Prevent self-purchase
    if (crop.reportedBy._id.toString() === mongoUser._id.toString()) {
      return res.status(400).json({
        message: "You cannot buy your own crop",
      });
    }

    // 8️⃣ Check availability
    if (quantity > crop.available) {
      return res.status(400).json({
        message: "Requested quantity not available",
      });
    }

    // 9️⃣ Calculate total (ALWAYS backend)
    const totalAmount = Math.round(quantity * crop.price * 100) / 100;

    // 🔟 Create order in DB
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

/**
 * STEP 2: Create Razorpay Order (Payment Intent)
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // 1️⃣ Fetch order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2️⃣ Prevent double payment
    if (order.paymentStatus === "PAID") {
      return res.status(409).json({ message: "Order already paid" });
    }

    // 3️⃣ Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100, // INR → paise
      currency: "INR",
      receipt: `order_${order._id}`,
    });

    // 4️⃣ Save Razorpay order ID
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







/**
 * STEP 5: Verify Razorpay Payment
 */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({ message: "Payment verification data missing" });
    }

    // 1️⃣ Fetch order using razorpayOrderId
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2️⃣ Prevent double verification
    if (order.paymentStatus === "PAID") {
      return res.status(409).json({ message: "Order already verified" });
    }

    // 3️⃣ Generate signature on backend
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // 4️⃣ Compare signatures
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
    const buyer = await User.findOne({ clerkId: userId });
    if (!buyer) {
      return res.status(403).json({
        success: false,
        message: "User not authorized",
      });
    }

    // 3️⃣ Role check
    if (buyer.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Only buyers can access this resource",
      });
    }

    // 4️⃣ Fetch PAID orders
    const orders = await Order.find({
      buyer: buyer._id,
      // paymentStatus: "PAID",
    })
      .populate("crop", "name imageUrl")
      .populate("farmer", "name mobileNo")
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get buyer paid orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


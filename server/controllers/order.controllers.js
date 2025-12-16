import Order from "../models/order.model.js";
import Crop from "../models/crop.model.js";
import User from "../models/user.model.js";


export const createOrder = async (req, res) => {
  try {
    const {userId} = req.auth();
    const { cropId, quantity } = req.body;
    const mongoUser = await User.findOne({clerkId:userId});
    if(!mongoUser){
        return res.status(403).json({
            success:false,
            message: "User not authorized. Please login again.",
        })
    }
    const buyerId=mongoUser._id;
    if(mongoUser.role==="farmer"){
        return res.status(409).json({
            success:false,
            message:"Farmer are not allowed to buy products , create account as buyer."
        })
    }
    if (!cropId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const crop = await Crop.findById(cropId).populate("reportedBy");

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    if (quantity > crop.available) {
      return res.status(400).json({
        message: "Requested quantity not available",
      });
    }

    const totalAmount = quantity * crop.price;

    const order = await Order.create({
      buyer: buyerId,
      farmer: crop.reportedBy._id,
      crop: crop._id,
      quantity,
      pricePerKg: crop.price,
      totalAmount,
      paymentStatus: "PENDING",
      orderStatus: "CREATED",
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



import razorpay from "../utils/razorpay.js";

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
      receipt: `receipt_${order._id}`,
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

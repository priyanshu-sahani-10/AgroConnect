import { Router } from "express";
import { createOrder, createRazorpayOrder, getAllOrderDetails, verifyRazorpayPayment } from "../controllers/order.controllers.js";

const orderRouter = Router();

orderRouter.route("/create").post(createOrder);
orderRouter.route("/razorpay/create").post(createRazorpayOrder);
orderRouter.post("/razorpay/verify", verifyRazorpayPayment);
orderRouter.route("/my-orders").get(getAllOrderDetails);



export default orderRouter;

import { Router } from "express";
import { createOrder, createRazorpayOrder, getAllOrderDetails, verifyRazorpayPayment } from "../controllers/order.controllers.js";
import { checkBlockedUser } from "../middleware/blocked.middleware.js";

const orderRouter = Router();

orderRouter.route("/my-orders").get(getAllOrderDetails);
orderRouter.use(checkBlockedUser);
orderRouter.route("/create").post(createOrder);
orderRouter.route("/razorpay/create").post(createRazorpayOrder);
orderRouter.post("/razorpay/verify", verifyRazorpayPayment);



export default orderRouter;

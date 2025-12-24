import { Router } from "express";
import { addToCart, clearCart, getCart, removeFromCart } from "../controllers/cart.controllers.js";
import { checkBlockedUser } from "../middleware/blocked.middleware.js";

const cartRouter= Router();

cartRouter.use(checkBlockedUser);
cartRouter.route("/getCartItems").get(getCart);
cartRouter.route("/addItem/:cropId").post(addToCart);
cartRouter.route("/removeItem/:cropId").delete(removeFromCart);
cartRouter.route("/clearItems").delete(clearCart);

export default cartRouter;
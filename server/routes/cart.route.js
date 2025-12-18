import { Router } from "express";
import { addToCart, clearCart, getCart, removeFromCart } from "../controllers/cart.controllers.js";

const cartRouter= Router();

cartRouter.route("/getCartItems").get(getCart);
cartRouter.route("/addItem/:cropId").post(addToCart);
cartRouter.route("/removeItem/:cropId").delete(removeFromCart);
cartRouter.route("/clearItems").delete(clearCart);

export default cartRouter;
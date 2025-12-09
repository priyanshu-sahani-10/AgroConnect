import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { registerUser, syncUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/sync").post( syncUser);
userRouter.route("/register").post( registerUser);

export default userRouter;

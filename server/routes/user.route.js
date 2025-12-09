import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { registerUser, syncUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/sync").post(requireAuth(), syncUser);
userRouter.route("/register").post(requireAuth(), registerUser);

export default userRouter;

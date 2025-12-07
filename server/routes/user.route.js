import { Router } from "express";
import { requireAuth } from "@clerk/express";
import registerUser from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register").post(requireAuth(), registerUser);

export default userRouter;

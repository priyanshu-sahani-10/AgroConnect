import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { registerUser, syncUser } from "../controllers/user.controller.js";
import upload from "../utils/multer.js";

const userRouter = Router();

userRouter.route("/sync").post(syncUser);
userRouter.route("/register").post(upload.single("photo"),registerUser);

export default userRouter;

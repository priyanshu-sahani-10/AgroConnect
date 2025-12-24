import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { registerUser, syncUser, updateUserProfile } from "../controllers/user.controller.js";
import upload from "../utils/multer.js";
import { checkBlockedUser } from "../middleware/blocked.middleware.js";

const userRouter = Router();

userRouter.route("/sync").post(syncUser);
userRouter.use(checkBlockedUser);
userRouter.route("/register-user").post(upload.single("photo"),registerUser);
userRouter.route("/updateUser").put(upload.single("photo"),updateUserProfile);

export default userRouter;

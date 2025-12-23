import express, { Router } from "express";
import {
  blockUnblockUser,
  getAdminAllOrders,
  getAdminAllUsers,
} from "../controllers/admin.controllers.js";

const adminRouter = Router();

adminRouter.route("/getAllUsers").get(getAdminAllUsers);
adminRouter.route("/getAllOrders").get(getAdminAllOrders);
adminRouter.route("/block-unblock/:Id").patch(blockUnblockUser);

export default adminRouter;

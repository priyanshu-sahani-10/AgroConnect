import express, { Router } from "express";
import {
  getAdminAllOrders,
  getAdminAllUsers,
} from "../controllers/admin.controllers.js";

const adminRouter = Router();

adminRouter.route("/getAllUsers").get(getAdminAllUsers);
adminRouter.route("/getAllOrders").get(getAdminAllOrders);

export default adminRouter;

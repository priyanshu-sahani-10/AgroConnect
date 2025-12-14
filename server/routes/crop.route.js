import express, {Router} from 'express'
import { getAllCrops, getSingleCrop, getUserCrops, RegisterCrop, updateUserCrop } from '../controllers/crop.controllers.js';
import upload from '../utils/multer.js';

const cropRouter=Router();

cropRouter.route("/register-crop").post( upload.single("imageUrl"),RegisterCrop);
cropRouter.route("/getCrops").get(getAllCrops);
cropRouter.route("/userCrops").get(getUserCrops);
cropRouter.route("/updateCrop/:cropId").put(upload.single("imageUrl"),updateUserCrop);
cropRouter.route("/getCrop/:cropId").get(getSingleCrop);

export default cropRouter
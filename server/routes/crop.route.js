import express, {Router} from 'express'
import { getAllCrops, getUserCrops, RegisterCrop } from '../controllers/crop.controllers.js';
import upload from '../utils/multer.js';

const cropRouter=Router();

cropRouter.route("/register-crop").post( upload.single("imageUrl"),RegisterCrop);
cropRouter.route("/getCrops").get(getAllCrops);
cropRouter.route("/userCrops").get(getUserCrops)

export default cropRouter
import express, {Router} from 'express'
import { getAllCrops, RegisterCrop } from '../controllers/crop.controllers.js';
import upload from '../utils/multer.js';

const cropRouter=Router();

cropRouter.route("/register-crop").post( upload.single("imageUrl"),RegisterCrop);
cropRouter.route("/getCrops").post(getAllCrops);

export default cropRouter
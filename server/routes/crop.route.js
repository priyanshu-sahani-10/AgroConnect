import express, {Router} from 'express'
import RegisterCrop from '../controllers/crop.controllers.js';
import upload from '../utils/multer.js';

const cropRouter=Router();

cropRouter.route("/register-crop").post( upload.single("imageUrl"),RegisterCrop);

export default cropRouter
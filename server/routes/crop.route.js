import express, {Router} from 'express'
import uploadCrop from '../controllers/crop.controllers.js'

const cropRouter=Router();

cropRouter.route("/upload").post(uploadCrop);

export default cropRouter
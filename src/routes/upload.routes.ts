import {Router} from "express";
import upload from "../middleware/upload.middleware";
import {saveImage} from "../controller/upload.controller";

const uploadRouter = Router();

uploadRouter.post("/image",upload.single("image"),saveImage);

export default uploadRouter;
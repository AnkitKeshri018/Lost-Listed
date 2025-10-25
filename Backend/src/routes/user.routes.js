import express from "express"
import { registerUser } from "../controllers/user.controller.js"
import { singleUpload } from "../middlewares/multer.js";

const router =express.Router();

router.route("/register").post(singleUpload,registerUser);




export default router;
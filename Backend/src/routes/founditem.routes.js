import express from "express"
import { uploadFoundItemImage } from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/Authentication.js"
import { createFoundItem, deleteFoundItem, filterFoundItems, getAllFoundItems, getFoundItemById, getRecentFoundItems, getUserFoundItems, markItemClaimed, unmarkItemClaimed, updateFoundItem } from "../controllers/founditem.controller.js";



const router = express.Router();

router.route("/create").post(verifyJWT,uploadFoundItemImage,createFoundItem);
 router.route("/get").get(getAllFoundItems);
 router.route("/filter").get(filterFoundItems);
 router.route("/user").get(verifyJWT, getUserFoundItems);
 router.route("/recent").get(getRecentFoundItems);
 router.route("/:id").get(getFoundItemById);
 router.route("/update/:id").put(verifyJWT,uploadFoundItemImage,updateFoundItem)
 router.route("/claim/:id").put(verifyJWT,markItemClaimed);
router.route("/unclaim/:id").put(verifyJWT,unmarkItemClaimed);

 router.route("/delete/:id").delete(verifyJWT, deleteFoundItem);



export default router



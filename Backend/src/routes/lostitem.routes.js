import express from "express"
import { uploadLostItemImage } from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/Authentication.js"
import { createLostItem ,getAllLostItems,getLostItemById,markItemFound,unmarkItemFound,updateLostItem ,deleteLostItem, filterLostItems,getUserLostItems,getRecentLostItems,getUserFoundByItems} from "../controllers/lostitem.controller.js"


const router = express.Router();

router.route("/create").post(verifyJWT,uploadLostItemImage,createLostItem);
router.route("/get").get(getAllLostItems);
router.route("/filter").get(filterLostItems);
router.route("/user").get(verifyJWT, getUserLostItems);
router.route("/recent").get(getRecentLostItems);
router.route("/foundByuser").get(verifyJWT, getUserFoundByItems);
router.route("/:id").get(getLostItemById);
router.route("/update/:id").put(verifyJWT,uploadLostItemImage,updateLostItem)
router.route("/found/:id").put(verifyJWT,markItemFound);
router.route("/unmark/:id").put(verifyJWT,unmarkItemFound);

router.route("/delete/:id").delete(verifyJWT, deleteLostItem);










export default router



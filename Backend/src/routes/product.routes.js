import express from "express"

import { uploadProductImages} from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/Authentication.js";
import { createProduct, deleteProduct, filterProducts, getAllProducts, getProductById, getRecentProducts, getUserProducts, markProductSold, unmarkProductSold, updateProduct } from "../controllers/product.controller.js";

const router =express.Router();

router.route("/create").post(verifyJWT, uploadProductImages, createProduct);
 router.route("/get").get(getAllProducts);
 router.route("/filter").get(filterProducts);
 router.route("/user").get(verifyJWT, getUserProducts);
 router.route("/recent").get(getRecentProducts);
 router.route("/:id").get(getProductById);
 router.route("/update/:id").put(verifyJWT, uploadProductImages, updateProduct);
router.route("/sold/:id").put(verifyJWT, markProductSold);
router.route("/unsold/:id").put(verifyJWT, unmarkProductSold);

router.route("/delete/:id").delete(verifyJWT, deleteProduct);




export default router;
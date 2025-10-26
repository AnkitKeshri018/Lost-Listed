import multer from "multer";
import path from "path";

// Storage config (temp save to uploads/)
const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single("avatar");

export const uploadLostItemImage = multer({ storage }).single("image");

export const uploadFoundItemImage = multer({ storage }).single("image");

export const uploadProductImages = multer({ storage }).array("images", 5);



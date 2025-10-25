import multer from "multer";
import path from "path";

// Storage config (temp save to uploads/)
const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single("avatar");

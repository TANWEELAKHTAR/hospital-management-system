import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../../config/cloudinary.js";

// Cloudinary storage setup
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "user_profile",
        allowedFormats: ["jpg", "jpeg", "png"],
    },
});

const upload = multer({ storage });

export default upload;

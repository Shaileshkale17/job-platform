// middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage(); // We'll manually upload to Cloudinary
const upload = multer({ storage });

export default upload;

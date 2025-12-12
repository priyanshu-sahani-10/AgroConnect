import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // same as before
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // get extension like .jpg
    cb(null, `${Date.now()}${ext}`); // save with proper filename
  },
});

const upload = multer({ storage });
export default upload;

// src/config/multer.config.ts
import multer, { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";

const storage = multer.memoryStorage();

export const multerOptions = {
  storage,
  // storage: diskStorage({
  //   // destination: "./uploads", // Change to your desired directory
  //   // filename: (req, file, cb) => {
  //   //   const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
  //   //   cb(null, uniqueSuffix);
  //   // },
  // }),
  limits: {
    fileSize: 1 * 1024 * 1024, // 5 MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow image files only
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
};

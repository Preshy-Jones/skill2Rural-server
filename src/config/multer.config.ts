// src/config/multer.config.ts
import multer, { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";
import { HttpException, HttpStatus } from "@nestjs/common";

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
    const ismatch = file.mimetype.match(/\/(jpg|jpeg|png|gif|svg(\+xml)?)$/);
    console.log(ismatch, "ismatch");

    if (ismatch) {
      // Allow image files only
      cb(null, true);
    } else {
      cb(
        new HttpException("Unsupported file type", HttpStatus.BAD_REQUEST),
        false,
      );
    }
  },
};

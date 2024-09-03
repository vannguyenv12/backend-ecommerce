import multer from "multer"
import path from "node:path";
import fs from "node:fs";
import { Express, Request } from "express";
import { BadRequestException } from "../middlewares/error.middleware";


function createStorage(uploadDir: string) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // if folder does not exist
      const uploadPath = path.join(__dirname, '../../../images', uploadDir);
      if (!fs.existsSync(uploadPath)) {
        // create folder uploadDir name
        fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
  });

  return storage
}

function fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  // make sure file is image
  if (!file.mimetype.startsWith('image/')) {
    cb(new BadRequestException("File must be image"))
  }

  cb(null, true);
}

const limits = {
  fileSize: 5 * 1024 * 1024 // 5 mb
}

export const upload = multer({
  storage: createStorage('products'), fileFilter,
  limits
})
export const uploadAvatar = multer({ storage: createStorage('users'), fileFilter, limits })
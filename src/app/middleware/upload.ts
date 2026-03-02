import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
const { customAlphabet } = require("nanoid");


const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public", "uploads"));
  },
  filename: function (req, file, cb) {

    const ext = path.extname(file.originalname);

    cb(null, `${nanoid()}${ext}`);
  },
});

export const upload = multer({
  // storage: multer.memoryStorage(),
  storage,
  limits: {
    // fileSize: 250 * 1024 * 1024, // ২৫০MB = 250 * 1024 * 1024 bytes
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },

  fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    cb(null, true);
  }
});

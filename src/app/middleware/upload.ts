import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

// Configure disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public", "uploads"));
  },
  filename: async function (req, file, cb) {
    // Dynamically import uuid to avoid ERR_REQUIRE_ESM
    const { v4: uuidv4 } = await import("uuid");
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// Export multer instance
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    cb(null, true);
  },
});

import multer from "multer";
import type { Request, Response, NextFunction } from "express";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

const uploadHandler = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: MAX_SIZE,
	},
	fileFilter: (_req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed"));
		}
	},
}).single("image");

export const uploadMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	uploadHandler(req, res, (err) => {
		if (err) {
			res.status(400).json({
				success: false,
				message: err.message || "Upload failed",
			});
			return;
		}
		next();
	});
};
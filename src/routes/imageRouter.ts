import { Router } from "express";

import { apiKeyMiddleware } from "@/middleware/apiKey.middleware";
import { uploadMiddleware } from "@/middleware/upload.middleware";
import { ImageController } from "@/controllers/image.controller";

export const imageRouter: Router = Router();

const imageController = new ImageController();

imageRouter.post(
	"/upload",
	apiKeyMiddleware,
	uploadMiddleware,
	(req, res, next) => imageController.upload(req, res, next),
);

imageRouter.get("/image/:id", apiKeyMiddleware, (req, res, next) =>
	imageController.getImage(req, res, next),
);
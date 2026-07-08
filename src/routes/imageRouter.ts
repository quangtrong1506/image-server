import { Router } from 'express';

import { ImageController } from '../../src/controllers/image.controller';
import { apiKeyMiddleware } from '../../src/middleware/apiKey.middleware';
import { uploadMiddleware } from '../../src/middleware/upload.middleware';

export const imageRouter: Router = Router();

const imageController = new ImageController();

imageRouter.post('/upload', apiKeyMiddleware, uploadMiddleware, (req, res, next) =>
   imageController.upload(req, res, next),
);

imageRouter.get('/image/:id', apiKeyMiddleware, (req, res, next) => imageController.getImage(req, res, next));

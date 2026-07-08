import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { telegramService } from '@/services/telegram.service';

export class ImageController {
   constructor() {}

   async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         if (!req.file) {
            res.status(StatusCodes.BAD_REQUEST).json({
               success: false,
               message: 'No image file provided',
            });
            return;
         }

         const fileIds = await telegramService.uploadImage(req.file.buffer, req.file.originalname, req.file.mimetype);

         res.status(StatusCodes.OK).json({
            success: true,
            data: fileIds,
         });
      } catch (error) {
         next(error);
      }
   }

   async getImage(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const { id } = req.params;
         const { stream, contentType } = await telegramService.streamImage(id);
         res.setHeader('Content-Type', contentType);
         res.setHeader('Cache-Control', 'public, max-age=31536000');

         stream.on('error', () => {
            if (!res.headersSent) {
               res.status(StatusCodes.NOT_FOUND).json({
                  success: false,
                  message: 'Image not found',
               });
            }
         });

         stream.pipe(res);
      } catch (error) {
         next(error);
      }
   }
}

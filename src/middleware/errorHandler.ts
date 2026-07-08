import type { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../server';

const unexpectedRequest: RequestHandler = (_req, res) => {
   res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Not Found',
   });
};

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
   logger.error(err);
   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message || 'Internal Server Error',
   });
};

export default (): [RequestHandler, ErrorRequestHandler] => [unexpectedRequest, errorHandler];

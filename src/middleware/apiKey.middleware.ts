import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { env } from "@/config/envConfig";

export const apiKeyMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
	const apiKey = _req.headers["x-api-key"] as string | undefined;

	if (apiKey !== env.API_KEY) {
		res.status(StatusCodes.UNAUTHORIZED).json({
			success: false,
			message: "Unauthorized",
		});
		return;
	}

	next();
};
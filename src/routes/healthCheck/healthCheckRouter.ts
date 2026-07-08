import { type Request, type Response, type Router } from "express";
import express from "express";

export const healthCheckRouter: Router = express.Router();

healthCheckRouter.get("/", (_req: Request, res: Response) => {
	res.status(200).json({
		status: "ok",
	});
});
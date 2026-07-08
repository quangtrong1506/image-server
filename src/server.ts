import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import errorHandler from "@/middleware/errorHandler";
import requestLogger from "@/middleware/requestLogger";
import { healthCheckRouter } from "@/routes/healthCheck/healthCheckRouter";
import { imageRouter } from "@/routes/imageRouter";

const logger = pino({ name: "server start" });
const app: Express = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));
app.use(helmet());

app.use(requestLogger);

app.use("/health", healthCheckRouter);
app.use("/api", imageRouter);

app.use(errorHandler());

export { app, logger };
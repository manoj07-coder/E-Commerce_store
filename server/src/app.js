import express from "express";
import pinoHttp from "pino-http";
import { logger } from "./utils/logger.js";
import cookieParser from "cookie-parser";
import { applySecurity } from "./middlewares/security.js";
import { ENV } from "./config/env.js";
import { apiRateLimiter } from "./middlewares/rateLimiter.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";

export const createApp = () => {
  const app = express();
  app.use(express.json({ limit: "1mb" }));
  app.use(pinoHttp({ logger }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  applySecurity(app, ENV.CORS_ORIGIN);

  app.use("/api", apiRateLimiter, routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

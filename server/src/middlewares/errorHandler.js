import { logger } from "../utils/logger.js";
import { AppError } from "../utils/AppError.js";
import { fail } from "../utils/apiResponse.js";

export const errorHandler = (err, _req, res, _next) => {
  if (!(err instanceof AppError)) {
    logger.error({ err }, "Unhandled Error");
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json(fail(message));
};

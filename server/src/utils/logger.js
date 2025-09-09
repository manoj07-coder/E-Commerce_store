import pino from "pino";
import { ENV } from "../config/env.js";

export const logger = pino({
  level: ENV.LOG_LEVEL,
});

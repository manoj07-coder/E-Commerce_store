import pino from "pino";
import { ENV } from "../config/env";

export const logger = pino({
  level: ENV.LOG_LEVEL,
});

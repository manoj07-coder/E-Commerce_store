import Redis from "ioredis";
import { logger } from "../utils/logger.js";

let client;

export function getRedis() {
  if (!client) throw new Error("Redis not initialized");
  return client;
}

export async function connectRedis(url) {
  client = new Redis(url);
  client.on("connect", () => logger.info("Redis Connected"));
  client.on("error", (err) => logger.error({ err }, "Redis Error"));
  return client;
}

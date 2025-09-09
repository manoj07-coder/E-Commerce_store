import { createApp } from "./app.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./loaders/db.js";
import { connectRedis } from "./loaders/redis.js";
import { logger } from "./utils/logger.js";

async function bootstrap() {
  await connectDB(ENV.MONGO_URI);
  await connectRedis(
    `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  );

  const app = createApp();
  app.listen(ENV.PORT, () => {
    logger.info(`Server is running on localhost://${ENV.PORT}`);
  });
}

bootstrap().catch((err) => {
  logger.fatal({ err }, "Failed to start server");
  process.exit(1);
});

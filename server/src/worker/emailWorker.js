import { connectRedis, getRedis } from "../loaders/redis.js";
import { sendOrderEmail } from "../services/emailService.js";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";
import nodemailer from "nodemailer";

async function start() {
  await connectRedis(`redis://${ENV.REDIS_HOST}:${ENV.REDIS_PORT}`);
  const redis = getRedis();
  logger.info("Email worker started, waiting for jobs...");
  while (true) {
    try {
      //BRPOP blocks until an item is available.'email:queue' is the list name.
      const res = await redis.brpop("email:queue", 0);
      console.log(res);

      const payload = JSON.parse(res[1]);
      await sendOrderEmail(payload.to, payload.subject, payload.html);
      logger.info(`Processed email job for ${payload.to}`);
    } catch (error) {
      logger.error(
        { msg: error.message, stack: error.stack },
        "Email worker error, retrying in 3s"
      );
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

start().catch((e) => {
  console.error("Worker failed:", e);
  process.exit(1);
});

async function testAccount() {
  const test = await nodemailer.createTestAccount();
}

testAccount();

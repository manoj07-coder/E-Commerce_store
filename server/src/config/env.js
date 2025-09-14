import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(4000),
  MONGO_URI: Joi.string().required(),
  REDIS_HOST: Joi.string().default("localhost"),
  REDIS_PORT: Joi.number().default(6379),
  LOG_LEVEL: Joi.string()
    .valid("fatal", "error", "warn", "info", "debug", "trace", "silent")
    .default("info"),
  CORS_ORIGIN: Joi.string().default("*"),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().default("7d"),
  STRIPE_SECRET: Joi.string().allow(""),
  EMAIL_FROM: Joi.string().email().allow(""),
  SMTP_HOST: Joi.string().allow(""),
  SMTP_PORT: Joi.number().allow(""),
  SMTP_USER: Joi.string().allow(""),
  SMTP_PASSWORD: Joi.string().allow(""),
}).unknown();

const { value: env, error } = schema.validate(process.env);

if (error) {
  console.log("Invalid environment variables", error.details);
  process.exit(1);
}

export const ENV = env;

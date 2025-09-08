import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

const schema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  PORT: Joi.number().default(4000),
  MONGO_URI: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  LOG_LEVEL: Joi.string()
    .valid("fatal", "errror", "warn", "info", "debug", "trace", "silent")
    .default("info"),
  CORS_ORIGIN: Joi.string().default("*"),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().default("7d"),
  STRIPE_SECRET_KEY: Joi.string().required(),
  EMAIL_FROM: Joi.string().email().required(),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
}).unknown();

const { value: env, error } = schema.validate(process.env);

if (error) {
  console.log("Invalid environment variables", error.details);
  process.exit(1);
}

export const ENV = env;

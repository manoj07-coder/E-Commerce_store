import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  logger.info("MongoDB connected");
}

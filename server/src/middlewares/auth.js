import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import User from "../models/User.js";

export async function authGuard(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      throw new AppError("Not Authenticated", 401);
    }
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(payload.sub).select("-password");
    if (!user) {
      throw new AppError("User not found", 401);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function roleGuard(roleNames = []) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Not Authenticated", 401));
    }
    if (!roleNames.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
}

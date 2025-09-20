import { ENV } from "../config/env.js";
import User from "../models/User.js";
import { ok } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Helper functions

const signAccessToken = (user) => {
  return jwt.sign({ sub: user._id, role: user.role }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
};

const signRefreshToken = (user) => {
  return jwt.sign({ sub: user._id }, ENV.JWT_SECRET, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Email already registered", 400);
  }
  const user = new User({ name, email, password, role });
  await user.save();

  const access = signAccessToken(user);
  const refresh = signRefreshToken(user);

  user.refreshTokens.push({ token: refresh, createdAt: new Date() });
  await user.save();

  res.status(201).json(
    ok({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: access,
      refreshToken: refresh,
    })
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid Credentials", 401);
  }
  const match = await user.comparePassword(password);
  if (!match) {
    throw new AppError("Invalid Credentials", 401);
  }

  const access = signAccessToken(user);
  const refresh = signRefreshToken(user);

  user.refreshTokens.push({ token: refresh, createdAt: new Date() });
  await user.save();

  res.json(
    ok({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: access,
      refreshToken: refresh,
    })
  );
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new AppError("Refresh Token is required ", 400);
  }
  try {
    const decoded = jwt.verify(refreshToken, ENV.JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user) {
      throw new AppError("Invalid Refresh Token ", 401);
    }
    const found = user.refreshTokens.find((rt) => rt.token === refreshToken);
    if (!found) {
      throw new AppError("Invalid Refresh Token", 401);
    }
    const access = signAccessToken(user);
    const newRefresh = signRefreshToken(user);

    // Remove old refresh token and add the new one
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== refreshToken
    );
    user.refreshTokens.push({ token: newRefresh, createdAt: new Date() });
    await user.save();

    res.json(ok({ accessToken: access, refreshToken: newRefresh }));
  } catch (error) {
    throw new AppError("Invalid Refresh Token ", 401);
  }
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.json(ok({}));
  }
  try {
    const decoded = jwt.verify(refreshToken, ENV.JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.json(ok({}));
    }
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== refreshToken
    );
    await user.save();
    res.json(ok({}));
  } catch (error) {
    // still respond with ok to prevent token fishing
    res.json(ok({}));
  }
});

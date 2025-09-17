import { ok } from "../utils/apiResponse.js";

export const getHealth = (_req, res) => {
  res.json(ok({ status: "ok", uptime: process.uptime() }));
};

import { fail } from "../utils/apiResponse.js";

export const notFound = (req, res, next) => {
  res.status(404).json(fail("Route not found"));
};

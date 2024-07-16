import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export const verifyToken = async (req, res, next) => {
  let { token } = req.headers;

  if (!token) {
    req.user = null;
    return next();
    // return next(
    //   new AppError("You are not logged in! Please log in to get access.", 401)
    // )
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return next(new AppError("Invalid Token", 401));

    req.user = payload;
    next();
  });
};

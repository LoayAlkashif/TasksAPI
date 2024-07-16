import bcrypt from "bcrypt";
import { User } from "../../database/models/user.model.js";
import { AppError } from "../utils/appError.js";

export const checkEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) return next(new AppError("Email already Exist.", 409));

  req.body.password = bcrypt.hashSync(req.body.password, 8);
  next();
};

import { Router } from "express";
import {
  deleteUser,
  otpVerify,
  signin,
  signup,
  updateUser,
} from "./user.controller.js";
import { checkEmail } from "../../middleware/checkEmail.js";
import { validate } from "../../middleware/validate.js";
import {
  otpValidation,
  signinValidation,
  signupValidation,
  updateValidation,
} from "./user.validation.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const userRouter = Router();

userRouter.post("/signup", validate(signupValidation), checkEmail, signup);
userRouter.post("/verify", validate(otpValidation), otpVerify);
userRouter.post("/signin", validate(signinValidation), signin);
userRouter
  .route("/:id")
  .put(verifyToken, validate(updateValidation), updateUser)
  .delete(verifyToken, deleteUser);

export default userRouter;

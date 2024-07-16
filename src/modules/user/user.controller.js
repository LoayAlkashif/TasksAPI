import bcrypt from "bcrypt";
import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../email/sendEmail.js";
import { Category } from "../../../database/models/category.model.js";
import { Task } from "../../../database/models/task.model.js";

// sign up
const signup = catchError(async (req, res, next) => {
  //generate random 6 numbers
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // otp expire after 3 mins
  const otpExpire = new Date(Date.now() + 3 * 60000);
  // create a new user
  const user = new User({ ...req.body, otp, otpExpire });
  await user.save();

  user.password = undefined;
  user.otp = undefined;
  user.otpExpire = undefined;
  user.otpVerified = undefined;

  sendEmail(req.body.email, otp);
  res.status(201).json({ message: "success", user });
});

// user verify
const otpVerify = catchError(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new AppError("User not found", 404));

  if (user.otpVerified == true)
    return next(new AppError("Email already verified", 409));

  if (user.otp !== otp) return next(new AppError("Wrong otp", 401));

  if (user.otpExpire < new Date()) {
    //otp expire insert a new otp and save it in mongo and send the new one by email

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpExpire = new Date(Date.now() + 3 * 60000);

    user.otp = newOtp;
    user.otpExpire = newOtpExpire;

    sendEmail(email, newOtp);
    return next(new AppError("otp expired please insert the new one"), 401);
  }
  //verify user
  user.otpVerified = true;
  user.otp = null;
  user.otpExpire = null;
  await user.save();
  res.status(200).json({ message: "Email verified" });
});

//signin
const signin = catchError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("user not found", 404));

  if (user.otpVerified == false)
    return next(
      new AppError("you are not verified please verify your account first", 401)
    );

  if (!user || !bcrypt.compareSync(password, user.password))
    return next(new AppError("Wrong Email or password", 401));

  jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    (err, token) => {
      if (err) return next(new AppError("Token creation failed", 500));
      res.status(200).json({ message: "success..", token });
    }
  );
});

//update user

const updateUser = catchError(async (req, res, next) => {
  if (!req.user) return next(new AppError("you are not authorized", 401));

  const { name, email, password } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError("user not found", 404));

  // Hash the password only if it's provided in the request body
  const hashPassword = password ? bcrypt.hashSync(password, 8) : user.password;

  //Check if the update email is exist with another user
  if (email && email !== user.email) {
    const emailExist = await User.findOne({ email });
    if (emailExist) return next(new AppError("Email already exists", 409));
  }

  // Update the user object with the new values
  user.name = name || user.name;
  user.email = email || user.email;
  user.password = hashPassword;

  // Save the updated user object to the database
  await user.save();

  // Hide the password from the response
  user.password = undefined;

  res.status(200).json({ message: "updated", user });
});

//delete user
const deleteUser = catchError(async (req, res, next) => {
  if (!req.user) return next(new AppError("you are not authorized", 401));
  // delete a user
  const isUser = await User.findByIdAndDelete(req.params.id);
  if (!isUser) return next(new AppError("User not found", 404));

  // Delete categories associated with the user
  await Category.deleteMany({ user: req.params.id });

  // Delete tasks associated with the user
  await Task.deleteMany({ user: req.params.id });

  res.status(200).json({ message: "user deleted" });
});

export { signup, signin, otpVerify, updateUser, deleteUser };

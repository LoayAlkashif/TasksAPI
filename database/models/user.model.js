import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["User", "Company_HR"],
    },
    otp: String,
    otpExpire: Date,
    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: { updatedAt: false } }
);

export const User = model("User", schema);

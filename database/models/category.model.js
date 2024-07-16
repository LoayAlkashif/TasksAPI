import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    name: String,
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false, timestamps: { updatedAt: false } }
);

export const Category = model("Category", schema);

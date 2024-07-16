import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "list"],
      required: true,
    },
    content: { type: Schema.Types.Mixed },
    shared: {
      type: String,
      enum: ["public", "private"],
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false, timestamps: { updatedAt: false } }
);

export const Task = model("Task", schema);

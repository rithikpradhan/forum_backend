import mongoose from "mongoose";

const threadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Discussion", "Question", "Announcement", "Tutorial", "Showcase"],
      default: "Discussion",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    view: {
      type: Number,
      default: 0,
    },
    replies: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Thread", threadSchema);

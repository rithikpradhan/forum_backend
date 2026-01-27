import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Add index for faster queries
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["reply", "mention", "like"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
    },
    threadTitle: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true, // Add index for unread queries
    },
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);

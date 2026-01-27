import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: String,
    replyingTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);

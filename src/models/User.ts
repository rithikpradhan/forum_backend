import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      maxLength: 500,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);

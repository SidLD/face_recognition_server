import mongoose, { Schema, model } from "mongoose";
import { Iimg, IUser } from "../util/interface";

// Profile Schema
const profileSchema = new Schema<Iimg>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    imageType: { type: String },
    path: { type: String },
    name: { type: String },
    fullPath: { type: String },
    base64: { type: String },
  },
  { timestamps: true }
);

enum RoleType {
  ADMIN = "ADMIN",
  USER = "USER"
}

// User Schema
const userSchema = new Schema<IUser>(
  {
    username: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      middleName: { type: String },
    },
    password: {
      type: String,
      required: false, // Make sure to hash this if needed
    },
    contact: { type: String, required: true },
    course: { type: String, required: true },
    role: {
      type: String,
      enum: RoleType
    },
    profile: {
      type: profileSchema, // Embed the profile schema directly
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);

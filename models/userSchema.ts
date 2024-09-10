import mongoose, { Schema, model } from "mongoose";
import { Iimg, IUser } from "../util/interface";

const profileSchema = new Schema<Iimg>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    imageType: String,
    path: String,
    name: String,
    fullPath: String,
    base64: String,  
  },
  { timestamps: true }
);

enum RoleType {
  USER = "USER",
  ADMIN = "ADMIN"
}

enum StatusType {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED'
}

const userSchema = new Schema<IUser>(
  {
    username: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      middleName: String,  // Optional field
    },
    password: {
      type: String,
      required: false, 
    },
    contact: { type: String, required: true },
    course: { type: String, required: true },
    role: {
      enum: Object.values(RoleType),
      required: true,
    },
    status: {
      enum: Object.values(StatusType),
      required: true,
    },
    profile: { type: profileSchema, required: true },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);

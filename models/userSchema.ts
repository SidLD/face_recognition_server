import mongoose, { Schema, model } from "mongoose";
import { Iimg, IUser } from "../util/interface";

// Profile Schema
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
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED'
}

const userSchema = new Schema<IUser>(
  {
    username: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      middleName: { type: String }, 
    },
    password: {
      type: String,
      required: false, 
    },
    contact: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    role: {
      type: String, 
      enum: Object.values(RoleType),
      required: true,
      default: RoleType.USER
    },
    status: {
      type: String, 
      enum: Object.values(StatusType),
      required: true,
      default: StatusType.PENDING
    },
    profile: {
      type: profileSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);

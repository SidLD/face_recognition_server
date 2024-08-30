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
    base64: String
  },
  { timestamps: true }
);


const userSchema = new Schema<IUser>(
  {
    username: {
      firstName:String,
      lastName:String,
      middleName: String,
    },
    password: String,
    email: String,
    profile: profileSchema,
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);
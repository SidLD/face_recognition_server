import mongoose, { Schema, model } from "mongoose";
import {  UserAttendance } from "../util/interface";


const userAttendance = new Schema<UserAttendance>(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true, 
    },
    timeInImgAM: String,
    timeOutImgAM: String,
    timeInImgPM: String,
    timeOutImgPM: String,
    date: {
        type: Date,
        default: new Date()
    },
    timeInAM: Date,
    timeOutAM: Date,
    timeInPM: Date,
    timeOutPM: Date
  },
  {
    timestamps: true,
  }
);

export default model<UserAttendance>("UserAttendance", userAttendance);

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
    timeInImg: String,
    timeOutImg: String,
    date: {
        type: Date,
        default: new Date()
    },
    timeIn: Date,
    timeOut: Date
  },
  {
    timestamps: true,
  }
);

export default model<UserAttendance>("UserAttendance", userAttendance);

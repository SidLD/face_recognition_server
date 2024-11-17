import mongoose, { Schema, model } from "mongoose";
import {  UserAttendance } from "../util/interface";
import { type } from "os";


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
    timeOutPM: Date,
    service_time: {
      hour: {
        type: Number,
        default: 0
      },
      minute: {
        type: Number,
        default: 0
      }
   }
  },
  {
    timestamps: true,
  }
);

export default model<UserAttendance>("UserAttendance", userAttendance);

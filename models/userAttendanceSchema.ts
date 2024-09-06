import mongoose, { Schema, model } from "mongoose";
import { AttendanceSetting, IUser, LoginType, UserAttendance } from "../util/interface";

const attendanceSetting = new Schema<AttendanceSetting>(
  { 
    status: String,
    timeIn: {
        start: Date,
        end: Date
    },
    timeOut: {
        start: Date,
        end: Date
    }
  },
  { timestamps: true }
);


const userAttendance = new Schema<UserAttendance>(
  {
    attendance: { type: attendanceSetting, required: true },
    type: {
        enum: LoginType
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    img: String,
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

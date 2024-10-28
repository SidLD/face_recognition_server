import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  userid: mongoose.Schema.Types.ObjectId;
  companyid: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Notification = mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;

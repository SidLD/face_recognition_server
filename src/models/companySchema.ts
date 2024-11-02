import mongoose, { Schema, model } from "mongoose";
import { ICompany, StatusType } from "../util/interface";

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, 
  }
);

export default model<ICompany>("Company", companySchema);

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../util/interface';

interface IUserAttachment extends Document {
  filename: string;
  fileUrl: string;
  fileType: string;
  description: string;
  uploadedAt: Date;
  user: IUser
}

const UserAttachmentSchema: Schema = new Schema<IUserAttachment>({
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  description: {type: String},
  uploadedAt: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

const UserAttachment = mongoose.model<IUserAttachment>('UserAttachment', UserAttachmentSchema);

export default UserAttachment;
export { IUserAttachment };

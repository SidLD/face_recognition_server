import mongoose, { Schema, Document } from 'mongoose';

interface IAttachment extends Document {
  filename: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: Date;
}

const AttachmentSchema: Schema = new Schema<IAttachment>({
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const Attachment = mongoose.model<IAttachment>('Attachment', AttachmentSchema);

export default Attachment;
export { IAttachment };

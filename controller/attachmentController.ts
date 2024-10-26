import { Request, Response } from 'express';
import Attachment, { IAttachment } from '../models/attachmentSchema';

export const createAttachment = async (req: Request, res: Response) => {
  try {
    const { fileUrl, fileName, fileType } = req.body;

    if (!fileUrl || !fileName || !fileType ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAttachment = await Attachment.create({
      filename: fileName,
      fileUrl,
      fileType
    });

    return res.status(201).json({ message: 'Attachment saved successfully', attachment: newAttachment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save attachment' });
  }
};

export const getAttachments = async (req: Request, res: Response) => {
  try {
    const {id} = req.query;
    let attachments: IAttachment[] = [];
    if(id == 'all'){
        attachments = await Attachment.find({ _id: id });
    }else{
        attachments = await Attachment.find();
    }
    res.status(200).json(attachments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
};

export const updateAttachment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { filename, fileUrl, fileType } = req.body;
  
      const updatedAttachment = await Attachment.findByIdAndUpdate(
        id,
        { filename, fileUrl, fileType },
        { new: true } 
      );
  
      if (!updatedAttachment) {
        return res.status(404).json({ error: 'Attachment not found' });
      }
  
      res.status(200).json({ message: 'Attachment updated successfully', attachment: updatedAttachment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update attachment' });
    }
  };


export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attachment = await Attachment.findById(id);
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    await Attachment.deleteOne({_id: attachment._id})

    res.status(200).json({ message: 'Attachment deleted successfully', fileUrl: attachment.fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
};

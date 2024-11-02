import { Request, Response } from 'express';
import Attachment, { IAttachment } from '../models/attachmentSchema';
import UserAttachment from '../models/userAttachmentSchema';

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

export const searchAttachments = async (req: Request, res: Response) => {
  try {
    const { filename } = req.query;
    let attachments: IAttachment[] = [];
    attachments = await Attachment.find({ filename: { $regex: filename, $options: 'i' } });
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

export const createUserAttachment = async (req: Request, res: Response) => {
  try {
    const { fileUrl, fileName, fileType } = req.body;
    const { userId } = req.params;
    if (!fileUrl || !fileName || !fileType ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAttachment = await UserAttachment.create({
      filename: fileName,
      fileUrl,
      fileType,
      user: userId
    });

    return res.status(201).json({ message: 'Attachment saved successfully', attachment: newAttachment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save attachment' });
  }
};

export const getUserAttachments = async (req: Request, res: Response) => {
  try {
    const {id} = req.query;
    const { userId } = req.params;
    let attachments: IAttachment[] = [];
    if(id == 'all'){
        attachments = await UserAttachment.find({ _id: id, user: userId });
    }else{
        attachments = await UserAttachment.find({ user: userId });
    }
    res.status(200).json(attachments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
};

export const searchUserAttachments = async (req: Request, res: Response) => {
  try {
    const { filename } = req.query;
    const { userId } = req.params;
    let attachments: IAttachment[] = [];
    attachments = await UserAttachment.find({ filename: { $regex: filename, $options: 'i' }, user: userId });
    res.status(200).json(attachments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
};

export const updateUserAttachment = async (req: Request, res: Response) => {
    try {
      const { userId, attachmentId } = req.params;
      const { filename, fileUrl, fileType } = req.body;
  
      const updatedAttachment = await UserAttachment.findOneAndUpdate(
        { _id: attachmentId, user: userId},
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

export const deleteUserAttachment = async (req: Request, res: Response) => {
  try {
    const { userId, attachmentId } = req.params;

    const attachment = await UserAttachment.findOne({
      user: userId,
      _id: attachmentId
    });
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    await UserAttachment.deleteOne({_id: attachment._id})

    res.status(200).json({ message: 'Attachment deleted successfully', fileUrl: attachment.fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
};
import express from 'express';
import { createAttachment, deleteAttachment, getAttachments, updateAttachment } from '../controller/attachmentController';
import { verifyToken } from '../util/verify';

const attachmentAPI = express.Router();

attachmentAPI.post('/attachment',   verifyToken , createAttachment);
attachmentAPI.put('/attachments/:id',    verifyToken , updateAttachment);
attachmentAPI.delete('/attachments/:id', verifyToken , deleteAttachment);
attachmentAPI.get('/attachments/:id',    verifyToken , getAttachments);

attachmentAPI.get('/attachments' , getAttachments);

export default attachmentAPI;

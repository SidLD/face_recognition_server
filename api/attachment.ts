import express from 'express';
import { createAttachment, createUserAttachment, deleteAttachment, deleteUserAttachment, getAttachments, getUserAttachments, updateAttachment, updateUserAttachment } from '../controller/attachmentController';
import { verifyToken } from '../util/verify';

const attachmentAPI = express.Router();

attachmentAPI.post('/attachment',   verifyToken , createAttachment);
attachmentAPI.put('/attachments/:id',    verifyToken , updateAttachment);
attachmentAPI.delete('/attachments/:id', verifyToken , deleteAttachment);
attachmentAPI.get('/attachments/:id',    verifyToken , getAttachments);

attachmentAPI.post('/user/:userId/attachment' , createUserAttachment);
attachmentAPI.put('/user/:userId/attachments/:attachmentId' , updateUserAttachment);
attachmentAPI.delete('/user/:userId/attachments/:attachmentId' , deleteUserAttachment);
attachmentAPI.get('/user/:userId/attachments/:attachmentId' , getUserAttachments);

attachmentAPI.get('/attachments' , getAttachments);

export default attachmentAPI;

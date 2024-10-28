import express from 'express';
import dotenv from 'dotenv';
import { verifyToken } from '../util/verify';
import { 
  getAllNotifications, 
  markAsRead 
} from '../controller/notificationController';

dotenv.config();
const notificationAPI = express();

notificationAPI.get('/notifications', verifyToken, getAllNotifications);
notificationAPI.put('/notifications/:id/read', verifyToken, markAsRead);

export default notificationAPI;

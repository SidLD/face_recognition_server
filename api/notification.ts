import express from 'express';
import dotenv from 'dotenv';
import { 
  getAllNotifications, 
  markAsRead 
} from '../controller/notificationController';

dotenv.config();
const notificationAPI = express();

notificationAPI.get('/notifications/:userId', getAllNotifications);
notificationAPI.put('/notifications/:id/read', markAsRead);

export default notificationAPI;

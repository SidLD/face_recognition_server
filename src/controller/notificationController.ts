import { Request, Response } from 'express';
import Notification from '../models/notificationSchema';

interface CreateNotificationParams {
    userid: String;
    companyid: String;
    title: String;
    description: String;
  }
  
  export const createNotification = async (data: CreateNotificationParams) => {
    try {
      const { userid, companyid, title, description } = data;
      const notification = new Notification({ userid, companyid, title, description });
      await notification.save();
      return notification;
    } catch (error) {
        console.log(error)
    }
  };

  export const getAllNotifications = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const notifications = await Notification.find({
        userid: userId
      }).sort({ createdAt: -1 });
      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving notifications", error });
    }
  };  


// Mark a notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    
    notification.isRead = true;
    await notification.save();
    return res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to mark notification as read", error });
  }
};

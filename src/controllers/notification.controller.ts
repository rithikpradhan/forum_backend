import { Response } from "express";
import Notification from "../models/Notification";

export const getNotifications = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("📬 Fetching notifications for user:", req.user.name);

    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .populate("sender", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`✅ Found ${notifications.length} notifications`);

    res.json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAsRead = async (req: any, res: Response) => {
  try {
    const { notificationId } = req.params;

    console.log("📖 Marking notification as read:", notificationId);

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: req.user._id },
      { read: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    console.log("✅ Notification marked as read");

    res.json({ notification });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAllAsRead = async (req: any, res: Response) => {
  try {
    console.log("📖 Marking all notifications as read for:", req.user.name);

    const result = await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true },
    );

    console.log(`✅ Marked ${result.modifiedCount} notifications as read`);

    res.json({
      message: "All notifications marked as read",
      count: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUnreadCount = async (req: any, res: Response) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.json({ count });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNotification = async (req: any, res: Response) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

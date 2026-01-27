import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
} from "../controllers/notification.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getNotifications);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.put("/:notificationId/read", authMiddleware, markAsRead);
router.put("/mark-all-read", authMiddleware, markAllAsRead);
router.delete("/:notificationId", authMiddleware, deleteNotification);

export default router;

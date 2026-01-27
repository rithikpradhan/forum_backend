"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.getUnreadCount = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getNotifications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("📬 Fetching notifications for user:", req.user.name);
        const notifications = await Notification_1.default.find({
            recipient: req.user._id,
        })
            .populate("sender", "name")
            .sort({ createdAt: -1 })
            .limit(50);
        console.log(`✅ Found ${notifications.length} notifications`);
        res.json({ notifications });
    }
    catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        console.log("📖 Marking notification as read:", notificationId);
        const notification = await Notification_1.default.findOneAndUpdate({ _id: notificationId, recipient: req.user._id }, { read: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        console.log("✅ Notification marked as read");
        res.json({ notification });
    }
    catch (error) {
        console.error("Mark as read error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        console.log("📖 Marking all notifications as read for:", req.user.name);
        const result = await Notification_1.default.updateMany({ recipient: req.user._id, read: false }, { read: true });
        console.log(`✅ Marked ${result.modifiedCount} notifications as read`);
        res.json({
            message: "All notifications marked as read",
            count: result.modifiedCount,
        });
    }
    catch (error) {
        console.error("Mark all as read error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.markAllAsRead = markAllAsRead;
const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification_1.default.countDocuments({
            recipient: req.user._id,
            read: false,
        });
        res.json({ count });
    }
    catch (error) {
        console.error("Get unread count error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUnreadCount = getUnreadCount;
const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification_1.default.findOneAndDelete({
            _id: notificationId,
            recipient: req.user._id,
        });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.json({ message: "Notification deleted" });
    }
    catch (error) {
        console.error("Delete notification error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=notification.controller.js.map
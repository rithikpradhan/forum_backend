"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.default, notification_controller_1.getNotifications);
router.get("/unread-count", auth_middleware_1.default, notification_controller_1.getUnreadCount);
router.put("/:notificationId/read", auth_middleware_1.default, notification_controller_1.markAsRead);
router.put("/mark-all-read", auth_middleware_1.default, notification_controller_1.markAllAsRead);
router.delete("/:notificationId", auth_middleware_1.default, notification_controller_1.deleteNotification);
exports.default = router;
//# sourceMappingURL=notification.route.js.map
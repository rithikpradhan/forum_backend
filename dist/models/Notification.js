"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    recipient: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true, // Add index for faster queries
    },
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["reply", "mention", "like"],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    thread: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Thread",
        required: true,
    },
    threadTitle: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
        index: true, // Add index for unread queries
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Notification", notificationSchema);
//# sourceMappingURL=Notification.js.map
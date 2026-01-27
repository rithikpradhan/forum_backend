"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const threadSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["Discussion", "Question", "Announcement", "Tutorial", "Showcase"],
        default: "Discussion",
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    view: {
        type: Number,
        default: 0,
    },
    replies: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Thread", threadSchema);
//# sourceMappingURL=Thread.js.map
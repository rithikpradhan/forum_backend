"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    thread: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Thread",
        required: true,
    },
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: String,
    replyingTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Message",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Message", messageSchema);
//# sourceMappingURL=Message.js.map
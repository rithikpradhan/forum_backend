"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessagesByThread = exports.sendMessage = void 0;
const server_1 = require("../server");
const Notification_1 = __importDefault(require("../models/Notification"));
const Message_1 = __importDefault(require("../models/Message"));
const Thread_1 = __importDefault(require("../models/Thread"));
const sendMessage = async (req, res) => {
    try {
        const { threadId, content, image, replyingTo } = req.body;
        console.log("Incoming message:", req.body);
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!threadId || !content) {
            return res.status(400).json({ message: "threadId and content required" });
        }
        const thread = await Thread_1.default.findById(threadId).populate("author");
        if (!thread) {
            return res.status(404).json({ message: "Thread not found" });
        }
        // Handle replyingTo - it can be either a messageId or an object
        let replyingToId = null;
        if (replyingTo) {
            if (typeof replyingTo === "string") {
                replyingToId = replyingTo;
            }
            else if (replyingTo._id) {
                replyingToId = replyingTo._id;
            }
        }
        // Create message
        const message = await Message_1.default.create({
            thread: threadId,
            sender: req.user._id,
            content,
            image,
            replyingTo: replyingToId,
        });
        // Populate sender info
        await message.populate("sender", "name");
        // Populate replyingTo if exists
        let replyingData = null;
        if (message.replyingTo) {
            await message.populate({
                path: "replyingTo",
                populate: { path: "sender", select: "name" },
            });
            const replyMsg = message.replyingTo;
            replyingData = {
                _id: replyMsg._id,
                name: replyMsg.sender?.name || "Unknown",
                content: replyMsg.content,
            };
        }
        // Format for frontend
        const formattedMessage = {
            _id: message._id,
            thread: message.thread,
            content: message.content,
            image: message.image,
            createdAt: message.createdAt,
            author: {
                _id: message.sender._id,
                name: message.sender.name,
            },
            replyingTo: replyingData,
        };
        // Emit to socket
        server_1.io.to(threadId).emit("newMessage", formattedMessage);
        if (replyingToId) {
            const replyingToMessage = await Message_1.default.findById(replyingToId).populate("sender");
            if (replyingToMessage &&
                replyingToMessage.sender._id.toString() !==
                    req.user._id.toString()) {
                console.log(`🔔 Creating reply notification for ${replyingToMessage.sender.name}`);
                const notification = await Notification_1.default.create({
                    recipient: replyingToMessage.sender._id,
                    sender: req.user._id,
                    type: "reply",
                    message: `${req.user.name} replied to your message`,
                    thread: threadId,
                    threadTitle: thread.title,
                });
                const populatedNotification = await Notification_1.default.findById(notification._id).populate("sender", "name");
                // Emit notification via socket to the recipient's personal room
                server_1.io.to(replyingToMessage.sender._id.toString()).emit("newNotification", populatedNotification);
                console.log(`✅ Notification sent to user ${replyingToMessage.sender._id}`);
            }
        }
        // 2. Notify thread author (if not the sender and not already notified via reply)
        const threadAuthorId = thread.author._id.toString();
        const senderId = req.user._id.toString();
        if (threadAuthorId !== senderId) {
            // Only notify thread author if we didn't already notify them via reply
            if (!replyingToId ||
                (replyingToId &&
                    threadAuthorId !==
                        (await Message_1.default.findById(replyingToId).then((m) => m?.sender?._id.toString())))) {
                console.log(`🔔 Creating thread notification for ${thread.author.name}`);
                const notification = await Notification_1.default.create({
                    recipient: threadAuthorId,
                    sender: req.user._id,
                    type: "reply",
                    message: `${req.user.name} replied to your thread`,
                    thread: threadId,
                    threadTitle: thread.title,
                });
                const populatedNotification = await Notification_1.default.findById(notification._id).populate("sender", "name");
                // Emit notification via socket
                server_1.io.to(threadAuthorId).emit("newNotification", populatedNotification);
                console.log(`✅ Notification sent to thread author ${threadAuthorId}`);
            }
        }
        // 3. Check for @mentions in content
        const mentionRegex = /@(\w+)/g;
        const mentions = content.match(mentionRegex);
        if (mentions) {
            console.log(`👤 Found mentions:`, mentions);
            // For each mention, find the user and create notification
            for (const mention of mentions) {
                const username = mention.substring(1); // Remove @
                const User = require("../models/User").default;
                const mentionedUser = await User.findOne({ name: username });
                if (mentionedUser && mentionedUser._id.toString() !== senderId) {
                    console.log(`🔔 Creating mention notification for ${mentionedUser.name}`);
                    const notification = await Notification_1.default.create({
                        recipient: mentionedUser._id,
                        sender: req.user._id,
                        type: "mention",
                        message: `${req.user.name} mentioned you`,
                        thread: threadId,
                        threadTitle: thread.title,
                    });
                    const populatedNotification = await Notification_1.default.findById(notification._id).populate("sender", "name");
                    server_1.io.to(mentionedUser._id.toString()).emit("newNotification", populatedNotification);
                    console.log(`✅ Mention notification sent to ${mentionedUser._id}`);
                }
            }
        }
        return res.status(201).json(formattedMessage);
    }
    catch (error) {
        console.error("SEND MESSAGE ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.sendMessage = sendMessage;
const getMessagesByThread = async (req, res) => {
    const messages = await Message_1.default.find({
        thread: req.params.threadId,
    })
        .populate("sender", "name email")
        .sort({ createdAt: 1 });
    res.json(messages);
};
exports.getMessagesByThread = getMessagesByThread;
//# sourceMappingURL=message.controller.js.map
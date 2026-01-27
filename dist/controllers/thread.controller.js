"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThreadById = exports.getAllThreads = exports.createThread = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Thread_1 = __importDefault(require("../models/Thread"));
const Message_1 = __importDefault(require("../models/Message"));
const createThread = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        console.log("Creating thread:", { title, category, user: req.user?.name });
        if (!title || !content) {
            return res
                .status(400)
                .json({ message: " Title and content are required" });
        }
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const thread = await Thread_1.default.create({
            title,
            content,
            category: category || " Discussion",
            author: req.user._id,
        });
        // Populate author details
        await thread.populate("author", "name");
        console.log("Thread Created:", thread._id);
        res.status(201).json(thread);
    }
    catch (error) {
        res
            .status(500)
            .json({
            message: " Failed to create thread",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createThread = createThread;
const getAllThreads = async (_, res) => {
    const threads = await Thread_1.default.find()
        .populate("author", "name")
        .sort({ createdAt: -1 });
    res.json({ threads });
};
exports.getAllThreads = getAllThreads;
const getThreadById = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Fetching thread:", id);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid thread id" });
        }
        const thread = await Thread_1.default.findById(id).populate("author", "name");
        if (!thread) {
            return res.status(404).json({ message: "Thread not found" });
        }
        // FIX: Changed 'author' to 'sender' to match Message model
        const messages = await Message_1.default.find({ thread: id })
            .populate("sender", "name")
            .populate({
            path: "replyingTo",
            populate: { path: "sender", select: "name" },
        })
            .sort({ createdAt: 1 });
        // Transform messages to match frontend expectations
        const formattedMessages = messages.map((msg) => ({
            _id: msg._id,
            thread: msg.thread,
            content: msg.content,
            image: msg.image,
            createdAt: msg.createdAt,
            author: {
                // Frontend expects 'author', not 'sender'
                _id: msg.sender._id,
                name: msg.sender.name,
            },
            replyingTo: msg.replyingTo
                ? {
                    name: msg.replyingTo.sender?.name || "Unknown",
                    content: msg.replyingTo.content,
                }
                : undefined,
        }));
        console.log(`Found ${formattedMessages.length} messages for thread ${id}`);
        res.json({
            thread,
            messages: formattedMessages,
        });
    }
    catch (error) {
        console.error("Thread fetch error:", error);
        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getThreadById = getThreadById;
//# sourceMappingURL=thread.controller.js.map
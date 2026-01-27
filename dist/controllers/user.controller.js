"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserThreads = exports.updateUserProfile = exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const Thread_1 = __importDefault(require("../models/Thread"));
const Message_1 = __importDefault(require("../models/Message"));
const getUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("📋 Fetching profile for:", req.user.name);
        // Get user details
        const user = await User_1.default.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Get user's threads
        const threads = await Thread_1.default.find({ author: req.user._id })
            .populate("author", "name")
            .sort({ createdAt: -1 });
        // Calculate statistics
        const totalThreads = threads.length;
        // Count total messages sent by user
        const totalMessages = await Message_1.default.countDocuments({
            sender: req.user._id,
        });
        // Calculate total replies across all user's threads
        const totalReplies = threads.reduce((sum, thread) => sum + (thread.replies || 0), 0);
        // Average replies per thread
        const avgReplies = totalThreads > 0 ? Math.round(totalReplies / totalThreads) : 0;
        console.log(`✅ Profile loaded: ${totalThreads} threads, ${totalMessages} messages`);
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                joinedDate: user.createdAt,
            },
            stats: {
                totalThreads,
                totalMessages,
                totalReplies,
                avgReplies,
            },
            threads: threads.map((thread) => ({
                _id: thread._id,
                title: thread.title,
                content: thread.content,
                category: thread.category,
                replies: thread.replies || 0,
                createdAt: thread.createdAt,
                author: {
                    _id: thread.author._id,
                    name: thread.author.name,
                },
            })),
        });
    }
    catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { name, bio, avatar } = req.body;
        console.log("Updating profile for:", req.user.name);
        // Validate inputs
        if (name && name.trim().length < 2) {
            return res
                .status(400)
                .json({ message: "Name must be at least 2 characters" });
        }
        if (bio && bio.length > 500) {
            return res
                .status(400)
                .json({ message: "Bio must be less than 500 characters" });
        }
        // Update user
        const updatedUser = await User_1.default.findByIdAndUpdate(req.user._id, {
            ...(name && { name: name.trim() }),
            ...(bio !== undefined && { bio: bio.trim() }),
            ...(avatar !== undefined && { avatar }),
        }, { new: true, runValidators: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("✅ Profile updated successfully");
        res.json({
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar,
                joinedDate: updatedUser.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Update user profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateUserProfile = updateUserProfile;
const getUserThreads = async (req, res) => {
    try {
        const { userId } = req.params;
        const { category, sort } = req.query;
        console.log(`Fetching threads for user: ${userId}`);
        // Build query
        let query = { author: userId };
        if (category && category !== "all") {
            query.category = category;
        }
        // Build sort
        let sortOption = { createdAt: -1 }; // Default: most recent
        if (sort === "popular") {
            sortOption = { views: -1 };
        }
        else if (sort === "mostReplies") {
            sortOption = { replies: -1 };
        }
        else if (sort === "mostLikes") {
            sortOption = { likes: -1 };
        }
        const threads = await Thread_1.default.find(query)
            .populate("author", "name")
            .sort(sortOption);
        console.log(` Found ${threads.length} threads`);
        res.json({ threads });
    }
    catch (error) {
        console.error("Get user threads error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUserThreads = getUserThreads;
//# sourceMappingURL=user.controller.js.map
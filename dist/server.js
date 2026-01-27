"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const thread_route_1 = __importDefault(require("./routes/thread.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
(0, db_1.default)();
const PORT = process.env.PORT || 5000;
const server = http_1.default.createServer(app_1.default);
// routes
app_1.default.use("/api/threads", thread_route_1.default);
app_1.default.use("/api/messages", message_route_1.default);
app_1.default.use("/api/notifications", notification_route_1.default);
app_1.default.use("/api/users", user_route_1.default);
// socket.io
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});
// Track online users per thread
const onlineUsers = new Map();
// Socket authentication middleware
exports.io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        console.log(" No token provided");
        return next(new Error("Authentication error"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.id).select("name email");
        if (!user)
            return next(new Error("User not found"));
        socket.userId = user._id.toString();
        socket.userName = user.name;
        socket.userEmail = user.email;
        console.log(" Socket authenticated:", user.name, "ID:", user._id.toString());
        next();
    }
    catch (err) {
        console.error(" Authentication error:", err);
        return next(new Error("Authentication error"));
    }
});
exports.io.on("connection", (socket) => {
    const userId = socket.userId;
    const userName = socket.userName;
    console.log(` ${userName} (${userId}) connected:`, socket.id);
    // JOIN USER'S PERSONAL ROOM FOR NOTIFICATIONS
    socket.join(userId);
    console.log(` ${userName} joined personal notification room: ${userId}`);
    // Join thread and broadcast online users
    socket.on("joinThread", (threadId) => {
        socket.join(threadId);
        console.log(` ${userName} joining thread: ${threadId}`);
        // Initialize thread map if it doesn't exist
        if (!onlineUsers.has(threadId)) {
            onlineUsers.set(threadId, new Map());
        }
        const threadUsers = onlineUsers.get(threadId);
        // Add or update user (use userId as key to prevent duplicates)
        threadUsers.set(userId, {
            socketId: socket.id,
            userId: userId,
            userName: userName,
        });
        // Create array of unique users
        const onlineUsersList = Array.from(threadUsers.values()).map((u) => ({
            userId: u.userId,
            userName: u.userName,
        }));
        console.log(` Online users in thread ${threadId}:`, onlineUsersList);
        // Broadcast to everyone in the thread (including the sender)
        exports.io.to(threadId).emit("onlineUsers", onlineUsersList);
    });
    // Typing indicator
    socket.on("typing", ({ threadId, isTyping }) => {
        console.log(`  ${userName} is ${isTyping ? "typing" : "stopped typing"} in thread ${threadId}`);
        // Send to everyone EXCEPT the sender
        socket.to(threadId).emit("userTyping", {
            userId,
            userName,
            isTyping,
        });
    });
    // Handle disconnect
    socket.on("disconnect", () => {
        console.log(` ${userName} (${userId}) disconnected:`, socket.id);
        // Remove user from all threads they were in
        onlineUsers.forEach((users, threadId) => {
            if (users.has(userId)) {
                users.delete(userId);
                // Broadcast updated list to that thread
                const onlineUsersList = Array.from(users.values()).map((u) => ({
                    userId: u.userId,
                    userName: u.userName,
                }));
                console.log(` Updated online users in thread ${threadId}:`, onlineUsersList);
                exports.io.to(threadId).emit("onlineUsers", onlineUsersList);
                // Clean up empty thread maps
                if (users.size === 0) {
                    onlineUsers.delete(threadId);
                }
            }
        });
    });
    // Error handling
    socket.on("error", (error) => {
        console.error(` Socket error for ${userName}:`, error);
    });
});
server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map
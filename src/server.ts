import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import app from "./app";
import connectDB from "./config/db";
import threadRoute from "./routes/thread.route";
import messageRoute from "./routes/message.route";
import notificationRoute from "./routes/notification.route";
import userRoute from "./routes/user.route";
import User from "./models/User";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

interface JwtPayload {
  id: string;
  name: string;
  email: string;
}

interface SocketUser {
  socketId: string;
  userId: string;
  userName: string;
}

// routes
app.use("/api/threads", threadRoute);
app.use("/api/messages", messageRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/users", userRoute);

// socket.io
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://forum-appfrontend.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  // CRITICAL for Render.com
  transports: ["websocket", "polling"],
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000, // 25 seconds
  upgradeTimeout: 30000, // 30 seconds for websocket upgrade
  maxHttpBufferSize: 1e6, // 1MB
});

// Enhanced socket authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  console.log("🔐 Socket auth attempt from:", socket.handshake.address);
  console.log("🔐 Token present:", !!token);

  if (!token) {
    console.log("❌ No token provided");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("name email");

    if (!user) {
      console.log("❌ User not found for token");
      return next(new Error("User not found"));
    }

    (socket as any).userId = user._id.toString();
    (socket as any).userName = user.name;
    (socket as any).userEmail = user.email;

    console.log(
      "✅ Socket authenticated:",
      user.name,
      "ID:",
      user._id.toString(),
    );
    next();
  } catch (err: any) {
    console.error("❌ Authentication error:", err.message);
    return next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  const userId = (socket as any).userId;
  const userName = (socket as any).userName;

  console.log(`✅✅✅ ${userName} (${userId}) CONNECTED:`, socket.id);
  console.log(`🚀 Transport: ${socket.conn.transport.name}`);

  // Join personal room
  socket.join(userId);
  console.log(`👤 ${userName} joined personal room: ${userId}`);

  // Join thread handler
  socket.on("joinThread", (threadId: string) => {
    socket.join(threadId);
    console.log(`📍📍 ${userName} JOINING THREAD: ${threadId}`);

    if (!onlineUsers.has(threadId)) {
      onlineUsers.set(threadId, new Map());
    }

    const threadUsers = onlineUsers.get(threadId)!;
    threadUsers.set(userId, {
      socketId: socket.id,
      userId: userId,
      userName: userName,
    });

    const onlineUsersList = Array.from(threadUsers.values()).map((u) => ({
      userId: u.userId,
      userName: u.userName,
    }));

    console.log(
      `👥👥 EMITTING online users for thread ${threadId}:`,
      onlineUsersList,
    );
    io.to(threadId).emit("onlineUsers", onlineUsersList);
  });

  // Typing indicator
  socket.on(
    "typing",
    ({ threadId, isTyping }: { threadId: string; isTyping: boolean }) => {
      console.log(
        `⌨️  ${userName} ${isTyping ? "typing" : "stopped typing"} in ${threadId}`,
      );
      socket.to(threadId).emit("userTyping", { userId, userName, isTyping });
    },
  );

  // Disconnect handler
  socket.on("disconnect", (reason) => {
    console.log(`❌❌ ${userName} DISCONNECTED:`, reason);

    onlineUsers.forEach((users, threadId) => {
      if (users.has(userId)) {
        users.delete(userId);

        const onlineUsersList = Array.from(users.values()).map((u) => ({
          userId: u.userId,
          userName: u.userName,
        }));

        console.log(
          `👥 Updated online users in thread ${threadId}:`,
          onlineUsersList,
        );
        io.to(threadId).emit("onlineUsers", onlineUsersList);

        if (users.size === 0) {
          onlineUsers.delete(threadId);
        }
      }
    });
  });

  socket.on("error", (error) => {
    console.error(`❌ Socket error for ${userName}:`, error);
  });
});

// Track online users per thread
const onlineUsers = new Map<string, Map<string, SocketUser>>();

// Socket authentication middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log(" No token provided");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("name email");
    if (!user) return next(new Error("User not found"));

    (socket as any).userId = user._id.toString();
    (socket as any).userName = user.name;
    (socket as any).userEmail = user.email;

    console.log(
      " Socket authenticated:",
      user.name,
      "ID:",
      user._id.toString(),
    );
    next();
  } catch (err) {
    console.error(" Authentication error:", err);
    return next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  const userId = (socket as any).userId;
  const userName = (socket as any).userName;

  console.log(` ${userName} (${userId}) connected:`, socket.id);

  // JOIN USER'S PERSONAL ROOM FOR NOTIFICATIONS
  socket.join(userId);
  console.log(` ${userName} joined personal notification room: ${userId}`);

  // Join thread and broadcast online users
  socket.on("joinThread", (threadId: string) => {
    socket.join(threadId);

    console.log(` ${userName} joining thread: ${threadId}`);

    // Initialize thread map if it doesn't exist
    if (!onlineUsers.has(threadId)) {
      onlineUsers.set(threadId, new Map());
    }

    const threadUsers = onlineUsers.get(threadId)!;

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
    io.to(threadId).emit("onlineUsers", onlineUsersList);
  });

  // Typing indicator
  socket.on(
    "typing",
    ({ threadId, isTyping }: { threadId: string; isTyping: boolean }) => {
      console.log(
        `  ${userName} is ${isTyping ? "typing" : "stopped typing"} in thread ${threadId}`,
      );

      // Send to everyone EXCEPT the sender
      socket.to(threadId).emit("userTyping", {
        userId,
        userName,
        isTyping,
      });
    },
  );

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

        console.log(
          ` Updated online users in thread ${threadId}:`,
          onlineUsersList,
        );

        io.to(threadId).emit("onlineUsers", onlineUsersList);

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

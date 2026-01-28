import { io } from "../server";
import Notification from "../models/Notification";
import { Request, Response } from "express";
import Message from "../models/Message";
import Thread from "../models/Thread";

export const sendMessage = async (req: any, res: Response) => {
  try {
    const { threadId, content, image, replyingTo } = req.body;

    console.log("Incoming message:", req.body);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!threadId || !content) {
      return res.status(400).json({ message: "threadId and content required" });
    }

    const thread = await Thread.findById(threadId).populate("author");
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // Handle replyingTo

    let replyingToId = null;
    if (replyingTo) {
      if (typeof replyingTo === "string" && replyingTo.length === 24) {
        replyingToId = replyingTo;
      } else if (replyingTo._id) {
        replyingToId = replyingTo._id;
      }
      console.log(" Replying to message ID:", replyingToId);
    }

    // Create message
    const message = await Message.create({
      thread: threadId,
      sender: req.user._id,
      content,
      image,
      replyingTo: replyingToId,
    });

    // Populate sender info
    await message.populate("sender", "name");

    // Populate replyingTo if exists
    let replyingToData = null;
    if (message.replyingTo) {
      await message.populate({
        path: "replyingTo",
        populate: { path: "sender", select: "name" },
      });

      const replyMsg = message.replyingTo as any;
      replyingToData = {
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
        _id: (message.sender as any)._id,
        name: (message.sender as any).name,
      },
      replyingTo: replyingToData,
    };

    // Emit to socket
    io.to(threadId).emit("newMessage", formattedMessage);
    if (replyingToId) {
      const replyingToMessage =
        await Message.findById(replyingToId).populate("sender");

      if (
        replyingToMessage &&
        (replyingToMessage.sender as any)._id.toString() !==
          req.user._id.toString()
      ) {
        console.log(
          `🔔 Creating reply notification for ${(replyingToMessage.sender as any).name}`,
        );

        const notification = await Notification.create({
          recipient: (replyingToMessage.sender as any)._id,
          sender: req.user._id,
          type: "reply",
          message: `${req.user.name} replied to your message`,
          thread: threadId,
          threadTitle: (thread as any).title,
        });

        const populatedNotification = await Notification.findById(
          notification._id,
        ).populate("sender", "name");

        // Emit notification via socket to the recipient's personal room
        io.to((replyingToMessage.sender as any)._id.toString()).emit(
          "newNotification",
          populatedNotification,
        );

        console.log(
          `✅ Notification sent to user ${(replyingToMessage.sender as any)._id}`,
        );
      }
    }

    // 2. Notify thread author (if not the sender and not already notified via reply)
    const threadAuthorId = (thread as any).author._id.toString();
    const senderId = req.user._id.toString();

    if (threadAuthorId !== senderId) {
      // Only notify thread author if we didn't already notify them via reply
      if (
        !replyingToId ||
        (replyingToId &&
          threadAuthorId !==
            (await Message.findById(replyingToId).then((m) =>
              (m?.sender as any)?._id.toString(),
            )))
      ) {
        console.log(
          `🔔 Creating thread notification for ${(thread as any).author.name}`,
        );

        const notification = await Notification.create({
          recipient: threadAuthorId,
          sender: req.user._id,
          type: "reply",
          message: `${req.user.name} replied to your thread`,
          thread: threadId,
          threadTitle: (thread as any).title,
        });

        const populatedNotification = await Notification.findById(
          notification._id,
        ).populate("sender", "name");

        // Emit notification via socket
        io.to(threadAuthorId).emit("newNotification", populatedNotification);

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
          console.log(
            `🔔 Creating mention notification for ${mentionedUser.name}`,
          );

          const notification = await Notification.create({
            recipient: mentionedUser._id,
            sender: req.user._id,
            type: "mention",
            message: `${req.user.name} mentioned you`,
            thread: threadId,
            threadTitle: (thread as any).title,
          });

          const populatedNotification = await Notification.findById(
            notification._id,
          ).populate("sender", "name");

          io.to(mentionedUser._id.toString()).emit(
            "newNotification",
            populatedNotification,
          );

          console.log(`✅ Mention notification sent to ${mentionedUser._id}`);
        }
      }
    }

    return res.status(201).json(formattedMessage);
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesByThread = async (req: any, res: Response) => {
  const messages = await Message.find({
    thread: req.params.threadId,
  })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });
  res.json(messages);
};

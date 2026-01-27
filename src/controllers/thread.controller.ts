import mongoose from "mongoose";
import { Request, Response } from "express";
import Thread from "../models/Thread";
import Message from "../models/Message";

export const createThread = async (req: any, res: Response) => {
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

    const thread = await Thread.create({
      title,
      content,
      category: category || " Discussion",
      author: req.user._id,
    });

    // Populate author details

    await thread.populate("author", "name");
    console.log("Thread Created:", thread._id);
    res.status(201).json(thread);
  } catch (error) {
    res
      .status(500)
      .json({
        message: " Failed to create thread",
        error: error instanceof Error ? error.message : "Unknown error",
      });
  }
};

export const getAllThreads = async (_: Request, res: Response) => {
  const threads = await Thread.find()
    .populate("author", "name")
    .sort({ createdAt: -1 });
  res.json({ threads });
};

export const getThreadById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    console.log("Fetching thread:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid thread id" });
    }

    const thread = await Thread.findById(id).populate("author", "name");

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // FIX: Changed 'author' to 'sender' to match Message model
    const messages = await Message.find({ thread: id })
      .populate("sender", "name")
      .populate({
        path: "replyingTo",
        populate: { path: "sender", select: "name" },
      })
      .sort({ createdAt: 1 });

    // Transform messages to match frontend expectations
    const formattedMessages = messages.map((msg: any) => ({
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
  } catch (error) {
    console.error("Thread fetch error:", error);
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

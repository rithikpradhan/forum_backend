import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Register a new user

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login a user

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Crendentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user info

export const getMe = async (req: any, res: any) => {
  res.json({
    user: req.user,
  });
};

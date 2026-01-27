"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.register = register;
// Login a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Crendentials" });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
// Get current user info
const getMe = async (req, res) => {
    res.json({
        user: req.user,
    });
};
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map
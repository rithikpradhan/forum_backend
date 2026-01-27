import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserThreads,
} from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.get("/:userId/threads", authMiddleware, getUserThreads);

export default router;

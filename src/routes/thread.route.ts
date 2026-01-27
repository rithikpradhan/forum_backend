import { Router } from "express";

import {
  createThread,
  getAllThreads,
  getThreadById,
} from "../controllers/thread.controller";

import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createThread);
router.get("/", authMiddleware, getAllThreads);
router.get("/:id", authMiddleware, getThreadById);
export default router;

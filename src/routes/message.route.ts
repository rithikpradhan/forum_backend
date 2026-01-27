import { Router } from "express";
import {
  sendMessage,
  getMessagesByThread,
} from "../controllers/message.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:threadId", authMiddleware, getMessagesByThread);

export default router;

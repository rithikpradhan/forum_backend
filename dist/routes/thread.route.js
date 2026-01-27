"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const thread_controller_1 = require("../controllers/thread.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.default, thread_controller_1.createThread);
router.get("/", auth_middleware_1.default, thread_controller_1.getAllThreads);
router.get("/:id", auth_middleware_1.default, thread_controller_1.getThreadById);
exports.default = router;
//# sourceMappingURL=thread.route.js.map
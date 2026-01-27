"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.default, message_controller_1.sendMessage);
router.get("/:threadId", auth_middleware_1.default, message_controller_1.getMessagesByThread);
exports.default = router;
//# sourceMappingURL=message.route.js.map
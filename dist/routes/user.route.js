"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.get("/profile", auth_middleware_1.default, user_controller_1.getUserProfile);
router.put("/profile", auth_middleware_1.default, user_controller_1.updateUserProfile);
router.get("/:userId/threads", auth_middleware_1.default, user_controller_1.getUserThreads);
exports.default = router;
//# sourceMappingURL=user.route.js.map
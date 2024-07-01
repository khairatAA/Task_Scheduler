"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getTaskLogs_1 = require("../../controllers/TaskExecution/getTaskLogs");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/:userId", auth_1.generalAuthoriser, getTaskLogs_1.getTaskLogs);
exports.default = router;

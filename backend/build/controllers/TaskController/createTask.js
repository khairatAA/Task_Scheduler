"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = void 0;
const Task_1 = __importDefault(require("../../models/Task"));
const uuid_1 = require("uuid");
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, name, description, execution_time, execution_type, cron_expression } = req.body;
        if (!user_id || !name || !execution_type) {
            return res.status(400).json({
                status: "error",
                message: "User ID, name, and execution type are required",
            });
        }
        if (execution_type === "one-time" && !execution_time) {
            return res.status(400).json({
                status: "error",
                message: "Execution time is required for one-time tasks",
            });
        }
        if (execution_type === "recurring" && !cron_expression) {
            return res.status(400).json({
                status: "error",
                message: "Cron expression is required for recurring tasks",
            });
        }
        const newTask = yield Task_1.default.create({
            id: (0, uuid_1.v4)(),
            user_id,
            name,
            description,
            execution_time: execution_type === "one-time" ? new Date(execution_time) : null,
            execution_type,
            cron_expression: execution_type === "recurring" ? cron_expression : null,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return res.status(201).json({
            status: "success",
            data: newTask,
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});
exports.createTask = createTask;

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
exports.editTask = void 0;
const Task_1 = __importDefault(require("../../models/Task"));
const editTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, description, execution_type, execution_time, cron_expression } = req.body;
        const task = yield Task_1.default.findOne({ where: { id } });
        if (!task) {
            return res.status(404).json({
                status: "error",
                message: "Task not found",
            });
        }
        yield Task_1.default.update({
            name,
            description,
            execution_time: execution_type === "one-time" ? new Date(execution_time) : null,
            execution_type,
            cron_expression: execution_type === "recurring" ? cron_expression : null,
            updatedAt: new Date(),
        }, { where: { id } });
        return res.status(200).json({
            status: "success",
            message: "Task updated successfully",
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
exports.editTask = editTask;

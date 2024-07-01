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
exports.deleteTask = void 0;
const Task_1 = __importDefault(require("../../models/Task"));
const TaskLog_1 = __importDefault(require("../../models/TaskLog"));
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield Task_1.default.findOne({ where: { id } });
        if (!task) {
            return res.status(404).json({
                status: "error",
                message: "Task not found",
            });
        }
        yield TaskLog_1.default.destroy({
            where: {
                task_id: id,
            },
        });
        // Delete the task
        yield Task_1.default.destroy({
            where: {
                id: id,
            },
        });
        return res.status(200).json({
            status: "success",
            message: "Task deleted successfully",
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
exports.deleteTask = deleteTask;

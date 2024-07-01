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
exports.deleteUser = void 0;
const User_1 = __importDefault(require("../../models/User"));
const Task_1 = __importDefault(require("../../models/Task"));
const TaskLog_1 = __importDefault(require("../../models/TaskLog"));
const deleteUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = request.params;
        // Find tasks associated with the user
        const tasks = yield Task_1.default.findAll({ where: { user_id: userId } });
        // Delete task logs associated with each task
        yield Promise.all(tasks.map((task) => __awaiter(void 0, void 0, void 0, function* () {
            // Find task logs associated with the task
            const taskLogs = yield TaskLog_1.default.findAll({ where: { task_id: task.id } });
            // Delete each task log
            yield Promise.all(taskLogs.map((taskLog) => __awaiter(void 0, void 0, void 0, function* () {
                yield taskLog.destroy();
            })));
            // Now delete the task itself
            yield task.destroy();
        })));
        // Now delete the user
        const user = yield User_1.default.findOne({ where: { id: userId } });
        if (!user) {
            return response.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
        yield user.destroy();
        return response.status(200).json({
            status: "success",
            message: "Account successfully deleted",
        });
    }
    catch (error) {
        console.error('Error deleting user:', error.message);
        return response.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
});
exports.deleteUser = deleteUser;

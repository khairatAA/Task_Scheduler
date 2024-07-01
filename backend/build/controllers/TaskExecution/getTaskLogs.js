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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskLogs = void 0;
const Task_1 = require("../../models/Task");
const TaskLog_1 = require("../../models/TaskLog");
const getTaskLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Fetch the tasks associated with the user
        const tasks = yield Task_1.Task.findAll({
            where: { user_id: userId },
            attributes: ['id', 'name'],
        });
        // Create a map of task IDs to task names
        const taskMap = {};
        tasks.forEach(task => {
            taskMap[task.id] = task.name;
        });
        // Fetch the task logs for the user's tasks
        const taskLogs = yield TaskLog_1.TaskLog.findAll({
            where: { task_id: tasks.map(task => task.id) },
        });
        // Include the task names in the task logs
        const logsWithTaskNames = taskLogs.map(log => (Object.assign(Object.assign({}, log.get({ plain: true })), { task_name: taskMap[log.task_id] })));
        return res.status(200).json({
            status: "success",
            data: logsWithTaskNames,
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
exports.getTaskLogs = getTaskLogs;

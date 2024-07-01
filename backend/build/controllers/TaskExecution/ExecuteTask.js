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
const Task_1 = require("../../models/Task");
const TaskLog_1 = require("../../models/TaskLog");
const sequelize_1 = require("sequelize");
const node_cron_1 = __importDefault(require("node-cron"));
const uuid_1 = require("uuid");
const taskLocks = {};
// Function to execute a task and log its execution
const executeTask = (task, status, details) => __awaiter(void 0, void 0, void 0, function* () {
    if (taskLocks[task.id]) {
        console.log(`Task ${task.name} is already running, skipping execution.`);
        return;
    }
    taskLocks[task.id] = true;
    try {
        // Verify that the task exists
        const existingTask = yield Task_1.Task.findByPk(task.id);
        if (!existingTask) {
            throw new Error(`Task with ID ${task.id} does not exist`);
        }
        console.log(`Executing task: ${task.name}`);
        yield TaskLog_1.TaskLog.create({
            id: (0, uuid_1.v4)(),
            task_id: task.id,
            execution_time: new Date(),
            status: status,
            details: details,
        });
        if (task.execution_type === "one-time") {
            task.status = "completed";
            yield task.save();
        }
    }
    catch (error) {
        console.log(`Failed to execute task: ${task.name}, Error: ${error.message}`);
        yield TaskLog_1.TaskLog.create({
            id: (0, uuid_1.v4)(),
            task_id: task.id,
            execution_time: new Date(),
            status: "failed",
            details: `Task execution failed: ${error.message}`,
        });
    }
    finally {
        taskLocks[task.id] = false;
    }
});
// Function to schedule one-time tasks
const scheduleOneTimeTask = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Scheduling one-time tasks");
    const tasks = yield Task_1.Task.findAll({
        where: {
            execution_type: "one-time",
            status: "pending",
            execution_time: {
                [sequelize_1.Op.lte]: new Date(),
            },
        },
    });
    tasks.forEach((task) => {
        const delay = new Date(task.execution_time || '').getTime() - Date.now();
        if (delay <= 0) {
            // If the execution time is in the past, execute immediately
            console.log(`Executing overdue one-time task: ${task.name}`);
            executeTask(task, "completed", "Task executed successfully");
        }
        else {
            // Schedule for future execution
            console.log(`Scheduling one-time task: ${task.name} for future execution`);
            setTimeout(() => executeTask(task, "completed", "Task executed successfully"), delay);
        }
    });
});
// Function to schedule recurring tasks
const scheduleRecurringTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Scheduling recurring tasks");
    const tasks = yield Task_1.Task.findAll({
        where: {
            execution_type: "recurring",
            status: "pending",
        },
    });
    tasks.forEach((task) => {
        console.log(`Scheduling recurring task: ${task.name} with cron expression: ${task.cron_expression}`);
        node_cron_1.default.schedule(task.cron_expression || '', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Executing recurring task: ${task.name}`);
            const executionTime = new Date();
            yield executeTask(task, "completed", `Task executed at ${executionTime}`);
        }));
    });
});
// Schedule one-time tasks every 10 seconds
node_cron_1.default.schedule("*/10 * * * * *", () => {
    console.log("Running one-time task scheduler");
    scheduleOneTimeTask();
});
// Schedule recurring tasks every minute
node_cron_1.default.schedule("*/1 * * * *", () => {
    console.log("Running recurring task scheduler");
    scheduleRecurringTasks();
});
// Initial call to handle tasks immediately on startup
console.log("Initial scheduling of tasks");
scheduleOneTimeTask();
scheduleRecurringTasks();

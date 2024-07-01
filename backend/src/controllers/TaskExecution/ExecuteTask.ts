import { Task } from "../../models/Task";
import { TaskLog } from "../../models/TaskLog";
import { Op } from "sequelize";
import cron from "node-cron";
import { v4 } from "uuid";

const taskLocks: { [key: string]: boolean } = {};

// Function to execute a task and log its execution
const executeTask = async (task: Task, status: string, details: string) => {
  if (taskLocks[task.id]) {
    console.log(`Task ${task.name} is already running, skipping execution.`);
    return;
  }
  taskLocks[task.id] = true;

  try {
    // Verify that the task exists
    const existingTask = await Task.findByPk(task.id);
    if (!existingTask) {
      throw new Error(`Task with ID ${task.id} does not exist`);
    }

    console.log(`Executing task: ${task.name}`);
    await TaskLog.create({
      id: v4(),
      task_id: task.id,
      execution_time: new Date(),
      status: status,
      details: details,
    });

    if (task.execution_type === "one-time") {
      task.status = "completed";
      await task.save();
    }
  } catch (error: any) {
    console.log(`Failed to execute task: ${task.name}, Error: ${error.message}`);
    await TaskLog.create({
      id: v4(),
      task_id: task.id,
      execution_time: new Date(),
      status: "failed",
      details: `Task execution failed: ${error.message}`,
    });
  } finally {
    taskLocks[task.id] = false;
  }
};

// Function to schedule one-time tasks
const scheduleOneTimeTask = async () => {
  console.log("Scheduling one-time tasks");
  const tasks = await Task.findAll({
    where: {
      execution_type: "one-time",
      status: "pending",
      execution_time: {
        [Op.lte]: new Date(),
      },
    },
  });

  tasks.forEach((task) => {
    const delay = new Date(task.execution_time || '').getTime() - Date.now();
    if (delay <= 0) {
      // If the execution time is in the past, execute immediately
      console.log(`Executing overdue one-time task: ${task.name}`);
      executeTask(task, "completed", "Task executed successfully");
    } else {
      // Schedule for future execution
      console.log(`Scheduling one-time task: ${task.name} for future execution`);
      setTimeout(
        () => executeTask(task, "completed", "Task executed successfully"),
        delay
      );
    }
  });
};

// Function to schedule recurring tasks
const scheduleRecurringTasks = async () => {
  console.log("Scheduling recurring tasks");
  const tasks = await Task.findAll({
    where: {
      execution_type: "recurring",
      status: "pending",
    },
  });

  tasks.forEach((task) => {
    console.log(`Scheduling recurring task: ${task.name} with cron expression: ${task.cron_expression}`);
    cron.schedule(task.cron_expression || '', async () => {
      console.log(`Executing recurring task: ${task.name}`);
      const executionTime = new Date();
      await executeTask(task, "completed", `Task executed at ${executionTime}`);
    });
  });
};

// Schedule one-time tasks every 10 seconds
cron.schedule("*/10 * * * * *", () => {
  console.log("Running one-time task scheduler");
  scheduleOneTimeTask();
});

// Schedule recurring tasks every minute
cron.schedule("*/1 * * * *", () => {
  console.log("Running recurring task scheduler");
  scheduleRecurringTasks();
});

// Initial call to handle tasks immediately on startup
console.log("Initial scheduling of tasks");
scheduleOneTimeTask();
scheduleRecurringTasks();

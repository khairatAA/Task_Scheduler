import { Request, Response } from "express";
import { Task } from "../../models/Task";
import { TaskLog } from "../../models/TaskLog";

export const getTaskLogs = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Fetch the tasks associated with the user
    const tasks = await Task.findAll({
      where: { user_id: userId },
      attributes: ['id', 'name'],
    });

    // Create a map of task IDs to task names
    const taskMap: { [key: string]: string } = {};
    tasks.forEach(task => {
      taskMap[task.id] = task.name;
    });

    // Fetch the task logs for the user's tasks
    const taskLogs = await TaskLog.findAll({
      where: { task_id: tasks.map(task => task.id) },
    });

    // Include the task names in the task logs
    const logsWithTaskNames = taskLogs.map(log => ({
      ...log.get({ plain: true }),
      task_name: taskMap[log.task_id],
    }));

    return res.status(200).json({
      status: "success",
      data: logsWithTaskNames,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

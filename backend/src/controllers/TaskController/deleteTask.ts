import { Request, Response } from "express";
import Task from "../../models/Task";
import TaskLog from "../../models/TaskLog";

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ where: { id } });

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found",
      });
    }

    await TaskLog.destroy({
      where: {
        task_id: id,
      },
    });

    // Delete the task
    await Task.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

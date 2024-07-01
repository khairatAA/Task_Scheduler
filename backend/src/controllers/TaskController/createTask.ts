import { Request, Response } from "express";
import Task, { TaskAttributes } from "../../models/Task";
import { v4 } from "uuid";

export const createTask = async (req: Request, res: Response) => {
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
 
    const newTask = await Task.create({
      id: v4(),
      user_id,
      name,
      description,
      execution_time: execution_type === "one-time" ? new Date(execution_time) : null,
      execution_type,
      cron_expression: execution_type === "recurring" ? cron_expression : null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as unknown as TaskAttributes;

    return res.status(201).json({
      status: "success",
      data: newTask,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

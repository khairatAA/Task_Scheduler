import { Request, Response } from "express";
import Task from "../../models/Task";
import { JwtPayload } from "jsonwebtoken";

export const editTask = async (req: JwtPayload, res: Response) => {
  try {
    const { id, name, description, execution_type, execution_time, cron_expression } = req.body;

    const task = await Task.findOne({ where: { id } });

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found",
      });
    }

    await Task.update(
      {
        name,
        description,
        execution_time: execution_type === "one-time" ? new Date(execution_time) : null,
        execution_type,
        cron_expression: execution_type === "recurring" ? cron_expression : null,
        updatedAt: new Date(),
      },
      { where: { id } }
    );

    return res.status(200).json({
      status: "success",
      message: "Task updated successfully",
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

import { Request, Response } from "express";
import Task from "../../models/Task";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log(userId); // This should log the userId

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    const tasks = await Task.findAll({ where: { user_id: userId } });

    return res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

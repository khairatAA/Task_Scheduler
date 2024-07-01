import { Response, Request } from 'express';
import User from "../../models/User";
import Task from "../../models/Task";
import TaskLog from "../../models/TaskLog";

export const deleteUser = async (request: Request, response: Response) => {
    try {
        const { userId } = request.params;

        // Find tasks associated with the user
        const tasks = await Task.findAll({ where: { user_id: userId } });

        // Delete task logs associated with each task
        await Promise.all(tasks.map(async (task) => {
            // Find task logs associated with the task
            const taskLogs = await TaskLog.findAll({ where: { task_id: task.id } });

            // Delete each task log
            await Promise.all(taskLogs.map(async (taskLog) => {
                await taskLog.destroy();
            }));

            // Now delete the task itself
            await task.destroy();
        }));

        // Now delete the user
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return response.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        await user.destroy();

        return response.status(200).json({
            status: "success",
            message: "Account successfully deleted",
        });

    } catch (error: any) {
        console.error('Error deleting user:', error.message);
        return response.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}

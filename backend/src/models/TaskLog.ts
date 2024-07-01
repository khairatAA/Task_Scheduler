import { DataTypes, Model } from "sequelize";
import { database } from "../configurations/index";
import Task from "./Task";

export interface TaskLogAttributes {
  id: string;
  task_id: string;
  execution_time: Date;
  status: string;
  details?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TaskLog extends Model<TaskLogAttributes> {
  task_id: any;
}

TaskLog.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Task,
        key: "id",
      },
    },
    execution_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: database,
    tableName: "TaskLogs",
    timestamps: true,
  }
);

export default TaskLog;

import { DataTypes, Model } from "sequelize";
import { database } from "../configurations/index";
import User from "./User";
// import TaskLog from './TaskLog';

export interface TaskAttributes {
  id: string;
  user_id: string;
  name: string;
  description: string;
  execution_time: Date | null;
  execution_type: string;
  cron_expression?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task extends Model<TaskAttributes> implements TaskAttributes {
  public id!: string;
  public user_id!: string;
  public name!: string;
  public description!: string;
  public execution_time!: Date | null;
  public execution_type!: string;
  public cron_expression?: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    execution_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    execution_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cron_expression: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
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
    tableName: "Tasks",
    timestamps: true,
  }
);

// Task.hasMany(TaskLog, {
//   foreignKey: 'task_id',
//   as: 'logs',
// });

export default Task;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskLog = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("../configurations/index");
const Task_1 = __importDefault(require("./Task"));
class TaskLog extends sequelize_1.Model {
}
exports.TaskLog = TaskLog;
TaskLog.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
    },
    task_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: Task_1.default,
            key: "id",
        },
    },
    execution_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    details: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: index_1.database,
    tableName: "TaskLogs",
    timestamps: true,
});
exports.default = TaskLog;

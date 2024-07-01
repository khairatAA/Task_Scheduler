"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasks = void 0;
const Task_1 = __importDefault(require("../../models/Task"));
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log(userId); // This should log the userId
        if (!userId) {
            return res.status(400).json({
                status: "error",
                message: "User ID is required",
            });
        }
        const tasks = yield Task_1.default.findAll({ where: { user_id: userId } });
        return res.status(200).json({
            status: "success",
            data: tasks,
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});
exports.getTasks = getTasks;

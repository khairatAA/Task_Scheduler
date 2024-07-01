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
exports.registerUser = void 0;
const User_1 = __importDefault(require("../../models/User"));
const uuid_1 = require("uuid");
const helpers_1 = require("../../helpers/helpers");
const registerUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_name, email, password, confirm_password, } = request.body;
        if (!email) {
            return response.status(400).json({
                status: 'error',
                message: 'Email is required',
            });
        }
        const checkUserEmail = yield User_1.default.findOne({ where: { email } });
        if (checkUserEmail) {
            return response.status(400).json({
                status: `error`,
                message: `${email} is already in use`,
            });
        }
        if (password !== confirm_password) {
            return response.status(400).json({
                status: `error`,
                message: `Password mismatch`,
            });
        }
        const userId = (0, uuid_1.v4)();
        const passwordHash = yield (0, helpers_1.hashPassword)(password);
        const newUser = yield User_1.default.create({
            id: userId,
            user_name,
            email,
            password: passwordHash,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const findUser = (yield User_1.default.findOne({
            where: { email },
        }));
        if (!findUser) {
            return response.status(400).json({
                status: `error`,
                message: `User not registered, contact admin`,
            });
        }
        return response.status(201).json({
            status: 'success',
            data: newUser,
        });
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).json({
            status: `error`,
            method: request.method,
            message: error.message,
        });
    }
});
exports.registerUser = registerUser;

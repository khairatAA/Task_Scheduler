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
exports.userLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../models/User"));
const helpers_1 = require("../../helpers/helpers");
const userLogin = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = request.body;
        const user1 = (yield User_1.default.findOne({ where: { email: email } }));
        if (!user1) {
            return response.status(404).json({
                status: `error`,
                message: `User with the email ${email} is not registered`,
            });
        }
        const validate = yield bcryptjs_1.default.compare(password, user1.password);
        if (!validate) {
            return response.status(400).json({
                status: `error`,
                message: `Incorrect Password`,
            });
        }
        const data = {
            id: user1.id,
            email: user1.email,
        };
        const token = (0, helpers_1.generateToken)(data);
        console.log("App Secret during token generation:", process.env.APP_SECRET);
        console.log("Token created:", token);
        return response.status(200).json({
            message: `Welcome back ${user1.user_name}`,
            token,
            user: user1,
        });
    }
    catch (error) {
        console.log("Error:", error.message);
        response.status(500).json({
            status: `error`,
            method: request.method,
            message: error.message,
        });
    }
});
exports.userLogin = userLogin;

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
exports.generalAuthoriser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generalAuthoriser = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (request.method === 'OPTIONS') {
        return response.sendStatus(204); // No Content
    }
    try {
        const authorization = request.headers.authorization;
        if (!authorization) {
            return response.status(401).json({
                message: `You are not authorized to view this page`,
            });
        }
        const tokenParts = authorization.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return response.status(401).json({
                status: `Failed`,
                message: `Login required`,
            });
        }
        const mainToken = tokenParts[1];
        if (!mainToken) {
            return response.status(401).json({
                status: `Failed`,
                message: `Login required`,
            });
        }
        const decoded = jsonwebtoken_1.default.verify(mainToken, process.env.APP_SECRET);
        request.user = decoded;
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error.message);
        return response.status(401).json({
            status: 'Failed',
            message: 'Invalid token',
        });
    }
});
exports.generalAuthoriser = generalAuthoriser;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const userRegister_1 = require("../../controllers/UserController/userRegister");
const userLogin_1 = require("../../controllers/UserController/userLogin");
const deleteUser_1 = require("../../controllers/UserController/deleteUser");
const router = express_1.default.Router();
router.post("/login", userLogin_1.userLogin);
router.post("/register", userRegister_1.registerUser);
router.delete("/delete-account/:userId", auth_1.generalAuthoriser, deleteUser_1.deleteUser);
exports.default = router;

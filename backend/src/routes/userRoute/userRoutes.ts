import express from "express";
import { generalAuthoriser } from "../../middlewares/auth";
import { registerUser } from "../../controllers/UserController/userRegister";
import { userLogin } from "../../controllers/UserController/userLogin";
import { deleteUser } from "../../controllers/UserController/deleteUser";

const router = express.Router();

router.post("/login", userLogin)
router.post("/register", registerUser)
router.delete("/delete-account/:userId", generalAuthoriser, deleteUser)

export default router;
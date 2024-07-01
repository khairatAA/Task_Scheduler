import { Router } from "express";
import { createTask } from "../../controllers/TaskController/createTask";
import { getTasks } from "../../controllers/TaskController/viewTasks";
import { editTask } from "../../controllers/TaskController/editTask";
import { deleteTask } from "../../controllers/TaskController/deleteTask";
import { generalAuthoriser } from "../../middlewares/auth";

const router = Router();

router.post("/create", generalAuthoriser, createTask);
router.get("/user/:userId", generalAuthoriser, getTasks);
router.put("/edit", generalAuthoriser, editTask);
router.delete("/:id", generalAuthoriser, deleteTask);

export default router;

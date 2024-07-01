import { Router } from "express";
import { getTaskLogs } from "../../controllers/TaskExecution/getTaskLogs";
import { generalAuthoriser } from "../../middlewares/auth";

const router = Router();

router.get("/:userId", generalAuthoriser, getTaskLogs);

export default router;

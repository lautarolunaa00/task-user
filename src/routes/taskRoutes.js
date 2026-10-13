import Router from "express";
import {
  deleteTask,
  getTasks,
  postTask,
  putTask,
} from "../controllers/taskControllers.js";

const router = Router();

router.get("/", getTasks);
router.post("/", postTask);
router.put("/:id", putTask);
router.delete("/:id", deleteTask);

export default router;

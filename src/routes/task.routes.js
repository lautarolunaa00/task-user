import { Router } from "express";
import {
  getTasks,
  getTaskById,
  postTask,
  putTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validateId, taskValidation } from "../middlewares/validators.js";

const router = Router();

// Todas las rutas de tareas requieren usuario autenticado
router.use(authenticate);

router.get("/", getTasks);
router.get("/:id", authenticate, validateId, getTaskById);
router.post("/", taskValidation(), postTask);
router.put("/:id", validateId, taskValidation(true), putTask);
router.delete("/:id", validateId, deleteTask);

export default router;

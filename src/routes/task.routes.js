import { Router } from "express";
import { check, param } from "express-validator";
import {
  getTasks,
  getTaskById,
  postTask,
  putTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validationErrors } from "../middlewares/validators.js";
import mongoose from "mongoose";

const router = Router();

// Todas las rutas de tareas requieren usuario autenticado
router.use(authenticate);

router.get("/", getTasks);

router.get(
  "/:id",
  [
    param("id")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("El ID proporcionado no es un ObjectId válido"),
    validationErrors,
  ],
  getTaskById,
);

router.post(
  "/",
  [
    check("titulo")
      .notEmpty()
      .withMessage("El título es obligatorio")
      .isString()
      .withMessage("El título debe ser un texto")
      .trim(),
    check("descripcion")
      .optional()
      .isString()
      .withMessage("La descripción debe ser un texto"),
    check("fechaEntrega")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("La fecha de entrega debe tener un formato válido"),
    check("completada")
      .optional()
      .isBoolean()
      .withMessage("El campo completada debe ser un valor booleano"),
    check("categoria")
      .optional({ checkFalsy: true })
      .custom((value) => {
        if (!value) return true;
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error("La categoría debe ser un ObjectId válido");
        }
        return true;
      }),
    validationErrors,
  ],
  postTask,
);

router.put(
  "/:id",
  [
    param("id")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("El ID proporcionado no es un ObjectId válido"),
    check("titulo")
      .optional()
      .notEmpty()
      .withMessage("El título no puede estar vacío")
      .isString()
      .withMessage("El título debe ser un texto")
      .trim(),
    check("descripcion")
      .optional()
      .isString()
      .withMessage("La descripción debe ser un texto"),
    check("fechaEntrega")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("La fecha de entrega debe tener un formato válido"),
    check("completada")
      .optional()
      .isBoolean()
      .withMessage("El campo completada debe ser un valor booleano"),
    check("categoria")
      .optional({ checkFalsy: true })
      .custom((value) => {
        if (!value) return true;
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error("La categoría debe ser un ObjectId válido");
        }
        return true;
      }),
    validationErrors,
  ],
  putTask,
);

router.delete(
  "/:id",
  [
    param("id")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("El ID proporcionado no es un ObjectId válido"),
    validationErrors,
  ],
  deleteTask,
);

export default router;

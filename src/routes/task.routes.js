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
import {
  validationErrors,
  validarCategoriaActiva,
} from "../middlewares/validators.js";

const router = Router();

// Todas las rutas de tareas requieren usuario autenticado
router.use(authenticate);

// Obtener todas las tareas del usuario
router.get("/", getTasks);

// Obtener una tarea por ID
router.get(
  "/:id",
  [
    param("id").isMongoId().withMessage("El ID proporcionado no es válido"),
    validationErrors,
  ],
  getTaskById,
);

// Crear una tarea
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
      .isMongoId()
      .withMessage("La categoría debe ser un ID válido")
      .custom(validarCategoriaActiva),
    validationErrors,
  ],
  postTask,
);

// Actualizar una tarea
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("El ID proporcionado no es válido"),
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
      .isMongoId()
      .withMessage("La categoría debe ser un ID válido")
      .custom(validarCategoriaActiva),
    validationErrors,
  ],
  putTask,
);

// Eliminar una tarea
router.delete(
  "/:id",
  [
    param("id").isMongoId().withMessage("El ID proporcionado no es válido"),
    validationErrors,
  ],
  deleteTask,
);

export default router;

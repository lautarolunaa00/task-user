import { Router } from "express";
import { check, param } from "express-validator";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.js";
import {
  validationErrors,
  validarRolAdmin,
  validarCategoriaPorId,
} from "../middlewares/validators.js";

const router = Router();

// Obtener todas las categorías activas
router.get("/", getCategories);

// Obtener una categoría por su id
router.get(
  "/:id",
  [
    param("id").isMongoId().withMessage("El id debe ser un ID válido"),
    param("id").custom(validarCategoriaPorId),
    validationErrors,
  ],
  getCategoryById,
);

// Crear categoría (requiere autenticación y rol admin)
router.post(
  "/",
  [
    authenticate,
    validarRolAdmin,
    check("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    validationErrors,
  ],
  addCategory,
);

// Actualizar categoría
router.put(
  "/:id",
  [
    authenticate,
    validarRolAdmin,
    param("id").isMongoId().withMessage("El id debe ser un ID válido"),
    param("id").custom(validarCategoriaPorId),
    check("nombre").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
    validationErrors,
  ],
  updateCategory,
);

// Inactivar categoría (Soft delete)
router.delete(
  "/:id",
  [
    authenticate,
    validarRolAdmin,
    param("id").isMongoId().withMessage("El id debe ser un ID válido"),
    param("id").custom(validarCategoriaPorId),
    validationErrors,
  ],
  deleteCategory,
);

export default router;

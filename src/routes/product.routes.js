import { Router } from "express";
import { check, param } from "express-validator";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.js";
import {
  validationErrors,
  validarRolAdmin,
  validarProductoPorId,
} from "../middlewares/validators.js";
import mongoose from "mongoose";

const router = Router();

// Obtener productos (no necesita autenticación)
router.get("/", getProducts);

// Obtener producto por su id
router.get(
  "/:id",
  [
    param("id").isMongoId().withMessage("El id debe ser válido"),
    param("id").custom(validarProductoPorId),
    validationErrors,
  ],
  getProductById,
);

// Crear producto
router.post(
  "/",
  [
    authenticate,
    validarRolAdmin,
    check("nombre")
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .isString()
      .withMessage("El nombre debe ser un texto")
      .trim(),
    check("categoria")
      .notEmpty()
      .withMessage("La categoría es obligatoria")
      .custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error("La categoría debe ser un ObjectId válido");
        }
        return true;
      }),
    check("precio")
      .optional()
      .isNumeric()
      .withMessage("El precio debe ser un número"),
    check("descripcion")
      .optional()
      .isString()
      .withMessage("La descripción debe ser un texto"),
    check("disponible")
      .optional()
      .isBoolean()
      .withMessage("El campo disponible debe ser booleano"),
    validationErrors,
  ],
  createProduct,
);

// Actualizar producto
router.put(
  "/:id",
  [
    authenticate,
    validarRolAdmin,
    param("id").isMongoId().withMessage("El id debe ser válido"),
    param("id").custom(validarProductoPorId),
    validationErrors,
    check("nombre")
      .optional()
      .notEmpty()
      .withMessage("El nombre no puede estar vacío")
      .isString()
      .withMessage("El nombre debe ser un texto")
      .trim(),
    check("categoria")
      .optional()
      .custom((value) => {
        if (value && !mongoose.Types.ObjectId.isValid(value)) {
          throw new Error("La categoría debe ser un ObjectId válido");
        }
        return true;
      }),
    check("precio")
      .optional()
      .isNumeric()
      .withMessage("El precio debe ser un número"),
    check("descripcion")
      .optional()
      .isString()
      .withMessage("La descripción debe ser un texto"),
    check("disponible")
      .optional()
      .isBoolean()
      .withMessage("El campo disponible debe ser booleano"),
    validationErrors,
  ],
  updateProduct,
);

// Borrar producto
router.delete(
  "/:id",
  [
    authenticate,
    validarRolAdmin,
    param("id").isMongoId().withMessage("El id debe ser válido"),
    param("id").custom(validarProductoPorId),
    validationErrors,
  ],
  deleteProduct,
);

export default router;

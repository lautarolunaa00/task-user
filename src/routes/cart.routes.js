import { Router } from "express";
import { check, param } from "express-validator";
import { authenticate } from "../middlewares/auth.js";
import {
  validationErrors,
  validarProductoPorId,
} from "../middlewares/validators.js";
import {
  addItem,
  deleteItem,
  getItems,
  updateCant,
  deleteCart,
} from "../controllers/cart.controller.js";

const router = Router();

// Obtener carrito del usuario
router.get("/", authenticate, getItems);

// Agregar producto al carrito
router.post(
  "/",
  [
    authenticate,
    check("productId")
      .isMongoId()
      .withMessage("El id del producto debe ser válido")
      .custom(validarProductoPorId),
    check("cantidad")
      .notEmpty()
      .withMessage("La cantidad no puede estar vacía")
      .isInt({ min: 1 })
      .withMessage("La cantidad debe ser un entero mayor a 0"),
    validationErrors,
  ],
  addItem,
);

// Actualizar cantidad de un producto
router.put(
  "/:productId",
  [
    authenticate,
    param("productId").isMongoId().withMessage("Debe ser un id válido"),
    validationErrors,
  ],
  updateCant,
);

// Eliminar un producto del carrito
router.delete(
  "/:productId",
  [
    authenticate,
    param("productId").isMongoId().withMessage("Debe ser un id válido"),
    validationErrors,
  ],
  deleteItem,
);

// Vaciar carrito
router.delete("/", authenticate, deleteCart);

export default router;

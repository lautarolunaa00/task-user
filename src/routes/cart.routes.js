import { Router } from "express";
import { check } from "express-validator";
import { authenticate } from "../middlewares/auth.js";
import {
  validationErrors,
  validarProductoPorId,
} from "../middlewares/validators.js";
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  emptyCart,
} from "../controllers/cart.controller.js";

const router = Router();

// Obtener carrito del usuario
router.get("/", authenticate, getCart);

// Agregar producto al carrito
router.post(
  "/",
  [
    authenticate,
    check("productId").custom(validarProductoPorId),
    check("cantidad")
      .notEmpty()
      .withMessage("La cantidad no puede estar vacia")
      .isInt({ min: 1 }),
    validationErrors,
  ],
  addToCart,
);

// Actualizar cantidad de un producto
router.put(
  "/:productId",
  [
    authenticate,
    check("productId").isMongoId().withMessage("Debe ser un id válido"),
    validationErrors,
  ],
  updateCart,
);

// Eliminar un producto del carrito
router.delete(
  "/:productId",
  [
    authenticate,
    check("productId").isMongoId().withMessage("Debe ser un id válido"),
    validationErrors,
  ],
  removeFromCart,
);

// Vaciar carrito
router.delete("/", authenticate, emptyCart);

export default router;
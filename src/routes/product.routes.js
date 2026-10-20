import { Router } from "express";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  borrarProducto,
} from "../controllers/product.controller.js";
import { autenticar } from "../middlewares/auth.js";
import {
  validarCrearProducto,
  validarActualizarProducto,
  validarId,
} from "../middlewares/validators.js";

const router = Router();

// Obtener productos (no necesita validaciones)
router.get("/", obtenerProductos);

// Crear producto (validar autenticación, nombre y categoría)
router.post("/", autenticar, validarCrearProducto, crearProducto);

// Actualizar producto (validar id y cualquier otro dato que se envíe al controlador)
router.put(
  "/:id",
  autenticar,
  validarId,
  validarActualizarProducto,
  actualizarProducto,
);

// Borrar producto (validar id)
router.delete("/:id", autenticar, validarId, borrarProducto);

export default router;

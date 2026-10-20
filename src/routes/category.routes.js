import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { categoryValidation, validateId } from "../middlewares/validators.js";

const router = Router();

router.get("/", getCategories); // traer las categorías
router.get("/:id", validateId, getCategoryById);
router.post("/", categoryValidation(), authenticate, addCategory); // crear categoría
router.put(
  "/:id",
  authenticate,
  validateId,
  categoryValidation(true),
  updateCategory,
); // actualizar categoría
router.delete("/:id", authenticate, validateId, deleteCategory); // inactivar categoría

export default router;

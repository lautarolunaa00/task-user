import mongoose from "mongoose";
import { validationResult, check } from "express-validator";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

// Middleware centralizado de errores de validación
export const validationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }
  next();
};

// Validar Registro
export const registerValidation = () => [
  check("username")
    .notEmpty()
    .withMessage("El nombre de usuario no puede estar vacío")
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("El usuario ya existe");
      }
    }),
  check("email")
    .isEmail()
    .withMessage("Ingresar un email válido")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("El email ya está registrado");
      }
    })
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener como mínimo 6 caracteres"),
  validationErrors,
];

// Validar Login
export const loginValidation = () => [
  check("email")
    .trim()
    .isEmail()
    .withMessage("Por favor, ingrese un email válido")
    .normalizeEmail(),
  check("password").notEmpty().withMessage("La contraseña es requerida"),
  validationErrors,
];

export const validationPassword = () => [
  check("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener como mínimo 6 caracteres"),
  validationErrors,
];

// Validación de código email
export const verifyEmailValidation = () => [
  check("code")
    .notEmpty()
    .withMessage("El código de verificación es necesario")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("El código debe tener 6 dígitos")
    .isNumeric()
    .withMessage("El código debe ser un número"),
  check("email")
    .notEmpty()
    .withMessage("El correo es requerido")
    .trim()
    .isEmail()
    .withMessage("Ingrese un email válido")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        throw new Error("El usuario no existe");
      }
      if (user.emailVerifed || user.emailVerified) {
        throw new Error("El email ya está verificado");
      }
    })
    .normalizeEmail(),
  validationErrors,
];

// Validar rol de admin
export const validarRolAdmin = (req, res, next) => {
  const rol = req.user?.role;

  if (rol !== "admin") {
    return res.status(401).json({
      ok: false,
      message: "No tiene permisos para esta acción",
    });
  }

  next();
};

// Validar que la categoría exista (activa o no)
export const validarCategoriaPorId = async (id) => {
  if (!id || !mongoose.isValidObjectId(id)) {
    throw new Error("El id de la categoría no es válido");
  }
  const existeCategoria = await Category.findById(id);

  if (!existeCategoria) {
    throw new Error("No existe una categoría con ese id");
  }
};

// Validar que la categoría exista y esté activa (para asignarla a productos/tareas)
export const validarCategoriaActiva = async (id) => {
  if (!id || !mongoose.isValidObjectId(id)) {
    throw new Error("El id de la categoría no es válido");
  }
  const existeCategoria = await Category.findById(id);

  if (!existeCategoria) {
    throw new Error("No existe una categoría con ese id");
  }

  if (!existeCategoria.estado) {
    throw new Error("La categoría está inactiva");
  }
};

// Validar producto por su id (existencia y estado activo)
export const validarProductoPorId = async (id) => {
  if (!id || !mongoose.isValidObjectId(id)) {
    throw new Error("El id del producto no es válido");
  }
  const existeProducto = await Product.findById(id);

  if (!existeProducto) {
    throw new Error("No existe un producto con ese id");
  }

  if (!existeProducto.estado) {
    throw new Error("El producto está inactivo");
  }
};

import { validationResult, check } from "express-validator";
import User from "../models/User.js";
import Categoria from "../models/category.js";
import Producto from "../models/Product.js";

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
  check("password")
    .notEmpty()
    .withMessage("La contraseña es requerida"),
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

// Validar categoría por su id
export const validarCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);

  if (!existeCategoria) {
    throw new Error("No existe una categoría con ese id");
  }
};

// Validar producto por su id
export const validarProductoPorId = async (id) => {
  const existeProducto = await Producto.findById(id);

  if (!existeProducto) {
    throw new Error("No existe un producto con ese id");
  }
};
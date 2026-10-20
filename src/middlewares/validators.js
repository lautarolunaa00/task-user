import { validationResult, check, param } from "express-validator";
import User from "../models/User.js";
import mongoose from "mongoose";

export const handleValidationErrors = (req, res, next) => {
  //preguntar si no hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }
  next();
};

//validar Registro
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
  //validar email
  check("email")
    .isEmail()
    .withMessage("Ingresar un email válido")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("El email ya está registrado");
      }
    }),
  check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener como mínimo 6 caracteres"),
  handleValidationErrors,
];

//Validar Login
export const loginValidation = () => [
  check("email")
    .trim()
    .isEmail()
    .withMessage("Por favor, ingrese un email válido")
    .normalizeEmail(),
  check("password").notEmpty().withMessage("La contraseña es requerida"),
  handleValidationErrors,
];

// Validar parámetro :id
export const validateId = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("El ID proporcionado no es un ObjectId válido"),
  handleValidationErrors,
];

// Validar Categoría
export const categoryValidation = (isUpdate = false) => [
  ...(isUpdate
    ? [
        check("nombre")
          .optional()
          .notEmpty()
          .withMessage("El nombre no puede estar vacío")
          .isString()
          .withMessage("El nombre debe ser un texto")
          .trim()
          .isLength({ min: 3, max: 50 })
          .withMessage("El nombre debe tener entre 3 y 50 caracteres"),
      ]
    : [
        check("nombre")
          .notEmpty()
          .withMessage("El nombre es obligatorio")
          .isString()
          .withMessage("El nombre debe ser un texto")
          .trim()
          .isLength({ min: 3, max: 50 })
          .withMessage("El nombre debe tener entre 3 y 50 caracteres"),
      ]),
  check("estado")
    .optional()
    .isBoolean()
    .withMessage("El campo estado debe ser un valor booleano"),
  handleValidationErrors,
];

// Validar Tarea
export const taskValidation = (isUpdate = false) => [
  ...(isUpdate
    ? [
        check("titulo")
          .optional()
          .notEmpty()
          .withMessage("El título no puede estar vacío")
          .isString()
          .withMessage("El título debe ser un texto")
          .trim(),
      ]
    : [
        check("titulo")
          .notEmpty()
          .withMessage("El título es obligatorio")
          .isString()
          .withMessage("El título debe ser un texto")
          .trim(),
      ]),
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
  handleValidationErrors,
];

import Task from "../models/Task.js";
import Categoria from "../models/category.js";

// Obtener todas las tareas del usuario logueado
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const tasks = await Task.find({ usuario: userId })
      .populate("categoria", "nombre estado")
      .populate("usuario", "username email");

    return res.status(200).json({ tasks });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// Obtener una tarea por ID
export const getTaskById = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const task = await Task.findOne({
      _id: req.params.id,
      usuario: userId,
    })
      .populate("categoria", "nombre estado")
      .populate("usuario", "username email");

    if (!task) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    return res.status(200).json({ task });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// Crear una tarea
export const postTask = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const { titulo, descripcion, fechaEntrega, completada, categoria } = req.body;

    // Si viene la categoría, verificar que exista en la BD
    if (categoria) {
      const catExists = await Categoria.findById(categoria);
      if (!catExists) {
        return res.status(404).json({ msg: "La categoría especificada no existe" });
      }
    }

    const task = new Task({
      titulo: titulo.trim(),
      descripcion: descripcion ? descripcion.trim() : "",
      fechaEntrega: fechaEntrega || null,
      completada: completada !== undefined ? completada : false,
      categoria: categoria || null,
      usuario: userId,
    });

    await task.save();

    return res.status(201).json({
      msg: "Tarea creada exitosamente",
      task,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// Actualizar una tarea
export const putTask = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const { id } = req.params;
    const { titulo, descripcion, fechaEntrega, completada, categoria } = req.body;

    // Si se envía una categoría, verificar que exista
    if (categoria) {
      const catExists = await Categoria.findById(categoria);
      if (!catExists) {
        return res.status(404).json({ msg: "La categoría especificada no existe" });
      }
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, usuario: userId },
      {
        ...(titulo !== undefined && { titulo: titulo.trim() }),
        ...(descripcion !== undefined && { descripcion: descripcion.trim() }),
        ...(fechaEntrega !== undefined && { fechaEntrega }),
        ...(completada !== undefined && { completada }),
        ...(categoria !== undefined && { categoria: categoria || null }),
      },
      { new: true }
    )
      .populate("categoria", "nombre estado")
      .populate("usuario", "username email");

    if (!task) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    return res.status(200).json({
      msg: "Tarea actualizada exitosamente",
      task,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// Eliminar una tarea
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      usuario: userId,
    });

    if (!task) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    return res.status(200).json({
      msg: "Tarea eliminada exitosamente",
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

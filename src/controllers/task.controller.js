import Task from "../models/Task.js";
import Category from "../models/Category.js";

// Obtener todas las tareas del usuario logueado
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const tasks = await Task.find({ usuario: userId })
      .populate("categoria", "nombre estado")
      .populate("usuario", "username email");

    return res.status(200).json({ ok: true, tasks });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
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
      return res.status(404).json({ ok: false, message: "Tarea no encontrada" });
    }

    return res.status(200).json({ ok: true, task });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// Crear una tarea
export const postTask = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const { titulo, descripcion, fechaEntrega, completada, categoria } = req.body;

    // Si viene la categoría, verificar que exista en la BD y esté activa
    if (categoria) {
      const catExists = await Category.findById(categoria);
      if (!catExists || !catExists.estado) {
        return res.status(404).json({
          ok: false,
          message: "La categoría especificada no existe o está inactiva",
        });
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
      ok: true,
      message: "Tarea creada exitosamente",
      task,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// Actualizar una tarea
export const putTask = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const { id } = req.params;
    const { titulo, descripcion, fechaEntrega, completada, categoria } = req.body;

    // Si se envía una categoría, verificar que exista y esté activa
    if (categoria) {
      const catExists = await Category.findById(categoria);
      if (!catExists || !catExists.estado) {
        return res.status(404).json({
          ok: false,
          message: "La categoría especificada no existe o está inactiva",
        });
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
      { returnDocument: "after" }
    )
      .populate("categoria", "nombre estado")
      .populate("usuario", "username email");

    if (!task) {
      return res.status(404).json({ ok: false, message: "Tarea no encontrada" });
    }

    return res.status(200).json({
      ok: true,
      message: "Tarea actualizada exitosamente",
      task,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
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
      return res.status(404).json({ ok: false, message: "Tarea no encontrada" });
    }

    return res.status(200).json({
      ok: true,
      message: "Tarea eliminada exitosamente",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

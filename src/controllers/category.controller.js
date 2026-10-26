import Categoria from "../models/category.js";

// Obtener todas las categorías activas,total y datos te usuario (GET)
export const getCategories = async (req, res) => {
  const categories = await Categoria.find({ estado: true }).populate(
    "usuario",
    "username email",
  );

  const total = await Categoria.countDocuments({ estado: true });

  return res.status(200).json({ categories, total });
};

// Crear una categoría
export const addCategory = async (req, res) => {
  try {
    const nombre = req.body.nombre.toUpperCase();

    const validarNombre = await Categoria.findOne({ nombre });

    if (validarNombre) {
      return res
        .status(400)
        .json({ ok: false, msg: "Ya existe una categoría con ese nombre" });
    }

    const usuario = req.user._id;

    const category = new Categoria({
      nombre,
      usuario,
    });
    await category.save();
    return res.status(201).json({
      ok: true,
      msg: "Categoría creada exitosamente",
      category,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al crear la categoría" });
  }
};

export const createCategory = addCategory;

// Obtener una categoría por ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Categoria.findById(req.params.id).populate(
      "usuario",
      "username email",
    );

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// Actualizar una categoría
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, estado } = req.body;
    const nombreNormalizado = nombre?.trim().toUpperCase();

    if (nombreNormalizado) {
      const existeCategoria = await Categoria.findOne({
        nombre: nombreNormalizado,
        _id: { $ne: id },
      });
      if (existeCategoria) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe otra categoría con ese nombre",
        });
      }
    }

    const datos = {};
    if (nombreNormalizado) datos.nombre = nombreNormalizado;
    if (estado !== undefined) datos.estado = estado;

    const category = await Categoria.findByIdAndUpdate(id, datos, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    return res.status(200).json({
      msg: "Categoría actualizada exitosamente",
      category,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
// Inactivar categoría
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Categoria.findByIdAndUpdate(
      id,
      { estado: false },
      { returnDocument: "after" },
    );

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    return res.status(200).json({
      msg: "Categoría inactivada exitosamente",
      category,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

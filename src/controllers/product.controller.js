import Product from "../models/Product.js";

// Obtener la lista de productos con paginación
const getProducts = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;

  try {
    const [total, products] = await Promise.all([
      Product.countDocuments({ estado: true }),
      Product.find({ estado: true })
        .limit(Number(limite))
        .skip(Number(desde))
        .populate("usuario", "username email role")
        .populate("categoria", "nombre"),
    ]);

    return res.status(200).json({
      ok: true,
      total,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Obtener un producto por su id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("usuario", "username email role")
      .populate("categoria", "nombre");

    if (!product || !product.estado) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Crear un producto
const createProduct = async (req, res) => {
  try {
    const { precio, categoria, descripcion, img } = req.body;
    const nombre = req.body.nombre.toUpperCase();

    // Validar si ya existe un producto con ese nombre
    const productDB = await Product.findOne({ nombre });

    if (productDB) {
      return res.status(400).json({
        ok: false,
        message: `El producto con el nombre ${productDB.nombre} ya existe`,
      });
    }

    const data = {
      nombre,
      categoria, // id de categoría
      precio,
      descripcion,
      img,
      usuario: req.user._id, // proveniente de authenticate
    };

    const product = new Product(data);
    await product.save();

    return res.status(201).json({
      ok: true,
      message: `El producto ${data.nombre} se guardó con éxito!!`,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { precio, categoria, descripcion, disponible } = req.body;
    const usuario = req.user._id;

    const data = {
      precio,
      categoria,
      descripcion,
      disponible,
      usuario,
    };

    if (req.body.nombre) {
      data.nombre = req.body.nombre.toUpperCase();
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true })
      .populate("usuario", "username email role")
      .populate("categoria", "nombre");

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Producto actualizado!",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Borrar un producto (Soft delete)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Producto eliminado",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

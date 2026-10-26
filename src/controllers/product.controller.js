import Product from "../models/Product.js";

// Traer solo los productos activos, con límite de 5 y el total
export const obtenerProductos = async (req, res) => {
  try {
    const [total, productos] = await Promise.all([
      Product.countDocuments({ estado: true }),
      Product.find({ estado: true })
        .populate("categoria", "nombre")
        .populate("usuario", "username email")
        .limit(5),
    ]);

    return res.status(200).json({
      ok: true,
      total,
      productos,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

// Crear un producto
export const crearProducto = async (req, res) => {
  try {
    const { precio, categoria, descripcion, img, imagen } = req.body;
    const nombre = req.body.nombre.toUpperCase();

    // Verificar si ya existe un producto con el mismo nombre
    const productoDB = await Product.findOne({ nombre });

    if (productoDB) {
      return res.status(400).json({
        ok: false,
        msg: `El producto ${nombre} ya existe`,
      });
    }

    // Datos a guardar
    const data = {
      nombre,
      categoria,
      usuario: req.user._id,
      precio: precio || 0,
      descripcion: descripcion || "",
      img: img || imagen || undefined,
    };

    const producto = new Product(data);
    await producto.save();

    return res.status(201).json({
      ok: true,
      msg: "Producto creado exitosamente",
      producto,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

// Actualizar un producto
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
      data.nombre = data.nombre.toUpperCase();
    }

    if (data.imagen && !data.img) {
      data.img = data.imagen;
    }

    const producto = await Product.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    })
      .populate("categoria", "nombre")
      .populate("usuario", "username email");

    if (!producto) {
      return res.status(404).json({
        ok: false,
        msg: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      msg: "Producto actualizado exitosamente",
      producto,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

// Borrar producto (Soft delete con estado en false)
export const borrarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const productoBorrado = await Product.findByIdAndUpdate(
      id,
      { estado: false },
      { returnDocument: "after" },
    );

    if (!productoBorrado) {
      return res.status(404).json({
        ok: false,
        msg: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      msg: "Producto borrado exitosamente",
      producto: productoBorrado,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

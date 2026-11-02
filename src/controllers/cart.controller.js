import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Obtener carrito del usuario
export const getItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ usuario: req.user._id }).populate(
      "items.producto",
    );

    return res.status(200).json(cart || { items: [], total: 0 });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Agregar item al carrito
// (la existencia y el estado activo del producto se validan en la ruta)
export const addItem = async (req, res) => {
  try {
    const { productId, cantidad } = req.body;

    // traer los datos del producto
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    // buscar el carrito del usuario
    let cart = await Cart.findOne({ usuario: req.user._id });

    if (!cart) {
      cart = new Cart({ usuario: req.user._id, items: [] });
    }

    // si el producto ya está en el carrito
    const itemExists = cart.items.find(
      (item) => item.producto.toString() === productId.toString(),
    );

    if (itemExists) {
      itemExists.cantidad += Number(cantidad);
    } else {
      cart.items.push({
        producto: productId,
        cantidad: Number(cantidad),
        precioUnitario: product.precio,
      });
    }

    cart.calcularTotal();
    await cart.save();

    return res.status(201).json({
      ok: true,
      message: "Producto agregado al carrito",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Eliminar un item del carrito
export const deleteItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ usuario: req.user._id });

    if (!cart) {
      return res
        .status(404)
        .json({ ok: false, message: "Carrito no encontrado" });
    }

    cart.items = cart.items.filter(
      (item) => item.producto.toString() !== productId.toString(),
    );

    cart.calcularTotal();
    await cart.save();

    const populatedCart = await cart.populate("items.producto");

    return res.status(200).json({
      ok: true,
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Actualizar cantidad de un producto en el carrito
export const updateCant = async (req, res) => {
  try {
    const { productId } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || Number(cantidad) < 1) {
      return res.status(400).json({
        ok: false,
        message: "La cantidad debe ser mayor que 0",
      });
    }

    const cart = await Cart.findOne({ usuario: req.user._id });

    if (!cart) {
      return res.status(404).json({
        ok: false,
        message: "Carrito no encontrado",
      });
    }

    const item = cart.items.find(
      (item) => item.producto.toString() === productId.toString(),
    );

    if (!item) {
      return res.status(404).json({
        ok: false,
        message: "Item no encontrado en el carrito",
      });
    }

    item.cantidad = cantidad;
    cart.calcularTotal();
    await cart.save();

    const populatedCart = await cart.populate("items.producto");

    return res.status(200).json({
      ok: true,
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Vaciar carrito
export const deleteCart = async (req, res) => {
  try {
    // buscar carrito del usuario
    const cart = await Cart.findOne({ usuario: req.user._id });

    if (!cart) {
      return res.status(404).json({
        ok: false,
        message: "Carrito no encontrado",
      });
    }

    cart.items = [];
    cart.total = 0;

    await cart.save();

    return res.status(200).json({
      ok: true,
      message: "Carrito vacío",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

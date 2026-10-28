import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Obtener el carrito del usuario autenticado
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ usuario: req.user._id }).populate(
      "items.producto",
      "nombre precio img",
    );

    return res.status(200).json({
      ok: true,
      cart: cart || { items: [], total: 0 },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

// Agregar producto al carrito
export const addToCart = async (req, res) => {
  try {
    const { productId, cantidad = 1 } = req.body;
    const usuarioId = req.user._id;

    // Buscar precio del producto para el carrito
    const productoDB = await Product.findById(productId);
    const precio = productoDB?.precio || 0;

    let cart = await Cart.findOne({ usuario: usuarioId });

    if (!cart) {
      cart = new Cart({ usuario: usuarioId, items: [] });
    }

    const itemExistente = cart.items.find(
      (item) => item.producto.toString() === productId,
    );

    if (itemExistente) {
      itemExistente.cantidad += Number(cantidad);
      itemExistente.precioUnitario = precio;
    } else {
      cart.items.push({
        producto: productId,
        cantidad: Number(cantidad),
        precioUnitario: precio,
      });
    }

    if (typeof cart.calcularTotal === "function") {
      cart.calcularTotal();
    }

    await cart.save();
    await cart.populate("items.producto", "nombre precio img");

    return res.status(200).json({
      ok: true,
      msg: "Producto agregado al carrito",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

// Actualizar cantidad de un producto en el carrito
export const updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { cantidad } = req.body;

    const cart = await Cart.findOne({ usuario: req.user._id });

    if (!cart) {
      return res.status(404).json({ ok: false, msg: "Carrito no encontrado" });
    }

    const item = cart.items.find(
      (item) => item.producto.toString() === productId,
    );

    if (!item) {
      return res
        .status(404)
        .json({ ok: false, msg: "Producto no encontrado en el carrito" });
    }

    item.cantidad = Number(cantidad);

    if (typeof cart.calcularTotal === "function") {
      cart.calcularTotal();
    }

    await cart.save();
    await cart.populate("items.producto", "nombre precio img");

    return res.status(200).json({ ok: true, msg: "Carrito actualizado", cart });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

// Eliminar un producto del carrito
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ usuario: req.user._id });

    if (!cart) {
      return res.status(404).json({ ok: false, msg: "Carrito no encontrado" });
    }

    cart.items = cart.items.filter(
      (item) => item.producto.toString() !== productId,
    );

    if (typeof cart.calcularTotal === "function") {
      cart.calcularTotal();
    }

    await cart.save();
    await cart.populate("items.producto", "nombre precio img");

    return res.status(200).json({
      ok: true,
      msg: "Producto eliminado del carrito",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

// Vaciar carrito
export const emptyCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { usuario: req.user._id },
      { items: [], total: 0 },
      { new: true },
    );

    return res.status(200).json({ ok: true, msg: "Carrito vaciado", cart });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

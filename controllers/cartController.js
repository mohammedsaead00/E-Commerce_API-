const { Cart, CartItem, Product, Category } = require('../models');

// ── Helper: find or create cart for a user ────────────────────
const getUserCart = async (userId) => {
  const [cart] = await Cart.findOrCreate({ where: { userId } });
  return cart;
};

// ── Helper: fetch full cart with items + products ─────────────
const getFullCart = async (userId) => {
  return Cart.findOne({
    where: { userId },
    include: [
      {
        model:    CartItem,
        as:       'items',
        include:  [
          {
            model:   Product,
            as:      'product',
            include: [{ model: Category, as: 'category' }],
          },
        ],
      },
    ],
  });
};

// ── Helper: compute cart totals ───────────────────────────────
const computeTotals = (cart) => {
  const items = cart.items || [];
  const itemCount   = items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = items.reduce((s, i) => s + (i.priceAtAdd * i.quantity), 0);
  return { itemCount, totalAmount: parseFloat(totalAmount.toFixed(2)) };
};

// ─────────────────────────────────────────────────────────────

/**
 * GET /api/cart
 */
exports.getCart = async (req, res, next) => {
  try {
    await getUserCart(req.user.id);        // ensure cart exists
    const cart = await getFullCart(req.user.id);
    res.status(200).json({
      success: true,
      data:    { ...cart.toJSON(), ...computeTotals(cart) },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/cart/items
 * Body: { productId, quantity }
 */
exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required.' });
    }

    const product = await Product.findOne({ where: { id: productId, isActive: true } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} in stock.` });
    }

    const cart = await getUserCart(req.user.id);

    // If item already in cart — increase quantity
    const existingItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + parseInt(quantity);
      if (product.stock < newQty) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more. Only ${product.stock - existingItem.quantity} additional available.`,
        });
      }
      await existingItem.update({ quantity: newQty });
    } else {
      await CartItem.create({
        cartId:     cart.id,
        productId,
        quantity:   parseInt(quantity),
        priceAtAdd: product.price,
      });
    }

    const updatedCart = await getFullCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Item added to cart.',
      data:    { ...updatedCart.toJSON(), ...computeTotals(updatedCart) },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/cart/items/:itemId
 * Body: { quantity }
 */
exports.updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || parseInt(quantity) < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
    }

    const cart = await getUserCart(req.user.id);
    const item = await CartItem.findOne({
      where: { id: req.params.itemId, cartId: cart.id },
      include: [{ model: Product, as: 'product' }],
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    if (item.product.stock < parseInt(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Only ${item.product.stock} in stock.`,
      });
    }

    await item.update({ quantity: parseInt(quantity) });

    const updatedCart = await getFullCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Cart item updated.',
      data:    { ...updatedCart.toJSON(), ...computeTotals(updatedCart) },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/cart/items/:itemId
 */
exports.removeItem = async (req, res, next) => {
  try {
    const cart = await getUserCart(req.user.id);
    const item = await CartItem.findOne({
      where: { id: req.params.itemId, cartId: cart.id },
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    await item.destroy();

    const updatedCart = await getFullCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Item removed from cart.',
      data:    { ...updatedCart.toJSON(), ...computeTotals(updatedCart) },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/cart  — clear entire cart
 */
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await getUserCart(req.user.id);
    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(200).json({ success: true, message: 'Cart cleared.', data: { items: [], itemCount: 0, totalAmount: 0 } });
  } catch (err) {
    next(err);
  }
};

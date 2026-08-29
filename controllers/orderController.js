const { validationResult } = require('express-validator');
const { sequelize } = require('../models');
const { Order, OrderItem, Cart, CartItem, Product, Category } = require('../models');

/**
 * POST /api/orders
 * Creates an order from the user's current cart contents.
 * Body: { shippingAddress, paymentMethod?, notes? }
 */
exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { shippingAddress, paymentMethod = 'cash_on_delivery', notes } = req.body;

    // Fetch cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model:   CartItem,
          as:      'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
      transaction: t,
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    // Validate stock availability for all items
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Product "${item.product?.name || 'Unknown'}" is no longer available.`,
        });
      }
      if (item.product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}.`,
        });
      }
    }

    // Compute total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );

    // Create order
    const order = await Order.create(
      { userId: req.user.id, shippingAddress, paymentMethod, notes, totalAmount },
      { transaction: t }
    );

    // Create order items & decrement stock
    const orderItemsData = cart.items.map((item) => ({
      orderId:      order.id,
      productId:    item.productId,
      productName:  item.product.name,
      productImage: item.product.image,
      quantity:     item.quantity,
      unitPrice:    parseFloat(item.product.price),
      subtotal:     parseFloat(item.product.price) * item.quantity,
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction: t });

    // Decrement product stock
    for (const item of cart.items) {
      await item.product.decrement('stock', { by: item.quantity, transaction: t });
    }

    // Clear cart
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    await t.commit();

    // Fetch full order with items
    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.status(201).json({ success: true, message: 'Order placed successfully.', data: fullOrder });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

/**
 * GET /api/orders
 * Returns all orders for the logged-in user.
 */
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where:   { userId: req.user.id },
      include: [{ model: OrderItem, as: 'items' }],
      order:   [['createdAt', 'DESC']],
    });

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders/:id
 * Returns a specific order (must belong to the user, or user is admin).
 */
exports.getOrder = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.user.role !== 'admin') where.userId = req.user.id;

    const order = await Order.findOne({
      where,
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/orders/:id/status  (admin only)
 * Body: { status }
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    await order.update({ status });
    res.status(200).json({ success: true, message: `Order status updated to "${status}".`, data: order });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders/admin/all  (admin only)
 * Returns all orders across all users.
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const where  = status ? { status } : {};
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: OrderItem, as: 'items' }],
      order:   [['createdAt', 'DESC']],
      limit:   parseInt(limit),
      offset,
      distinct: true,
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total:      count,
        page:       parseInt(page),
        limit:      parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

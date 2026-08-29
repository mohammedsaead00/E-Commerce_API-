const { Wishlist, WishlistItem, Product, Category } = require('../models');

// ── Helper: find or create wishlist ───────────────────────────
const getUserWishlist = async (userId) => {
  const [wishlist] = await Wishlist.findOrCreate({ where: { userId } });
  return wishlist;
};

// ── Helper: full wishlist with products ───────────────────────
const getFullWishlist = async (userId) => {
  return Wishlist.findOne({
    where: { userId },
    include: [
      {
        model:   WishlistItem,
        as:      'items',
        include: [
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

// ─────────────────────────────────────────────────────────────

/**
 * GET /api/wishlist
 */
exports.getWishlist = async (req, res, next) => {
  try {
    await getUserWishlist(req.user.id);
    const wishlist = await getFullWishlist(req.user.id);
    res.status(200).json({ success: true, data: wishlist });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/wishlist
 * Body: { productId }
 */
exports.addItem = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required.' });
    }

    const product = await Product.findOne({ where: { id: productId, isActive: true } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const wishlist = await getUserWishlist(req.user.id);

    const existing = await WishlistItem.findOne({
      where: { wishlistId: wishlist.id, productId },
    });

    if (existing) {
      return res.status(409).json({ success: false, message: 'Product already in wishlist.' });
    }

    await WishlistItem.create({ wishlistId: wishlist.id, productId });

    const updated = await getFullWishlist(req.user.id);
    res.status(201).json({
      success: true,
      message: 'Product added to wishlist.',
      data:    updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/wishlist/:productId
 */
exports.removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const wishlist = await getUserWishlist(req.user.id);

    const item = await WishlistItem.findOne({
      where: { wishlistId: wishlist.id, productId },
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Product not in wishlist.' });
    }

    await item.destroy();

    const updated = await getFullWishlist(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
      data:    updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/wishlist  — clear entire wishlist
 */
exports.clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await getUserWishlist(req.user.id);
    await WishlistItem.destroy({ where: { wishlistId: wishlist.id } });
    res.status(200).json({ success: true, message: 'Wishlist cleared.', data: { items: [] } });
  } catch (err) {
    next(err);
  }
};

const { validationResult } = require('express-validator');
const { Op }              = require('sequelize');
const { Product, Category } = require('../models');

/**
 * GET /api/products
 * Query params: search, category (id or slug), minPrice, maxPrice,
 *               sort (price_asc|price_desc|rating|newest), page, limit
 */
exports.getAll = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort    = 'newest',
      page    = 1,
      limit   = 12,
    } = req.query;

    const where  = { isActive: true };
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Text search
    if (search) {
      where[Op.or] = [
        { name:        { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // Price range
    if (minPrice) where.price = { ...where.price, [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

    // Sorting
    const orderMap = {
      price_asc:  [['price', 'ASC']],
      price_desc: [['price', 'DESC']],
      rating:     [['rating', 'DESC']],
      newest:     [['createdAt', 'DESC']],
    };
    const order = orderMap[sort] || orderMap.newest;

    // Category filter — accept id or slug
    const includeCategory = {
      model:    Category,
      as:       'category',
      required: !!category,
      where:    category
        ? { [Op.or]: [
            { id:   isNaN(category) ? null : parseInt(category) },
            { slug: category },
          ] }
        : undefined,
    };

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [includeCategory],
      order,
      limit:  parseInt(limit),
      offset,
      distinct: true,
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total:       count,
        page:        parseInt(page),
        limit:       parseInt(limit),
        totalPages:  Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/:id
 */
exports.getOne = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where:   { id: req.params.id, isActive: true },
      include: [{ model: Category, as: 'category' }],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/products  (admin)
 */
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      name, description, price, originalPrice,
      stock, image, images, categoryId,
    } = req.body;

    // Verify category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category not found.' });
    }

    const product = await Product.create({
      name, description, price, originalPrice,
      stock, image, images, categoryId,
    });

    const result = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }],
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/products/:id  (admin)
 */
exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await product.update(req.body);
    const updated = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }],
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/products/:id  (admin) — soft delete via isActive flag
 */
exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await product.update({ isActive: false });
    res.status(200).json({ success: true, message: 'Product deactivated.' });
  } catch (err) {
    next(err);
  }
};

const { validationResult } = require('express-validator');
const { Category, Product } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/categories
 */
exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
    });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/categories/:id
 * Returns category + its active products
 */
exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { [Op.or]: [{ id: isNaN(id) ? null : id }, { slug: id }] },
      include: [
        {
          model: Product,
          as: 'products',
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/categories  (admin only)
 */
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const category = await Category.create({ name, description, image, slug });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/categories/:id  (admin only)
 */
exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const { name, description, image } = req.body;
    const slug = name
      ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : category.slug;

    await category.update({ name, description, image, slug });
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/categories/:id  (admin only)
 */
exports.remove = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    await category.destroy();
    res.status(200).json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
};

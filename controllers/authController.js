const jwt            = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User }       = require('../models');

// ── Helpers ───────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  return res.status(statusCode).json({
    success: true,
    token,
    user: user.toSafeJSON(),
  });
};

// ── Controllers ───────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone, address } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password, phone, address });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    res.status(200).json({ success: true, user: req.user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/me  — update own profile
 */
exports.updateMe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, phone, address } = req.body;
    await req.user.update({ name, phone, address });

    res.status(200).json({ success: true, user: req.user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

const jwt  = require('jsonwebtoken');
const { User } = require('../models');

/**
 * protect — requires a valid Bearer JWT in the Authorization header.
 * Attaches `req.user` (User model instance) on success.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a Bearer token.',
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Token has expired. Please log in again.'
        : 'Invalid token. Please log in again.';
      return res.status(401).json({ success: false, message });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * adminOnly — must be used AFTER protect.
 * Restricts access to users with role === 'admin'.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admins only.',
  });
};

module.exports = { protect, adminOnly };

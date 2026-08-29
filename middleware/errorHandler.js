/**
 * Global Express error handler.
 * Must be registered LAST in server.js (after all routes).
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join('. ') });
  }

  // Sequelize foreign key error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ success: false, message: 'Referenced record does not exist.' });
  }

  // JWT error (shouldn't reach here but just in case)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }

  // CORS error
  if (err.message && err.message.startsWith('CORS')) {
    return res.status(403).json({ success: false, message: err.message });
  }

  // Default 500
  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;

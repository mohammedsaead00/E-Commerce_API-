require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// ── Routes ──────────────────────────────────────────────────
const authRoutes      = require('./routes/auth');
const categoryRoutes  = require('./routes/categories');
const productRoutes   = require('./routes/products');
const cartRoutes      = require('./routes/cart');
const wishlistRoutes  = require('./routes/wishlist');
const orderRoutes     = require('./routes/orders');

const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || '*').split(',');
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. curl, Postman) or matching origins
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/wishlist',   wishlistRoutes);
app.use('/api/orders',     orderRoutes);

// ── 404 handler ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────
app.use(errorHandler);

// ── Database sync & start ────────────────────────────────────
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅  Database connected');

    // sync() creates missing tables without modifying existing ones
    await sequelize.sync();
    console.log('✅  Database synced');

    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
      console.log(`📋  API docs: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌  Unable to start server:', err);
    process.exit(1);
  }
})();

/**
 * models/index.js
 * Central hub — imports all models and sets up associations.
 * Import this file anywhere you need DB access.
 */

const sequelize   = require('../config/database');

const User         = require('./User');
const Category     = require('./Category');
const Product      = require('./Product');
const Cart         = require('./Cart');
const CartItem     = require('./CartItem');
const Wishlist     = require('./Wishlist');
const WishlistItem = require('./WishlistItem');
const Order        = require('./Order');
const OrderItem    = require('./OrderItem');

// ── Associations ──────────────────────────────────────────────────────────────

// Category ↔ Product
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products', onDelete: 'RESTRICT' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// User ↔ Cart
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Cart ↔ CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// CartItem ↔ Product
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });

// User ↔ Wishlist
User.hasOne(Wishlist, { foreignKey: 'userId', as: 'wishlist', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Wishlist ↔ WishlistItem
Wishlist.hasMany(WishlistItem, { foreignKey: 'wishlistId', as: 'items', onDelete: 'CASCADE' });
WishlistItem.belongsTo(Wishlist, { foreignKey: 'wishlistId', as: 'wishlist' });

// WishlistItem ↔ Product
WishlistItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(WishlistItem, { foreignKey: 'productId', as: 'wishlistItems' });

// User ↔ Orders
User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// OrderItem ↔ Product (nullable — product may be deleted later)
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product', constraints: false });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems', constraints: false });

// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  Order,
  OrderItem,
};

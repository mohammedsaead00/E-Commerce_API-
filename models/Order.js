const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' },
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    defaultValue: 'cash_on_delivery',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Order;

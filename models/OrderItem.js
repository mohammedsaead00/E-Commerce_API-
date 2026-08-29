const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Orders', key: 'id' },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,           // null if product is later deleted
    references: { model: 'Products', key: 'id' },
  },
  // Snapshots — preserved even if product changes
  productName: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

module.exports = OrderItem;

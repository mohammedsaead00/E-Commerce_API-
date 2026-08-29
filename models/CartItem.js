const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Carts', key: 'id' },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Products', key: 'id' },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 1 },
  },
  // Snapshot the price at time of adding to cart
  priceAtAdd: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

module.exports = CartItem;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WishlistItem = sequelize.define('WishlistItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  wishlistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Wishlists', key: 'id' },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Products', key: 'id' },
  },
});

module.exports = WishlistItem;

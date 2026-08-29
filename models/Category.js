const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { len: [2, 100] },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slug: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
  },
});

module.exports = Category;

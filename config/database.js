const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
  define: {
    // Use snake_case column names automatically
    underscored: true,
    timestamps: true,
  },
});

module.exports = sequelize;

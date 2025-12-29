const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ClientProduct = sequelize.define(
  'ClientProduct',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('activo', 'suspendido', 'finalizado'),
      defaultValue: 'activo',
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'client_products',
    timestamps: true,
  }
);

module.exports = ClientProduct;


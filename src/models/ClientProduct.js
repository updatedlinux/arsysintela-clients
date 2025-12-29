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
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    product_id: {
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
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    end_date: {
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
    underscored: false,
  }
);

module.exports = ClientProduct;


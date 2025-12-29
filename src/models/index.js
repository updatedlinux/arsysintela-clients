const User = require('./User');
const Client = require('./Client');
const Product = require('./Product');
const ClientProduct = require('./ClientProduct');

// Asociaciones
Client.belongsToMany(Product, {
  through: ClientProduct,
  foreignKey: 'client_id',
  otherKey: 'product_id',
  as: 'products',
});

Product.belongsToMany(Client, {
  through: ClientProduct,
  foreignKey: 'product_id',
  otherKey: 'client_id',
  as: 'clients',
});

ClientProduct.belongsTo(Client, {
  foreignKey: 'client_id',
  as: 'client',
});

ClientProduct.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

module.exports = {
  User,
  Client,
  Product,
  ClientProduct,
};


const User = require('./User');
const Client = require('./Client');
const Product = require('./Product');
const ClientProduct = require('./ClientProduct');

// Asociación User-Client (uno a uno por email)
User.hasOne(Client, {
  foreignKey: 'userId',
  as: 'client',
});

Client.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Asociaciones Client-Product (muchos a muchos)
Client.belongsToMany(Product, {
  through: ClientProduct,
  foreignKey: 'clientId',
  otherKey: 'productId',
  as: 'products',
});

Product.belongsToMany(Client, {
  through: ClientProduct,
  foreignKey: 'productId',
  otherKey: 'clientId',
  as: 'clients',
});

ClientProduct.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client',
});

ClientProduct.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

module.exports = {
  User,
  Client,
  Product,
  ClientProduct,
};


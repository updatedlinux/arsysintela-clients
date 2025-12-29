const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('../logger/logger');

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mariadb',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const initDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos solo en desarrollo
    if (config.env === 'development') {
      await sequelize.sync({ alter: false });
      logger.info('Modelos sincronizados con la base de datos.');
    }
  } catch (error) {
    logger.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

module.exports = { sequelize, initDB };


const app = require('./app');
const config = require('./config/config');
const { initDB } = require('./config/db');
const logger = require('./logger/logger');

const PORT = config.port;

const startServer = async () => {
  try {
    // Inicializar base de datos
    await initDB();

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`Portal de Clientes API escuchando en puerto ${PORT}`);
      logger.info(`Documentación disponible en http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();


const app = require('./app');
const { initDB } = require('./config/db');
const config = require('./config/config');
const logger = require('./logger/logger');

const startServer = async () => {
  try {
    // Inicializar base de datos
    await initDB();

    // Iniciar servidor
    const PORT = config.port;
    app.listen(PORT, () => {
      logger.info(`Blog API escuchando en puerto ${PORT}`);
      logger.info(`Documentación disponible en http://localhost:${PORT}/api/docs`);
      logger.info(`Healthcheck disponible en http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();


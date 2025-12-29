const { createLogger, format, transports } = require('winston');
const config = require('../config/config');

// Añadir nivel 'http' a winston
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logger = createLogger({
  levels: logLevels,
  level: config.logLevel,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'arsys-blog-api' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          if (Object.keys(meta).length > 0 && meta.service !== 'arsys-blog-api') {
            msg += ` ${JSON.stringify(meta)}`;
          }
          return msg;
        })
      ),
    }),
  ],
});

// Si no estamos en producción, también guardamos en archivo
if (config.env !== 'production') {
  logger.add(
    new transports.File({
      filename: 'logs/blog-error.log',
      level: 'error',
    })
  );
  logger.add(
    new transports.File({
      filename: 'logs/blog-combined.log',
    })
  );
}

module.exports = logger;


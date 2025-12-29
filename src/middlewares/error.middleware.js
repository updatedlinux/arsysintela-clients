const logger = require('../logger/logger');

const errorMiddleware = (err, req, res, next) => {
  logger.error('Error capturado:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Error de validación',
      details: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Error de clave duplicada
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Conflicto: el recurso ya existe',
      details: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Error de clave foránea
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Error de referencia: recurso relacionado no encontrado',
      details: err.message,
    });
  }

  // Error de Sequelize genérico
  if (err.name && err.name.startsWith('Sequelize')) {
    return res.status(400).json({
      message: 'Error en la base de datos',
      details: err.message,
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido',
      details: err.message,
    });
  }

  // Error por defecto
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorMiddleware;


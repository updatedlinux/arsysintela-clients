const logger = require('../logger/logger');

const adminMiddleware = (req, res, next) => {
  try {
    // Verificar que el usuario esté autenticado (debe pasar por authMiddleware primero)
    if (!req.user) {
      return res.status(401).json({
        message: 'Autenticación requerida',
        details: 'Debe estar autenticado para acceder a este recurso',
      });
    }

    // Verificar que el usuario tenga rol de admin
    if (req.user.role !== 'admin') {
      logger.warn(`Intento de acceso no autorizado a recurso admin por usuario: ${req.user.email}`);
      return res.status(403).json({
        message: 'Acceso denegado',
        details: 'Se requieren permisos de administrador para acceder a este recurso',
      });
    }

    next();
  } catch (error) {
    logger.error('Error en middleware de admin:', error);
    return res.status(500).json({
      message: 'Error al verificar permisos',
      details: error.message,
    });
  }
};

module.exports = adminMiddleware;


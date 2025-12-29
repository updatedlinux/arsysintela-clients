const logger = require('../logger/logger');

const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Autenticación requerida',
        details: 'Debe estar autenticado para acceder a este recurso',
      });
    }

    if (req.user.role !== 'admin') {
      logger.warn(`Intento de acceso no autorizado por usuario ${req.user.id} (role: ${req.user.role})`);
      return res.status(403).json({
        message: 'Acceso denegado',
        details: 'Solo los administradores pueden realizar esta acción',
      });
    }

    next();
  } catch (error) {
    logger.error('Error en middleware de administrador:', error);
    return res.status(500).json({
      message: 'Error al verificar permisos',
      details: error.message,
    });
  }
};

module.exports = adminMiddleware;


const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../logger/logger');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Token de autenticación requerido',
        details: 'Debe proporcionar un token Bearer en el header Authorization',
      });
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
      next();
    } catch (error) {
      logger.warn(`Token inválido: ${error.message}`);
      return res.status(401).json({
        message: 'Token inválido o expirado',
        details: error.message,
      });
    }
  } catch (error) {
    logger.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      message: 'Error al procesar la autenticación',
      details: error.message,
    });
  }
};

module.exports = authMiddleware;


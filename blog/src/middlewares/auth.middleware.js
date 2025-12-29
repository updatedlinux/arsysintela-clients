const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../logger/logger');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Token de autenticación requerido',
        details: 'Debe proporcionar un token JWT válido en el header Authorization: Bearer <token>',
      });
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Token expirado',
          details: 'El token JWT ha expirado. Por favor, inicie sesión nuevamente.',
        });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          message: 'Token inválido',
          details: 'El token JWT proporcionado no es válido.',
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      message: 'Error al verificar autenticación',
      details: error.message,
    });
  }
};

module.exports = authMiddleware;


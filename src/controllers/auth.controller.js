const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');
const logger = require('../logger/logger');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son requeridos',
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn(`Intento de login con email no encontrado: ${email}`);
      return res.status(401).json({
        message: 'Credenciales inválidas',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      logger.warn(`Intento de login con contraseña incorrecta para: ${email}`);
      return res.status(401).json({
        message: 'Credenciales inválidas',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
      }
    );

    logger.info(`Login exitoso para usuario: ${email}`);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error en login:', error);
    next(error);
  }
};

module.exports = {
  login,
};


const bcrypt = require('bcrypt');
const { User } = require('../models');
const logger = require('../logger/logger');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });

    res.json(users);
  } catch (error) {
    logger.error('Error al obtener usuarios:', error);
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    // Validaciones
    if (!email) {
      return res.status(400).json({
        message: 'El email es requerido',
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'La contraseña es requerida',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres',
      });
    }

    // Validar formato de email (Sequelize también lo valida, pero mejor dar feedback temprano)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'El formato del email no es válido',
      });
    }

    // Validar rol si se proporciona
    if (role && !['admin', 'user'].includes(role)) {
      return res.status(400).json({
        message: 'El rol debe ser "admin" o "user"',
      });
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      email,
      passwordHash,
      name: name || null,
      role: role || 'user',
    });

    logger.info(`Usuario creado: ${user.id} - ${user.email} por admin: ${req.user.email}`);

    // Retornar usuario sin passwordHash
    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    logger.error('Error al crear usuario:', error);
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const isAdmin = req.user.role === 'admin';
    const isOwnAccount = req.user.id === parseInt(id, 10);

    // Validar que newPassword esté presente
    if (!newPassword) {
      return res.status(400).json({
        message: 'La nueva contraseña es requerida',
      });
    }

    // Validar longitud mínima
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'La nueva contraseña debe tener al menos 8 caracteres',
      });
    }

    // Buscar el usuario
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }

    // Si es el mismo usuario (no admin), requiere currentPassword
    if (isOwnAccount && !isAdmin) {
      if (!currentPassword) {
        return res.status(400).json({
          message: 'La contraseña actual es requerida para cambiar tu propia contraseña',
        });
      }

      // Verificar contraseña actual
      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);

      if (!isValidPassword) {
        logger.warn(`Intento de cambio de contraseña con contraseña actual incorrecta para usuario: ${user.email}`);
        return res.status(401).json({
          message: 'La contraseña actual es incorrecta',
        });
      }
    }

    // Hashear nueva contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await user.update({ passwordHash });

    logger.info(`Contraseña actualizada para usuario: ${user.id} - ${user.email} por: ${req.user.email} (${isAdmin ? 'admin' : 'usuario'})`);

    res.json({
      message: 'Contraseña actualizada correctamente',
    });
  } catch (error) {
    logger.error('Error al actualizar contraseña:', error);
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updatePassword,
};


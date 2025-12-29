const { Client, Product, ClientProduct, User } = require('../models');
const logger = require('../logger/logger');

const getAllClients = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Client.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name', 'role'],
          required: false,
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Error al obtener clientes:', error);
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name', 'role'],
          required: false,
        },
        {
          model: Product,
          as: 'products',
          through: {
            attributes: ['id', 'status', 'startDate', 'endDate', 'notes'],
          },
        },
      ],
    });

    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado',
      });
    }

    res.json(client);
  } catch (error) {
    logger.error('Error al obtener cliente:', error);
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const { name, email, phone, company, notes, userId } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'El nombre es requerido',
      });
    }

    // Si se proporciona email, intentar asociar con usuario existente
    let finalUserId = userId;
    if (email && !finalUserId) {
      const user = await User.findOne({ where: { email } });
      if (user) {
        finalUserId = user.id;
        logger.info(`Cliente asociado automáticamente con usuario ${user.id} por email: ${email}`);
      }
    }

    const client = await Client.create({
      name,
      email,
      phone,
      company,
      notes,
      userId: finalUserId || null,
    });

    // Cargar cliente con usuario asociado si existe
    const clientWithUser = await Client.findByPk(client.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name', 'role'],
          required: false,
        },
      ],
    });

    logger.info(`Cliente creado: ${client.id} - ${client.name}${finalUserId ? ` (asociado a usuario ${finalUserId})` : ''}`);

    res.status(201).json(clientWithUser);
  } catch (error) {
    logger.error('Error al crear cliente:', error);
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, notes, userId } = req.body;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado',
      });
    }

    // Si se actualiza el email, intentar asociar con usuario existente
    let finalUserId = userId !== undefined ? userId : client.userId;
    if (email && email !== client.email && !finalUserId) {
      const user = await User.findOne({ where: { email } });
      if (user) {
        finalUserId = user.id;
        logger.info(`Cliente ${id} asociado automáticamente con usuario ${user.id} por email: ${email}`);
      }
    }

    await client.update({
      name: name !== undefined ? name : client.name,
      email: email !== undefined ? email : client.email,
      phone: phone !== undefined ? phone : client.phone,
      company: company !== undefined ? company : client.company,
      notes: notes !== undefined ? notes : client.notes,
      userId: finalUserId !== undefined ? finalUserId : client.userId,
    });

    // Cargar cliente actualizado con usuario asociado
    const updatedClient = await Client.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name', 'role'],
          required: false,
        },
        {
          model: Product,
          as: 'products',
          through: {
            attributes: ['id', 'status', 'startDate', 'endDate', 'notes'],
          },
        },
      ],
    });

    logger.info(`Cliente actualizado: ${client.id} - ${client.name}`);

    res.json(updatedClient);
  } catch (error) {
    logger.error('Error al actualizar cliente:', error);
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado',
      });
    }

    await client.destroy();

    logger.info(`Cliente eliminado: ${id} - ${client.name}`);

    res.status(204).send();
  } catch (error) {
    logger.error('Error al eliminar cliente:', error);
    next(error);
  }
};

const getMyClient = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Buscar cliente asociado al usuario autenticado
    const client = await Client.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name', 'role'],
          required: false,
        },
        {
          model: Product,
          as: 'products',
          through: {
            attributes: ['id', 'status', 'startDate', 'endDate', 'notes'],
          },
        },
      ],
    });

    if (!client) {
      return res.status(404).json({
        message: 'No se encontró un cliente asociado a tu cuenta',
        details: 'Contacta al administrador para asociar un cliente a tu usuario',
      });
    }

    res.json(client);
  } catch (error) {
    logger.error('Error al obtener cliente del usuario:', error);
    next(error);
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getMyClient,
};


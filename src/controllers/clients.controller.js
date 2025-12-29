const { Client, Product, ClientProduct } = require('../models');
const logger = require('../logger/logger');

const getAllClients = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Client.findAndCountAll({
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
    const { name, email, phone, company, notes } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'El nombre es requerido',
      });
    }

    const client = await Client.create({
      name,
      email,
      phone,
      company,
      notes,
    });

    logger.info(`Cliente creado: ${client.id} - ${client.name}`);

    res.status(201).json(client);
  } catch (error) {
    logger.error('Error al crear cliente:', error);
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, notes } = req.body;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado',
      });
    }

    await client.update({
      name: name !== undefined ? name : client.name,
      email: email !== undefined ? email : client.email,
      phone: phone !== undefined ? phone : client.phone,
      company: company !== undefined ? company : client.company,
      notes: notes !== undefined ? notes : client.notes,
    });

    logger.info(`Cliente actualizado: ${client.id} - ${client.name}`);

    res.json(client);
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

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};


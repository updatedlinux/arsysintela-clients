const { Client, Product, ClientProduct } = require('../models');
const logger = require('../logger/logger');

const getClientProducts = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado',
      });
    }

    const clientProducts = await ClientProduct.findAll({
      where: { client_id: id },
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json(clientProducts);
  } catch (error) {
    logger.error('Error al obtener productos del cliente:', error);
    next(error);
  }
};

const addClientProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { product_id, status, start_date, end_date, notes } = req.body;

    if (!product_id) {
      return res.status(400).json({
        message: 'El product_id es requerido',
      });
    }

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({
        message: 'Cliente no encontrado',
      });
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado',
      });
    }

    // Verificar si ya existe la relación
    const existing = await ClientProduct.findOne({
      where: {
        client_id: id,
        product_id: product_id,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: 'El producto ya está asociado a este cliente',
      });
    }

    const clientProduct = await ClientProduct.create({
      client_id: id,
      product_id,
      status: status || 'activo',
      start_date,
      end_date,
      notes,
    });

    const result = await ClientProduct.findByPk(clientProduct.id, {
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
    });

    logger.info(`Producto ${product_id} asociado al cliente ${id}`);

    res.status(201).json(result);
  } catch (error) {
    logger.error('Error al asociar producto al cliente:', error);
    next(error);
  }
};

const updateClientProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, start_date, end_date, notes } = req.body;

    const clientProduct = await ClientProduct.findByPk(id);

    if (!clientProduct) {
      return res.status(404).json({
        message: 'Relación cliente-producto no encontrada',
      });
    }

    await clientProduct.update({
      status: status !== undefined ? status : clientProduct.status,
      start_date: start_date !== undefined ? start_date : clientProduct.start_date,
      end_date: end_date !== undefined ? end_date : clientProduct.end_date,
      notes: notes !== undefined ? notes : clientProduct.notes,
    });

    const result = await ClientProduct.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'product',
        },
        {
          model: Client,
          as: 'client',
        },
      ],
    });

    logger.info(`Relación cliente-producto actualizada: ${id}`);

    res.json(result);
  } catch (error) {
    logger.error('Error al actualizar relación cliente-producto:', error);
    next(error);
  }
};

const deleteClientProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const clientProduct = await ClientProduct.findByPk(id);

    if (!clientProduct) {
      return res.status(404).json({
        message: 'Relación cliente-producto no encontrada',
      });
    }

    await clientProduct.destroy();

    logger.info(`Relación cliente-producto eliminada: ${id}`);

    res.status(204).send();
  } catch (error) {
    logger.error('Error al eliminar relación cliente-producto:', error);
    next(error);
  }
};

module.exports = {
  getClientProducts,
  addClientProduct,
  updateClientProduct,
  deleteClientProduct,
};


const { Product } = require('../models');
const logger = require('../logger/logger');

const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const active = req.query.active !== undefined ? req.query.active === 'true' : undefined;

    const where = {};
    if (active !== undefined) {
      where.active = active;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
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
    logger.error('Error al obtener productos:', error);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado',
      });
    }

    res.json(product);
  } catch (error) {
    logger.error('Error al obtener producto:', error);
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { code, name, description, active } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        message: 'El código y el nombre son requeridos',
      });
    }

    const product = await Product.create({
      code,
      name,
      description,
      active: active !== undefined ? active : true,
    });

    logger.info(`Producto creado: ${product.id} - ${product.code}`);

    res.status(201).json(product);
  } catch (error) {
    logger.error('Error al crear producto:', error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, name, description, active } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado',
      });
    }

    await product.update({
      code: code !== undefined ? code : product.code,
      name: name !== undefined ? name : product.name,
      description: description !== undefined ? description : product.description,
      active: active !== undefined ? active : product.active,
    });

    logger.info(`Producto actualizado: ${product.id} - ${product.code}`);

    res.json(product);
  } catch (error) {
    logger.error('Error al actualizar producto:', error);
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
};


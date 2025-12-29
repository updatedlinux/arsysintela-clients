const { sequelize, initDB } = require('../config/db');
const { User, Client, Product } = require('../models');
const bcrypt = require('bcrypt');
const logger = require('../logger/logger');

const seedDatabase = async () => {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    logger.info('Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: false });
    logger.info('Modelos sincronizados con la base de datos.');

    logger.info('Inicializando datos de ejemplo...');

    // Verificar si ya existe un usuario admin
    const existingAdmin = await User.findOne({ where: { email: 'admin@arsysintela.com' } });

    if (!existingAdmin) {
      // Crear usuario admin por defecto
      const passwordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@arsysintela.com',
        password_hash: passwordHash,
        name: 'Administrador',
        role: 'admin',
      });
      logger.info('Usuario admin creado: admin@arsysintela.com / admin123');
    } else {
      logger.info('El usuario admin ya existe');
    }

    // Crear algunos productos de ejemplo si no existen
    const products = [
      {
        code: 'ASSISTANT360',
        name: 'Assistant 360',
        description: 'Solución de asistencia virtual 360°',
        active: true,
      },
      {
        code: 'CONDOMINIO360',
        name: 'Condominio 360',
        description: 'Gestión integral de condominios',
        active: true,
      },
      {
        code: 'INTELA_GRID',
        name: 'Intela Grid',
        description: 'Plataforma de gestión inteligente',
        active: true,
      },
      {
        code: 'INTELA_SMART',
        name: 'Intela Smart',
        description: 'Solución inteligente de gestión',
        active: true,
      },
    ];

    for (const productData of products) {
      const existingProduct = await Product.findOne({ where: { code: productData.code } });
      if (!existingProduct) {
        await Product.create(productData);
        logger.info(`Producto creado: ${productData.code}`);
      }
    }

    logger.info('Base de datos inicializada correctamente');
    process.exit(0);
  } catch (error) {
    logger.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();


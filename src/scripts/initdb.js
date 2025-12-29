const { sequelize } = require('../config/db');
const { Sequelize } = require('sequelize');
const { User, Client, Product, ClientProduct } = require('../models');
const bcrypt = require('bcrypt');
const logger = require('../logger/logger');

const seedDatabase = async () => {
  try {
    logger.info('Iniciando inicialización de la base de datos...');

    // Conectar a la base de datos
    await sequelize.authenticate();
    logger.info('✓ Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos (crear tablas si no existen, sin alterar las existentes)
    // force: false - no borra tablas existentes
    // alter: false - no modifica estructura de tablas existentes
    await sequelize.sync({ force: false, alter: false });
    logger.info('✓ Modelos sincronizados con la base de datos.');

    logger.info('Inicializando datos de ejemplo...');

    // Verificar y crear usuario admin
    const adminEmail = 'admin@arsysintela.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        email: adminEmail,
        passwordHash: passwordHash,
        name: 'Administrador',
        role: 'admin',
      });
      logger.info(`✓ Usuario admin creado: ${adminEmail} / admin123`);
    } else {
      logger.info(`✓ Usuario admin ya existe: ${adminEmail}`);
    }

    // Crear productos de ejemplo
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

    let productsCreated = 0;
    let productsSkipped = 0;

    for (const productData of products) {
      const existingProduct = await Product.findOne({ where: { code: productData.code } });
      if (!existingProduct) {
        await Product.create(productData);
        productsCreated++;
        logger.info(`✓ Producto creado: ${productData.code} - ${productData.name}`);
      } else {
        productsSkipped++;
        logger.info(`- Producto ya existe: ${productData.code}`);
      }
    }

    logger.info(`✓ Productos procesados: ${productsCreated} creados, ${productsSkipped} ya existían`);

    // Verificar estructura de tablas
    const tables = ['users', 'clients', 'products', 'client_products'];
    const dbName = sequelize.config.database;
    for (const tableName of tables) {
      try {
        const results = await sequelize.query(
          `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`,
          {
            replacements: [dbName, tableName],
            type: Sequelize.QueryTypes.SELECT,
          }
        );
        if (results && results.length > 0 && results[0].count > 0) {
          logger.info(`✓ Tabla '${tableName}' existe`);
        } else {
          logger.warn(`⚠ Tabla '${tableName}' no encontrada`);
        }
      } catch (err) {
        logger.warn(`⚠ Error al verificar tabla '${tableName}': ${err.message}`);
      }
    }

    logger.info('');
    logger.info('═══════════════════════════════════════════════════════════');
    logger.info('✓ Base de datos inicializada correctamente');
    logger.info('═══════════════════════════════════════════════════════════');
    logger.info('');
    logger.info('Credenciales de acceso:');
    logger.info('  Email: admin@arsysintela.com');
    logger.info('  Contraseña: admin123');
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('');
    logger.error('═══════════════════════════════════════════════════════════');
    logger.error('✗ Error al inicializar la base de datos');
    logger.error('═══════════════════════════════════════════════════════════');
    logger.error('Detalles:', error.message);
    if (error.stack) {
      logger.error('Stack:', error.stack);
    }
    logger.error('');
    process.exit(1);
  }
};

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };


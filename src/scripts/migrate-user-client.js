const { sequelize } = require('../config/db');
const { Sequelize } = require('sequelize');
const { User, Client } = require('../models');
const logger = require('../logger/logger');

const migrateUserClient = async () => {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    logger.info('✓ Conexión a la base de datos establecida correctamente.');
    logger.info('');

    logger.info('═══════════════════════════════════════════════════════════');
    logger.info('Iniciando migración: Asociación Usuario-Cliente');
    logger.info('═══════════════════════════════════════════════════════════');
    logger.info('');

    const transaction = await sequelize.transaction();

    // Paso 1: Verificar si la columna userId ya existe
    logger.info('Paso 1: Verificando estructura de la tabla clients...');
    const [tableInfo] = await sequelize.query(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = 'clients' 
       AND COLUMN_NAME = 'user_id'`,
      {
        replacements: [sequelize.config.database],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (tableInfo && tableInfo.length > 0) {
      logger.info('✓ La columna user_id ya existe en la tabla clients');
      
      // Verificar si la constraint existe
      const [constraintInfo] = await sequelize.query(
        `SELECT CONSTRAINT_NAME 
         FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
         WHERE TABLE_SCHEMA = ? 
         AND TABLE_NAME = 'clients' 
         AND CONSTRAINT_NAME = 'fk_client_user'`,
        {
          replacements: [sequelize.config.database],
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (!constraintInfo || constraintInfo.length === 0) {
        logger.info('→ Agregando constraint de foreign key...');
        await sequelize.query(
          `ALTER TABLE clients 
           ADD CONSTRAINT fk_client_user 
           FOREIGN KEY (user_id) REFERENCES users(id) 
           ON DELETE SET NULL ON UPDATE CASCADE`,
          { transaction }
        );
        logger.info('✓ Constraint agregada exitosamente');
      } else {
        logger.info('✓ La constraint fk_client_user ya existe');
      }
    } else {
      logger.info('→ Agregando columna user_id a la tabla clients...');
      try {
        await sequelize.query(
          `ALTER TABLE clients 
           ADD COLUMN user_id INT NULL`,
          { transaction }
        );
        logger.info('✓ Columna user_id agregada exitosamente');
        
        // Agregar constraint
        logger.info('→ Agregando constraint de foreign key...');
        await sequelize.query(
          `ALTER TABLE clients 
           ADD CONSTRAINT fk_client_user 
           FOREIGN KEY (user_id) REFERENCES users(id) 
           ON DELETE SET NULL ON UPDATE CASCADE`,
          { transaction }
        );
        logger.info('✓ Constraint agregada exitosamente');
      } catch (error) {
        // Si la columna ya existe pero no fue detectada, continuar
        if (error.message.includes('Duplicate column name')) {
          logger.info('⚠ La columna ya existe, continuando...');
        } else {
          throw error;
        }
      }
    }

    // Paso 2: Obtener todos los usuarios y clientes
    logger.info('');
    logger.info('Paso 2: Obteniendo usuarios y clientes...');
    const users = await User.findAll({ transaction });
    const clients = await Client.findAll({ transaction });

    logger.info(`  - Usuarios encontrados: ${users.length}`);
    logger.info(`  - Clientes encontrados: ${clients.length}`);

    // Paso 3: Asociar clientes con usuarios por email
    logger.info('');
    logger.info('Paso 3: Asociando clientes con usuarios por email...');
    
    let asociados = 0;
    let sinAsociar = 0;
    const asociaciones = [];

    for (const client of clients) {
      if (!client.email) {
        sinAsociar++;
        logger.info(`  - Cliente ${client.id} (${client.name}): Sin email, no se puede asociar`);
        continue;
      }

      // Buscar usuario con el mismo email (case-insensitive)
      const user = users.find(
        u => u.email.toLowerCase() === client.email.toLowerCase()
      );

      if (user) {
        // Actualizar el cliente con el userId
        await client.update({ userId: user.id }, { transaction });
        asociados++;
        asociaciones.push({
          cliente: `${client.name} (${client.email})`,
          usuario: `${user.name || user.email} (${user.email})`,
        });
        logger.info(`  ✓ Cliente ${client.id} asociado con Usuario ${user.id} (${client.email})`);
      } else {
        sinAsociar++;
        logger.info(`  - Cliente ${client.id} (${client.email}): No se encontró usuario con este email`);
      }
    }

    // Paso 4: Crear clientes para usuarios que no tienen cliente asociado
    logger.info('');
    logger.info('Paso 4: Creando clientes para usuarios sin cliente asociado...');
    
    let clientesCreados = 0;
    for (const user of users) {
      // Verificar si ya tiene un cliente asociado
      const clienteExistente = await Client.findOne({
        where: { userId: user.id },
        transaction,
      });

      if (!clienteExistente) {
        // Crear cliente para este usuario
        const nuevoCliente = await Client.create(
          {
            name: user.name || user.email.split('@')[0],
            email: user.email,
            userId: user.id,
          },
          { transaction }
        );
        clientesCreados++;
        logger.info(`  ✓ Cliente creado para Usuario ${user.id} (${user.email}) - Cliente ID: ${nuevoCliente.id}`);
      }
    }

    // Commit de la transacción
    await transaction.commit();

    // Resumen
    logger.info('');
    logger.info('═══════════════════════════════════════════════════════════');
    logger.info('✓ Migración completada exitosamente');
    logger.info('═══════════════════════════════════════════════════════════');
    logger.info('');
    logger.info('Resumen:');
    logger.info(`  - Clientes asociados con usuarios: ${asociados}`);
    logger.info(`  - Clientes sin asociar (sin email o email no encontrado): ${sinAsociar}`);
    logger.info(`  - Clientes creados para usuarios: ${clientesCreados}`);
    logger.info('');

    if (asociaciones.length > 0) {
      logger.info('Asociaciones realizadas:');
      asociaciones.forEach((asoc, idx) => {
        logger.info(`  ${idx + 1}. ${asoc.cliente} → ${asoc.usuario}`);
      });
      logger.info('');
    }

    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    logger.error('');
    logger.error('═══════════════════════════════════════════════════════════');
    logger.error('✗ Error en la migración');
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
  migrateUserClient();
}

module.exports = { migrateUserClient };


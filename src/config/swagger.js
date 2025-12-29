const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Arsys Intela - Portal de Clientes API',
      version: '1.0.0',
      description: 'API REST para el Portal de Clientes de Arsys Intela',
      contact: {
        name: 'Arsys Intela',
        email: 'soporte@arsysintela.com',
      },
    },
    servers: [
      {
        url: 'https://clientes.arsystech.net/api',
        description: 'Producción',
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Desarrollo local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Endpoints de healthcheck',
      },
      {
        name: 'Auth',
        description: 'Endpoints de autenticación',
      },
      {
        name: 'Users',
        description: 'Gestión de usuarios del sistema (requiere autenticación)',
      },
      {
        name: 'Clients',
        description: 'Gestión de clientes de negocio',
      },
      {
        name: 'Products',
        description: 'Gestión de productos',
      },
      {
        name: 'ClientProducts',
        description: 'Relaciones entre clientes y productos',
      },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../routes/users.routes.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

// Debug: Verificar qué paths se detectaron
if (process.env.NODE_ENV === 'development') {
  const paths = Object.keys(swaggerSpec.paths || {});
  console.log(`[Swagger] Paths detectados: ${paths.length}`);
  if (paths.length > 0) {
    console.log(`[Swagger] Primeros paths: ${paths.slice(0, 5).join(', ')}`);
  }
  const hasUsers = paths.some(p => p.includes('/users'));
  console.log(`[Swagger] ¿Incluye /users?: ${hasUsers}`);
}

module.exports = swaggerSpec;


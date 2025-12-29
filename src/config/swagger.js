const swaggerJsdoc = require('swagger-jsdoc');

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
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;


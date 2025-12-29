const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Arsys Intela - Blog API',
      version: '1.0.0',
      description: 'API REST para el Blog de Arsys Intela',
      contact: {
        name: 'Arsys Intela',
        email: 'soporte@arsysintela.com',
      },
    },
    servers: [
      {
        url: 'https://blog.arsystech.net/api',
        description: 'Producción',
      },
      {
        url: 'http://localhost:3001/api',
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
      schemas: {
        Post: {
          type: 'object',
          required: ['title', 'slug', 'excerpt', 'author', 'publishedAt', 'headerImageUrl', 'contentHtml'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            title: {
              type: 'string',
              example: 'Cómo combinar infraestructura privada e IA para tu negocio',
            },
            slug: {
              type: 'string',
              example: 'como-combinar-infraestructura-privada-ia-negocio',
            },
            excerpt: {
              type: 'string',
              example: 'Descubre cómo la combinación de infraestructura privada e inteligencia artificial puede transformar tu negocio.',
            },
            author: {
              type: 'string',
              example: 'Rabby Mahmud',
            },
            tag: {
              type: 'string',
              nullable: true,
              example: 'Infraestructura',
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-30T00:00:00.000Z',
            },
            headerImageUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://placehold.co/800x400',
            },
            contentHtml: {
              type: 'string',
              example: '<h2>Introducción</h2><p>Contenido del post...</p>',
            },
            isPublished: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        PostSummary: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            title: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            excerpt: {
              type: 'string',
            },
            author: {
              type: 'string',
            },
            tag: {
              type: 'string',
              nullable: true,
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
            },
            headerImageUrl: {
              type: 'string',
              format: 'uri',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1,
            },
            limit: {
              type: 'integer',
              example: 6,
            },
            total: {
              type: 'integer',
              example: 20,
            },
            totalPages: {
              type: 'integer',
              example: 4,
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;


const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const logger = require('./logger/logger');
const errorMiddleware = require('./middlewares/error.middleware');

// Importar rutas
const healthRouter = require('./routes/health.routes');
const authRouter = require('./routes/auth.routes');
const clientsRouter = require('./routes/clients.routes');
const productsRouter = require('./routes/products.routes');
const clientProductsRouter = require('./routes/clientProducts.routes');
const usersRouter = require('./routes/users.routes');

// Importar middlewares
const authMiddleware = require('./middlewares/auth.middleware');
const adminMiddleware = require('./middlewares/admin.middleware');

const app = express();

// Trust proxy (necesario cuando está detrás de Nginx Proxy Manager)
app.set('trust proxy', 1);

// Configurar CORS ANTES de cualquier otra ruta o middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'https://clientes.arsystech.net',
      'https://www.arsysintela.com',
      'http://localhost:5000', // Flask en desarrollo
      'http://localhost:3000',
      'http://10.200.1.230:3000', // IP interna
      'http://10.200.1.230', // IP interna sin puerto
    ];

    // Permitir requests sin origin (ej: Postman, curl, Swagger UI desde mismo dominio)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS bloqueado para origen: ${origin}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Integrar morgan con winston para logs HTTP
const stream = {
  write: (message) => logger.http(message.trim()),
};

app.use(morgan('combined', { stream }));

// Swagger UI con opciones para evitar caché
app.use('/api/docs', (req, res, next) => {
  // Headers para evitar caché
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Arsys Intela - Portal de Clientes API v1.0.1',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
}));

// Endpoint para servir el spec JSON directamente (útil para debugging)
app.get('/api/docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.json(swaggerSpec);
});

// Rutas públicas
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

// Rutas protegidas
app.use('/api/clients', authMiddleware, clientsRouter);
app.use('/api/products', authMiddleware, productsRouter);
app.use('/api', authMiddleware, clientProductsRouter);

// Rutas de usuarios (requieren autenticación y rol admin, excepto cambio de contraseña)
app.use('/api/users', authMiddleware, usersRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Arsys Intela - Portal de Clientes API',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorMiddleware);

module.exports = app;


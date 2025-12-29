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

// Importar middleware de autenticación
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();

// Configurar CORS
const corsOptions = {
  origin: [
    'https://clientes.arsystech.net',
    'https://www.arsysintela.com',
    'http://localhost:5000', // Flask en desarrollo
    'http://localhost:3000',
  ],
  credentials: true,
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

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Arsys Intela - Portal de Clientes API',
}));

// Rutas públicas
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

// Rutas protegidas
app.use('/api/clients', authMiddleware, clientsRouter);
app.use('/api/products', authMiddleware, productsRouter);
app.use('/api', authMiddleware, clientProductsRouter);

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


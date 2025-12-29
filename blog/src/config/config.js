require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'arsys_blog',
    password: process.env.DB_PASSWORD || 'changeme',
    database: process.env.DB_NAME || 'arsys_blog_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretkeychangeme',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};


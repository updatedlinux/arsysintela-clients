module.exports = {
  apps: [
    {
      name: 'arsys-blog-api',
      script: './src/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      node_args: '--max-old-space-size=512',
      // Variables de entorno (ajustar según tu configuración)
      // Estas se pueden sobrescribir con un archivo .env
      env_file: '.env',
    },
  ],
};


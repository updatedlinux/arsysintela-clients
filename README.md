# Portal de Clientes - Arsys Intela API

Backend API REST para el Portal de Clientes de Arsys Intela. Esta API proporciona endpoints para gestionar clientes, productos y sus relaciones, con autenticación JWT y documentación Swagger/OpenAPI.

## 🚀 Características

- **API REST** completa con Express.js
- **Base de datos**: MariaDB con Sequelize ORM
- **Autenticación**: JWT (Bearer token)
- **Documentación**: Swagger/OpenAPI accesible en `/api/docs`
- **Logging**: Winston con integración de Morgan para logs HTTP
- **CORS**: Configurado para producción y desarrollo
- **Validación**: Manejo de errores robusto con middlewares

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MariaDB (v10.3 o superior)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio** (si aplica) o navegar al directorio del proyecto

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales de base de datos:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=arsys_portal
DB_PASSWORD=tu_contraseña
DB_NAME=arsys_portal_db

JWT_SECRET=tu_secreto_jwt_muy_seguro
JWT_EXPIRES_IN=1d

LOG_LEVEL=info
```

4. **Crear la base de datos en MariaDB**:
```sql
CREATE DATABASE arsys_portal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. **Inicializar la base de datos** (crea tablas, relaciones y datos de ejemplo):
```bash
npm run initdb
```

Este comando:
- Crea todas las tablas necesarias
- Establece las relaciones entre modelos
- Crea un usuario admin por defecto:
  - Email: `admin@arsysintela.com`
  - Contraseña: `admin123`
- Crea productos de ejemplo (ASSISTANT360, CONDOMINIO360, INTELA_GRID, INTELA_SMART)

6. **Asociar usuarios con clientes** (recomendado después de crear usuarios):
```bash
npm run migrate:user-client
```

Este comando:
- Agrega la columna `user_id` a la tabla `clients` si no existe
- Asocia clientes existentes con usuarios por email (coincidencia exacta, case-insensitive)
- Crea clientes automáticamente para usuarios que no tienen cliente asociado
- **Nota importante**: La relación Usuario-Cliente se basa en el email. Un usuario = un cliente.

## 🏃 Ejecución

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción (directo):
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Producción con PM2 (Recomendado)

PM2 es un gestor de procesos para Node.js que permite mantener la aplicación corriendo en producción con reinicio automático, logs y monitoreo.

#### Instalación de PM2:
```bash
npm install -g pm2
```

#### Configuración inicial:

1. **Usar el archivo de configuración PM2** (recomendado):
```bash
pm2 start ecosystem.config.js
```

2. **O iniciar manualmente**:
```bash
pm2 start src/server.js --name arsys-portal-api
```

#### Comandos útiles de PM2:

```bash
# Ver estado de los procesos
pm2 status

# Ver logs en tiempo real
pm2 logs arsys-portal-api

# Ver logs de los últimos 100 líneas
pm2 logs arsys-portal-api --lines 100

# Reiniciar la aplicación
pm2 restart arsys-portal-api

# Detener la aplicación
pm2 stop arsys-portal-api

# Eliminar la aplicación de PM2
pm2 delete arsys-portal-api

# Monitoreo en tiempo real
pm2 monit

# Guardar la configuración actual para que PM2 la restaure al reiniciar
pm2 save

# Configurar PM2 para iniciar al arrancar el sistema (Linux)
pm2 startup
pm2 save
```

#### Configuración con archivo ecosystem.config.js:

El proyecto incluye un archivo `ecosystem.config.js` con la configuración recomendada para producción. Este archivo permite:

- Configurar variables de entorno
- Definir el número de instancias (cluster mode)
- Configurar logs
- Configurar reinicios automáticos
- Y más opciones avanzadas

Para usar el archivo de configuración:
```bash
pm2 start ecosystem.config.js
```

#### Variables de entorno en PM2:

Si prefieres usar variables de entorno desde un archivo `.env` con PM2, puedes instalar `pm2-dotenv`:
```bash
npm install -g pm2-dotenv
pm2 start ecosystem.config.js --env production
```

O definir las variables directamente en `ecosystem.config.js` en la sección `env`.

## 📚 Endpoints de la API

### Healthcheck
- `GET /api/health` - Verifica el estado de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión y obtener token JWT

### Clientes (requiere autenticación)
- `GET /api/clients` - Listar clientes (con paginación)
- `GET /api/clients/me` - Obtener mi cliente asociado (cliente del usuario autenticado)
- `GET /api/clients/:id` - Obtener cliente por ID
- `POST /api/clients` - Crear nuevo cliente (se asocia automáticamente con usuario si el email coincide)
- `PUT /api/clients/:id` - Actualizar cliente (se asocia automáticamente con usuario si el email coincide)
- `DELETE /api/clients/:id` - Eliminar cliente

### Productos (requiere autenticación)
- `GET /api/products` - Listar productos (con paginación y filtro por activo)
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto

### Relaciones Cliente-Producto (requiere autenticación)
- `GET /api/clients/:id/products` - Obtener productos de un cliente
- `POST /api/clients/:id/products` - Asociar producto a cliente
- `PUT /api/client-products/:id` - Actualizar relación cliente-producto
- `DELETE /api/client-products/:id` - Eliminar relación cliente-producto

## 📖 Documentación Swagger

La documentación interactiva de la API está disponible en:
- **Local**: http://localhost:3000/api/docs
- **Producción**: https://clientes.arsystech.net/api/docs

## 🔐 Autenticación

Todas las rutas (excepto `/api/health` y `/api/auth/login`) requieren autenticación mediante JWT.

### Cómo usar:

1. **Obtener token**:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@arsysintela.com",
  "password": "admin123"
}
```

2. **Usar el token** en las peticiones:
```bash
Authorization: Bearer <tu_token_jwt>
```

## 🗄️ Modelo de Datos

### User
- `id` (PK, autoincrement)
- `email` (único, no nulo)
- `password_hash` (no nulo)
- `name` (opcional)
- `role` (enum: 'admin', 'user', default: 'user')
- `created_at`, `updated_at`

**Relación**: Un usuario puede tener un cliente asociado (uno a uno) a través del campo `userId` en la tabla `clients`.

### Client
- `id` (PK, autoincrement)
- `name` (no nulo)
- `email` (opcional)
- `phone` (opcional)
- `company` (opcional)
- `notes` (opcional, TEXT)
- `user_id` (FK → User.id, opcional) - **Nuevo**: Asociación con usuario por email
- `created_at`, `updated_at`

**Relación**: Un cliente puede estar asociado a un usuario (muchos a uno). La asociación se realiza automáticamente por email cuando se crea un usuario o se actualiza un cliente.

### Product
- `id` (PK, autoincrement)
- `code` (único, no nulo) - Ej: 'ASSISTANT360', 'CONDOMINIO360'
- `name` (no nulo)
- `description` (opcional, TEXT)
- `active` (BOOLEAN, default: true)
- `created_at`, `updated_at`

### ClientProduct (tabla de unión)
- `id` (PK, autoincrement)
- `client_id` (FK → Client.id)
- `product_id` (FK → Product.id)
- `status` (enum: 'activo', 'suspendido', 'finalizado', default: 'activo')
- `start_date` (DATE, opcional)
- `end_date` (DATE, opcional)
- `notes` (opcional, TEXT)
- `created_at`, `updated_at`

## 🔄 Configuración de Nginx Proxy Manager

La API está diseñada para funcionar detrás de Nginx Proxy Manager:

- **URL externa**: `https://clientes.arsystech.net/api/`
- **Puerto interno**: `3000`
- **SSL offloading**: Nginx maneja el SSL

Asegúrate de que Nginx Proxy Manager esté configurado para:
- Proxy pass a `http://localhost:3000`
- Preservar el path `/api/`
- Manejar CORS si es necesario (aunque la API ya lo maneja)

## 📝 Logging

Los logs se generan con Winston y se integran con Morgan para logs HTTP:

- **Consola**: Todos los logs se muestran en consola con formato legible
- **Archivos** (solo en desarrollo):
  - `logs/error.log` - Solo errores
  - `logs/combined.log` - Todos los logs

Niveles de log:
- `error`: Errores críticos
- `warn`: Advertencias
- `info`: Información general
- `http`: Logs de peticiones HTTP (Morgan)
- `debug`: Información de depuración

## 🛠️ Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm run initdb` - Inicializa la base de datos (crea tablas, relaciones y datos de ejemplo)
- `npm run migrate:user-client` - Migra y asocia usuarios con clientes por email

### Scripts PM2 (opcional)

Puedes agregar estos scripts a tu `package.json` para facilitar el uso de PM2:

```json
{
  "scripts": {
    "pm2:start": "pm2 start ecosystem.config.js",
    "pm2:stop": "pm2 stop arsys-portal-api",
    "pm2:restart": "pm2 restart arsys-portal-api",
    "pm2:logs": "pm2 logs arsys-portal-api",
    "pm2:monit": "pm2 monit"
  }
}
```

Luego puedes usar:
- `npm run pm2:start` - Iniciar con PM2
- `npm run pm2:stop` - Detener
- `npm run pm2:restart` - Reiniciar
- `npm run pm2:logs` - Ver logs
- `npm run pm2:monit` - Monitoreo

## 🏗️ Estructura del Proyecto

```
arsysintela-clients/
├── src/
│   ├── app.js                 # Configuración de Express
│   ├── server.js              # Punto de entrada
│   ├── config/
│   │   ├── config.js          # Variables de entorno
│   │   ├── db.js              # Configuración Sequelize
│   │   └── swagger.js         # Configuración Swagger
│   ├── models/
│   │   ├── User.js
│   │   ├── Client.js
│   │   ├── Product.js
│   │   ├── ClientProduct.js
│   │   └── index.js           # Asociaciones
│   ├── routes/
│   │   ├── health.routes.js
│   │   ├── auth.routes.js
│   │   ├── clients.routes.js
│   │   ├── products.routes.js
│   │   └── clientProducts.routes.js
│   ├── controllers/
│   │   ├── health.controller.js
│   │   ├── auth.controller.js
│   │   ├── clients.controller.js
│   │   ├── products.controller.js
│   │   └── clientProducts.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── logger/
│   │   └── logger.js          # Configuración Winston
│   └── scripts/
│       └── initdb.js          # Script de inicialización
├── .env.example               # Ejemplo de variables de entorno
├── ecosystem.config.js         # Configuración PM2
├── package.json
└── README.md
```

## 🔒 Seguridad

- Las contraseñas se hashean con bcrypt (10 rounds)
- Los tokens JWT tienen expiración configurable
- Validación de datos de entrada
- Manejo seguro de errores (sin exponer información sensible en producción)
- CORS configurado para dominios específicos

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que MariaDB esté corriendo
- Confirma las credenciales en `.env`
- Asegúrate de que la base de datos existe

### Error 401 (No autorizado)
- Verifica que el token JWT sea válido y no haya expirado
- Asegúrate de incluir el header `Authorization: Bearer <token>`

### Las tablas no se crean
- Ejecuta `npm run initdb` manualmente
- Verifica que el usuario de la DB tenga permisos de creación

## 📄 Licencia

ISC

## 👥 Autor

Arsys Intela

---

Para más información, consulta la documentación Swagger en `/api/docs` una vez que el servidor esté corriendo.


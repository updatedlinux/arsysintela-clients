# Arsys Intela - Blog API

Backend API REST para el Blog de Arsys Intela. Proporciona endpoints para gestionar posts del blog, con endpoints públicos para lectura y endpoints protegidos para administración.

## 📋 Características

- **Node.js + Express**: Framework web rápido y minimalista
- **MariaDB + Sequelize**: Base de datos relacional con ORM
- **JWT Authentication**: Autenticación mediante tokens Bearer
- **Swagger/OpenAPI**: Documentación interactiva de la API
- **Winston + Morgan**: Logging completo de aplicación y HTTP
- **CORS configurado**: Para integración con frontend Flask y Portal de Clientes

## 🚀 Instalación

1. **Instalar dependencias**:
```bash
cd blog
npm install
```

2. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=arsys_blog
DB_PASSWORD=tu_password
DB_NAME=arsys_blog_db

JWT_SECRET=tu_secret_key_muy_segura
JWT_EXPIRES_IN=1d

LOG_LEVEL=info
```

3. **Crear base de datos**:
```sql
CREATE DATABASE arsys_blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'arsys_blog'@'localhost' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON arsys_blog_db.* TO 'arsys_blog'@'localhost';
FLUSH PRIVILEGES;
```

4. **Inicializar base de datos y crear datos demo**:
```bash
npm run seed
```

Este comando:
- Crea las tablas necesarias
- Inserta 6 posts de ejemplo

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

### Producción
```bash
npm start
```

## 📚 Endpoints

### Públicos (sin autenticación)

- `GET /api/health` - Healthcheck de la API
- `GET /api/posts` - Listar posts publicados (con paginación y filtro por tag)
- `GET /api/posts/:slug` - Obtener post completo por slug

### Protegidos (requieren JWT + rol admin)

- `POST /api/posts` - Crear nuevo post
- `PUT /api/posts/:id` - Actualizar post
- `DELETE /api/posts/:id` - Eliminar post

## 🔐 Autenticación

Los endpoints protegidos requieren un token JWT válido en el header:

```
Authorization: Bearer <token>
```

El token debe ser generado desde el Portal de Clientes (`POST /api/auth/login`) y el usuario debe tener rol `admin`.

## 📖 Documentación Swagger

La documentación interactiva está disponible en:
- Desarrollo: `http://localhost:3001/api/docs`
- Producción: `https://blog.arsystech.net/api/docs`

## 🗄️ Modelo de Datos

### Post

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | ID único (PK, autoincrement) |
| title | STRING | Título del post (requerido) |
| slug | STRING | Slug único generado desde el título |
| excerpt | TEXT | Resumen del post (requerido) |
| author | STRING | Nombre del autor (requerido) |
| tag | STRING | Tag del post (opcional) |
| publishedAt | DATE | Fecha de publicación (requerido) |
| headerImageUrl | STRING | URL de la imagen de cabecera (requerido) |
| contentHtml | TEXT | Contenido HTML completo (requerido) |
| isPublished | BOOLEAN | Si el post está publicado (default: true) |
| createdAt | DATE | Fecha de creación |
| updatedAt | DATE | Fecha de última actualización |

## 🔧 Scripts NPM

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm run seed` - Crea las tablas e inserta posts de ejemplo

## 🌐 Configuración Nginx Proxy Manager

El backend está diseñado para funcionar detrás de Nginx Proxy Manager:

- **FQDN**: `https://blog.arsystech.net`
- **API Base**: `https://blog.arsystech.net/api`
- **Puerto interno**: `3001`

### Configuración recomendada en Nginx:

```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## 📝 Ejemplos de Uso

### Listar posts (público)
```bash
curl http://localhost:3001/api/posts?page=1&limit=6
```

### Obtener post por slug (público)
```bash
curl http://localhost:3001/api/posts/como-combinar-infraestructura-privada-ia-negocio
```

### Crear post (admin)
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nuevo Post",
    "excerpt": "Resumen del post",
    "author": "Autor",
    "tag": "Infraestructura",
    "publishedAt": "2025-01-30T00:00:00Z",
    "headerImageUrl": "https://placehold.co/800x400",
    "contentHtml": "<h2>Título</h2><p>Contenido...</p>"
  }'
```

## 🔍 Logging

Los logs se generan con Winston y se integran con Morgan para logs HTTP:

- **Consola**: Todos los logs en desarrollo
- **Archivos** (solo en desarrollo):
  - `logs/blog-error.log` - Solo errores
  - `logs/blog-combined.log` - Todos los logs

## 🛡️ Seguridad

- Autenticación JWT para endpoints de escritura
- Validación de rol admin para operaciones administrativas
- CORS configurado para orígenes específicos
- Validación de datos de entrada
- Manejo seguro de errores (sin exponer detalles en producción)

## 📦 Estructura del Proyecto

```
blog/
├── src/
│   ├── app.js                 # Configuración de Express
│   ├── server.js              # Punto de entrada
│   ├── config/
│   │   ├── config.js          # Variables de entorno
│   │   ├── db.js              # Configuración Sequelize
│   │   └── swagger.js         # Configuración Swagger
│   ├── models/
│   │   ├── Post.js            # Modelo Post
│   │   └── index.js           # Exportación de modelos
│   ├── routes/
│   │   ├── health.routes.js   # Rutas de healthcheck
│   │   └── posts.routes.js    # Rutas de posts
│   ├── controllers/
│   │   ├── health.controller.js
│   │   └── posts.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js # Verificación JWT
│   │   ├── admin.middleware.js # Verificación de rol admin
│   │   └── error.middleware.js # Manejo de errores
│   ├── logger/
│   │   └── logger.js          # Configuración Winston
│   └── scripts/
│       └── seed.js            # Script de datos demo
├── .env.example               # Ejemplo de variables de entorno
├── package.json
└── README.md
```

## 🔄 Integración con Portal de Clientes

El Blog API utiliza el mismo sistema de autenticación que el Portal de Clientes:

1. Los usuarios se autentican en el Portal de Clientes (`POST /api/auth/login`)
2. El token JWT generado puede usarse en el Blog API
3. Solo usuarios con rol `admin` pueden crear/editar/eliminar posts

## 🐛 Troubleshooting

### Error de conexión a la base de datos
- Verifica que MariaDB esté corriendo
- Revisa las credenciales en `.env`
- Asegúrate de que la base de datos exista

### Error 401 en endpoints protegidos
- Verifica que el token JWT sea válido
- Asegúrate de incluir `Authorization: Bearer <token>` en el header
- Verifica que el token no haya expirado

### Error 403 en endpoints admin
- Verifica que el usuario tenga rol `admin`
- El token debe contener `role: "admin"` en el payload

### Posts no aparecen
- Verifica que `isPublished: true` en los posts
- Revisa que la fecha `publishedAt` no sea futura (si aplica lógica adicional)

## 📄 Licencia

ISC

---

**Última actualización**: Enero 2025  
**Versión**: 1.0.0


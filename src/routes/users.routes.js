const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updatePassword,
} = require('../controllers/users.controller');
const adminMiddleware = require('../middlewares/admin.middleware');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener lista de usuarios (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Retorna una lista de todos los usuarios del sistema.
 *       Solo accesible para usuarios con rol 'admin'.
 *       **Nota**: El campo passwordHash nunca se incluye en las respuestas por seguridad.
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: usuario@arsysintela.com
 *                   name:
 *                     type: string
 *                     nullable: true
 *                     example: Nombre Usuario
 *                   role:
 *                     type: string
 *                     enum: [admin, user]
 *                     example: user
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-28T23:55:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-28T23:55:00.000Z"
 *       401:
 *         description: No autorizado (token inválido o faltante)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token de autenticación requerido
 *       403:
 *         description: Acceso denegado (se requieren permisos de admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acceso denegado
 *                 details:
 *                   type: string
 *                   example: Se requieren permisos de administrador para acceder a este recurso
 */
router.get('/', adminMiddleware, getAllUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Crea un nuevo usuario en el sistema.
 *       Solo accesible para usuarios con rol 'admin'.
 *       La contraseña se hashea automáticamente antes de guardarse usando bcrypt.
 *       **Nota**: La contraseña nunca se retorna en la respuesta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email único del usuario
 *                 example: nuevo@arsysintela.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Contraseña en texto plano (mínimo 8 caracteres). Se hashea automáticamente.
 *                 example: password123
 *               name:
 *                 type: string
 *                 nullable: true
 *                 description: Nombre del usuario (opcional)
 *                 example: Nombre Usuario
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *                 description: Rol del usuario. Por defecto es 'user'.
 *                 example: user
 *           example:
 *             email: nuevo@arsysintela.com
 *             password: password123
 *             name: Nombre Usuario
 *             role: user
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 3
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: nuevo@arsysintela.com
 *                 name:
 *                   type: string
 *                   nullable: true
 *                   example: Nombre Usuario
 *                 role:
 *                   type: string
 *                   enum: [admin, user]
 *                   example: user
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-28T23:55:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-28T23:55:00.000Z"
 *             example:
 *               id: 3
 *               email: nuevo@arsysintela.com
 *               name: Nombre Usuario
 *               role: user
 *               createdAt: "2025-01-28T23:55:00.000Z"
 *               updatedAt: "2025-01-28T23:55:00.000Z"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El email es requerido
 *             examples:
 *               emailRequired:
 *                 value:
 *                   message: El email es requerido
 *               passwordShort:
 *                 value:
 *                   message: La contraseña debe tener al menos 8 caracteres
 *               emailInvalid:
 *                 value:
 *                   message: El formato del email no es válido
 *       401:
 *         description: No autorizado (token inválido o faltante)
 *       403:
 *         description: Acceso denegado (se requieren permisos de admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acceso denegado
 *                 details:
 *                   type: string
 *                   example: Se requieren permisos de administrador para acceder a este recurso
 *       409:
 *         description: El email ya está registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conflicto: el recurso ya existe
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: email
 *                       message:
 *                         type: string
 *                         example: email must be unique
 */
router.post('/', adminMiddleware, createUser);

/**
 * @swagger
 * /users/{id}/password:
 *   put:
 *     summary: Cambiar contraseña de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Permite cambiar la contraseña de un usuario.
 *       
 *       **Reglas de acceso:**
 *       - Si el usuario es **admin**: Puede cambiar la contraseña de cualquier usuario sin necesidad de proporcionar la contraseña actual.
 *       - Si el usuario es el **mismo** (cambia su propia contraseña): Debe proporcionar y validar la contraseña actual.
 *       
 *       La nueva contraseña se hashea automáticamente antes de guardarse.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario cuya contraseña se desea cambiar
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: |
 *                   Contraseña actual. 
 *                   - **Requerida** si el usuario está cambiando su propia contraseña (no admin).
 *                   - **No requerida** si el usuario es admin.
 *                 example: password_actual
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Nueva contraseña en texto plano (mínimo 8 caracteres). Se hashea automáticamente.
 *                 example: nuevaPassword123
 *           examples:
 *             usuarioPropio:
 *               summary: Usuario cambiando su propia contraseña
 *               value:
 *                 currentPassword: password_actual
 *                 newPassword: nuevaPassword123
 *             adminCambiandoOtro:
 *               summary: Admin cambiando contraseña de otro usuario
 *               value:
 *                 newPassword: nuevaPassword123
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña actualizada correctamente
 *             example:
 *               message: Contraseña actualizada correctamente
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               passwordRequired:
 *                 value:
 *                   message: La nueva contraseña es requerida
 *               passwordShort:
 *                 value:
 *                   message: La nueva contraseña debe tener al menos 8 caracteres
 *               currentPasswordRequired:
 *                 value:
 *                   message: La contraseña actual es requerida para cambiar tu propia contraseña
 *       401:
 *         description: No autorizado o contraseña actual incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               tokenInvalid:
 *                 value:
 *                   message: Token inválido o expirado
 *               currentPasswordIncorrect:
 *                 value:
 *                   message: La contraseña actual es incorrecta
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 */
router.put('/:id/password', updatePassword);

module.exports = router;


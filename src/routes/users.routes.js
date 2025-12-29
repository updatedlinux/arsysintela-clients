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
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                     format: email
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [admin, user]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (se requieren permisos de admin)
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
 *       La contraseña se hashea automáticamente antes de guardarse.
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
 *                 example: nuevo@arsysintela.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: Nombre Usuario
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *                 example: user
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
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (se requieren permisos de admin)
 *       409:
 *         description: El email ya está registrado
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
 *       - Si el usuario es admin, puede cambiar la contraseña de cualquier usuario sin necesidad de proporcionar la contraseña actual.
 *       - Si el usuario es el mismo (cambia su propia contraseña), debe proporcionar y validar la contraseña actual.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario cuya contraseña se desea cambiar
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
 *                   Contraseña actual. Requerida solo si el usuario está cambiando su propia contraseña (no admin).
 *                   No requerida si el usuario es admin.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: nuevaPassword123
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
 *       400:
 *         description: Error de validación (contraseña muy corta, falta currentPassword, etc.)
 *       401:
 *         description: No autorizado o contraseña actual incorrecta
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id/password', updatePassword);

module.exports = router;


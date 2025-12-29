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
 *     description: Retorna una lista de todos los usuarios del sistema. Solo accesible para usuarios con rol admin.
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
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
 *     description: Crea un nuevo usuario en el sistema. Solo accesible para usuarios con rol admin. La contraseña se hashea automáticamente.
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
 *     description: Permite cambiar la contraseña de un usuario. Si es admin puede cambiar cualquier contraseña sin currentPassword. Si es el mismo usuario debe proporcionar currentPassword.
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
 *                 description: Contraseña actual (requerida solo si el usuario cambia su propia contraseña)
 *                 example: password_actual
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Nueva contraseña (mínimo 8 caracteres)
 *                 example: nuevaPassword123
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado o contraseña actual incorrecta
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id/password', updatePassword);

module.exports = router;


const express = require('express');
const router = express.Router();
const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} = require('../controllers/clients.controller');

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Obtener lista de clientes
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       401:
 *         description: No autorizado
 */
router.get('/', getAllClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/:id', getClientById);

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post('/', createClient);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Actualizar cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: No autorizado
 */
router.put('/:id', updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Eliminar cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete('/:id', deleteClient);

module.exports = router;


const express = require('express');
const router = express.Router();
const {
  getClientProducts,
  addClientProduct,
  updateClientProduct,
  deleteClientProduct,
} = require('../controllers/clientProducts.controller');

/**
 * @swagger
 * /clients/{id}/products:
 *   get:
 *     summary: Obtener productos de un cliente
 *     tags: [ClientProducts]
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
 *         description: Lista de productos del cliente
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/clients/:id/products', getClientProducts);

/**
 * @swagger
 * /clients/{id}/products:
 *   post:
 *     summary: Asociar un producto a un cliente
 *     tags: [ClientProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *             properties:
 *               product_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [activo, suspendido, finalizado]
 *                 default: activo
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto asociado al cliente
 *       404:
 *         description: Cliente o producto no encontrado
 *       409:
 *         description: El producto ya está asociado
 *       401:
 *         description: No autorizado
 */
router.post('/clients/:id/products', addClientProduct);

/**
 * @swagger
 * /client-products/{id}:
 *   put:
 *     summary: Actualizar relación cliente-producto
 *     tags: [ClientProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación cliente-producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [activo, suspendido, finalizado]
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Relación actualizada
 *       404:
 *         description: Relación no encontrada
 *       401:
 *         description: No autorizado
 */
router.put('/client-products/:id', updateClientProduct);

/**
 * @swagger
 * /client-products/{id}:
 *   delete:
 *     summary: Eliminar relación cliente-producto
 *     tags: [ClientProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación cliente-producto
 *     responses:
 *       204:
 *         description: Relación eliminada
 *       404:
 *         description: Relación no encontrada
 *       401:
 *         description: No autorizado
 */
router.delete('/client-products/:id', deleteClientProduct);

module.exports = router;


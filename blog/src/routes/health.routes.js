const express = require('express');
const router = express.Router();
const { getHealth } = require('../controllers/health.controller');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Healthcheck de la API
 *     description: Verifica el estado de la API del Blog
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API en funcionamiento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-30T00:00:00.000Z"
 *                 service:
 *                   type: string
 *                   example: arsys-blog-api
 */
router.get('/', getHealth);

module.exports = router;


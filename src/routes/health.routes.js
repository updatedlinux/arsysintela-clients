const express = require('express');
const router = express.Router();
const { getHealth } = require('../controllers/health.controller');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Healthcheck de la API
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
 *                   example: "2025-01-01T00:00:00.000Z"
 */
router.get('/health', getHealth);

module.exports = router;


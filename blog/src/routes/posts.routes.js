const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/posts.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Listar posts publicados
 *     description: Obtiene una lista paginada de posts publicados. Endpoint público.
 *     tags: [Posts]
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
 *           default: 6
 *         description: Cantidad de posts por página
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filtrar posts por tag
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PostSummary'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', getAllPosts);

/**
 * @swagger
 * /posts/{slug}:
 *   get:
 *     summary: Obtener post completo por slug
 *     description: Obtiene el contenido completo de un post publicado por su slug. Endpoint público.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug del post
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post no encontrado
 */
router.get('/:slug', getPostBySlug);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crear nuevo post
 *     description: Crea un nuevo post. Requiere autenticación de administrador.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - excerpt
 *               - author
 *               - publishedAt
 *               - headerImageUrl
 *               - contentHtml
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Cómo combinar infraestructura privada e IA para tu negocio"
 *               excerpt:
 *                 type: string
 *                 example: "Descubre cómo la combinación de infraestructura privada e inteligencia artificial puede transformar tu negocio."
 *               author:
 *                 type: string
 *                 example: "Rabby Mahmud"
 *               tag:
 *                 type: string
 *                 example: "Infraestructura"
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-30T00:00:00Z"
 *               headerImageUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://placehold.co/800x400"
 *               contentHtml:
 *                 type: string
 *                 example: "<h2>Introducción</h2><p>Contenido del post...</p>"
 *               isPublished:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Post creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (requiere admin)
 */
router.post('/', authMiddleware, adminMiddleware, createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Actualizar post
 *     description: Actualiza un post existente. Requiere autenticación de administrador.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               author:
 *                 type: string
 *               tag:
 *                 type: string
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *               headerImageUrl:
 *                 type: string
 *                 format: uri
 *               contentHtml:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Post actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (requiere admin)
 */
router.put('/:id', authMiddleware, adminMiddleware, updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Eliminar post
 *     description: Elimina un post. Requiere autenticación de administrador.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Post eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post eliminado correctamente"
 *                 id:
 *                   type: integer
 *       404:
 *         description: Post no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (requiere admin)
 */
router.delete('/:id', authMiddleware, adminMiddleware, deletePost);

module.exports = router;


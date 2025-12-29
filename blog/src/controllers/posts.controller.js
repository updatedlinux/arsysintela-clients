const { Post } = require('../models');
const logger = require('../logger/logger');

// Función auxiliar para generar slug desde el título
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales por guiones
    .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final
};

// Función para generar slug único
const generateUniqueSlug = async (title, excludeId = null) => {
  const { Op } = require('sequelize');
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const whereClause = { slug };
    if (excludeId) {
      whereClause.id = { [Op.ne]: excludeId };
    }

    const existing = await Post.findOne({ where: whereClause });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// GET /api/posts - Listar posts (público)
const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const tag = req.query.tag || null;
    const offset = (page - 1) * limit;

    const where = {
      isPublished: true,
    };

    if (tag) {
      where.tag = tag;
    }

    const { count, rows } = await Post.findAndCountAll({
      where,
      limit,
      offset,
      order: [['publishedAt', 'DESC']],
      attributes: [
        'id',
        'title',
        'slug',
        'excerpt',
        'author',
        'tag',
        'publishedAt',
        'headerImageUrl',
      ],
    });

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Error al obtener posts:', error);
    next(error);
  }
};

// GET /api/posts/:slug - Obtener post completo por slug (público)
const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: 'Post no encontrado',
        details: `No se encontró un post publicado con el slug: ${slug}`,
      });
    }

    res.json(post);
  } catch (error) {
    logger.error('Error al obtener post por slug:', error);
    next(error);
  }
};

// POST /api/posts - Crear post (admin)
const createPost = async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      author,
      tag,
      publishedAt,
      headerImageUrl,
      contentHtml,
      isPublished = true,
    } = req.body;

    // Validaciones básicas
    if (!title || !excerpt || !author || !publishedAt || !headerImageUrl || !contentHtml) {
      return res.status(400).json({
        message: 'Campos requeridos faltantes',
        details: 'title, excerpt, author, publishedAt, headerImageUrl y contentHtml son requeridos',
      });
    }

    // Generar slug único
    const slug = await generateUniqueSlug(title);

    const post = await Post.create({
      title,
      slug,
      excerpt,
      author,
      tag: tag || null,
      publishedAt: new Date(publishedAt),
      headerImageUrl,
      contentHtml,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    logger.info(`Post creado: ${post.id} - ${post.title} por usuario ${req.user.id}`);

    res.status(201).json(post);
  } catch (error) {
    logger.error('Error al crear post:', error);
    next(error);
  }
};

// PUT /api/posts/:id - Actualizar post (admin)
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      author,
      tag,
      publishedAt,
      headerImageUrl,
      contentHtml,
      isPublished,
    } = req.body;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        message: 'Post no encontrado',
        details: `No se encontró un post con el ID: ${id}`,
      });
    }

    // Si cambió el título, actualizar el slug
    let slug = post.slug;
    if (title && title !== post.title) {
      slug = await generateUniqueSlug(title, id);
    }

    // Actualizar campos
    await post.update({
      ...(title && { title }),
      ...(slug !== post.slug && { slug }),
      ...(excerpt !== undefined && { excerpt }),
      ...(author !== undefined && { author }),
      ...(tag !== undefined && { tag }),
      ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      ...(headerImageUrl !== undefined && { headerImageUrl }),
      ...(contentHtml !== undefined && { contentHtml }),
      ...(isPublished !== undefined && { isPublished }),
    });

    await post.reload();

    logger.info(`Post actualizado: ${post.id} - ${post.title} por usuario ${req.user.id}`);

    res.json(post);
  } catch (error) {
    logger.error('Error al actualizar post:', error);
    next(error);
  }
};

// DELETE /api/posts/:id - Eliminar post (admin)
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        message: 'Post no encontrado',
        details: `No se encontró un post con el ID: ${id}`,
      });
    }

    await post.destroy();

    logger.info(`Post eliminado: ${post.id} - ${post.title} por usuario ${req.user.id}`);

    res.json({
      message: 'Post eliminado correctamente',
      id: parseInt(id, 10),
    });
  } catch (error) {
    logger.error('Error al eliminar post:', error);
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
};


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  tag: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  headerImageUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true,
      isUrl: true,
    },
  },
  contentHtml: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'posts',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['slug'],
    },
    {
      fields: ['published_at'],
    },
    {
      fields: ['tag'],
    },
    {
      fields: ['is_published'],
    },
  ],
});

module.exports = Post;


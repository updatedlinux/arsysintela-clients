require('dotenv').config();
const { sequelize, initDB } = require('../config/db');
const { Post } = require('../models');
const logger = require('../logger/logger');

// Función para generar slug desde el título
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const seedPosts = async () => {
  try {
    logger.info('🌱 Iniciando seed de posts...');

    // Conectar a la base de datos
    await initDB();

    // Posts de ejemplo basados en la maqueta
    const postsData = [
      {
        title: 'Cómo combinar infraestructura privada e IA para tu negocio',
        slug: generateSlug('Cómo combinar infraestructura privada e IA para tu negocio'),
        excerpt: 'Descubre cómo la combinación de infraestructura privada e inteligencia artificial puede transformar tu negocio, mejorando la eficiencia y reduciendo costos operativos.',
        author: 'Rabby Mahmud',
        tag: 'Infraestructura',
        publishedAt: new Date('2025-01-15T10:00:00Z'),
        headerImageUrl: 'https://placehold.co/800x400/0066CC/FFFFFF?text=Infraestructura+Privada+e+IA',
        contentHtml: `
          <h2>Introducción</h2>
          <p>En el mundo empresarial actual, la combinación de infraestructura privada e inteligencia artificial se ha convertido en una estrategia clave para mejorar la eficiencia operativa y reducir costos.</p>
          
          <h2>Beneficios de la Infraestructura Privada</h2>
          <p>La infraestructura privada ofrece control total sobre los recursos, mayor seguridad y cumplimiento normativo. Cuando se combina con IA, las posibilidades se multiplican.</p>
          
          <h2>Aplicaciones Prácticas</h2>
          <ul>
            <li>Automatización de procesos empresariales</li>
            <li>Análisis predictivo de datos</li>
            <li>Optimización de recursos en tiempo real</li>
            <li>Mejora en la toma de decisiones</li>
          </ul>
          
          <h2>Conclusión</h2>
          <p>La integración de infraestructura privada con IA no es solo una tendencia, es el futuro de las empresas modernas que buscan mantenerse competitivas en el mercado.</p>
        `,
        isPublished: true,
      },
      {
        title: 'Automatización de condominios y edificios con Intela Smart',
        slug: generateSlug('Automatización de condominios y edificios con Intela Smart'),
        excerpt: 'Intela Smart revoluciona la gestión de condominios y edificios mediante automatización inteligente, mejorando la calidad de vida de los residentes y optimizando la administración.',
        author: 'María González',
        tag: 'Condominio',
        publishedAt: new Date('2025-01-20T14:30:00Z'),
        headerImageUrl: 'https://placehold.co/800x400/00AA44/FFFFFF?text=Intela+Smart+Condominios',
        contentHtml: `
          <h2>¿Qué es Intela Smart?</h2>
          <p>Intela Smart es una solución integral de automatización diseñada específicamente para condominios y edificios residenciales, ofreciendo control centralizado de múltiples sistemas.</p>
          
          <h2>Características Principales</h2>
          <ul>
            <li>Gestión inteligente de accesos y seguridad</li>
            <li>Control de iluminación y climatización</li>
            <li>Monitoreo de consumo energético</li>
            <li>Comunicación entre residentes y administración</li>
          </ul>
          
          <h2>Ventajas para los Residentes</h2>
          <p>Los residentes disfrutan de mayor comodidad, seguridad mejorada y control sobre su entorno mediante una aplicación móvil intuitiva.</p>
          
          <h2>Beneficios para la Administración</h2>
          <p>La administración del condominio puede optimizar recursos, reducir costos operativos y mejorar la comunicación con los residentes.</p>
          
          <h2>Casos de Éxito</h2>
          <p>Múltiples edificios ya han implementado Intela Smart, reportando reducciones del 30% en costos energéticos y mejoras significativas en la satisfacción de los residentes.</p>
        `,
        isPublished: true,
      },
      {
        title: 'Inteligencia Artificial en la Gestión de Infraestructura',
        slug: generateSlug('Inteligencia Artificial en la Gestión de Infraestructura'),
        excerpt: 'Explora cómo la IA está transformando la gestión de infraestructura empresarial, desde mantenimiento predictivo hasta optimización de recursos.',
        author: 'Carlos Rodríguez',
        tag: 'IA',
        publishedAt: new Date('2025-01-25T09:15:00Z'),
        headerImageUrl: 'https://placehold.co/800x400/FF6600/FFFFFF?text=IA+en+Infraestructura',
        contentHtml: `
          <h2>El Futuro de la Gestión de Infraestructura</h2>
          <p>La inteligencia artificial está revolucionando la forma en que las empresas gestionan su infraestructura, ofreciendo insights valiosos y automatización inteligente.</p>
          
          <h2>Mantenimiento Predictivo</h2>
          <p>La IA puede predecir fallos antes de que ocurran, permitiendo mantenimiento proactivo que reduce tiempos de inactividad y costos de reparación.</p>
          
          <h2>Optimización de Recursos</h2>
          <p>Mediante análisis avanzado, la IA optimiza el uso de recursos, reduciendo desperdicios y mejorando la eficiencia operativa.</p>
          
          <h2>Análisis de Datos en Tiempo Real</h2>
          <p>Los sistemas de IA procesan grandes volúmenes de datos en tiempo real, proporcionando información accionable para la toma de decisiones.</p>
          
          <h2>Implementación Práctica</h2>
          <p>Las empresas que implementan soluciones de IA en su infraestructura reportan mejoras significativas en productividad y reducción de costos operativos.</p>
        `,
        isPublished: true,
      },
      {
        title: 'Seguridad en Infraestructura Cloud Híbrida',
        slug: generateSlug('Seguridad en Infraestructura Cloud Híbrida'),
        excerpt: 'Guía completa sobre cómo implementar medidas de seguridad robustas en entornos de infraestructura cloud híbrida, protegiendo datos críticos y cumpliendo normativas.',
        author: 'Ana Martínez',
        tag: 'Infraestructura',
        publishedAt: new Date('2025-01-28T16:45:00Z'),
        headerImageUrl: 'https://placehold.co/800x400/9900CC/FFFFFF?text=Seguridad+Cloud+Hibrida',
        contentHtml: `
          <h2>Desafíos de Seguridad en Cloud Híbrida</h2>
          <p>La infraestructura cloud híbrida presenta desafíos únicos de seguridad que requieren estrategias específicas y herramientas especializadas.</p>
          
          <h2>Mejores Prácticas</h2>
          <ul>
            <li>Encriptación de datos en tránsito y en reposo</li>
            <li>Gestión centralizada de identidades y accesos</li>
            <li>Monitoreo continuo y detección de amenazas</li>
            <li>Cumplimiento normativo y auditorías regulares</li>
          </ul>
          
          <h2>Herramientas y Tecnologías</h2>
          <p>Existen diversas herramientas que facilitan la implementación de seguridad en entornos híbridos, desde firewalls avanzados hasta sistemas de gestión de identidades.</p>
          
          <h2>Estrategia de Implementación</h2>
          <p>Una estrategia exitosa requiere planificación cuidadosa, evaluación de riesgos y implementación gradual de controles de seguridad.</p>
          
          <h2>Conclusión</h2>
          <p>La seguridad en infraestructura cloud híbrida es un proceso continuo que requiere atención constante y actualización de estrategias según evolucionan las amenazas.</p>
        `,
        isPublished: true,
      },
      {
        title: 'Optimización Energética en Edificios Inteligentes',
        slug: generateSlug('Optimización Energética en Edificios Inteligentes'),
        excerpt: 'Descubre cómo los edificios inteligentes utilizan tecnología avanzada para optimizar el consumo energético, reduciendo costos y minimizando el impacto ambiental.',
        author: 'Luis Fernández',
        tag: 'Condominio',
        publishedAt: new Date('2025-01-29T11:20:00Z'),
        headerImageUrl: 'https://placehold.co/800x400/0099FF/FFFFFF?text=Edificios+Inteligentes',
        contentHtml: `
          <h2>Edificios Inteligentes y Eficiencia Energética</h2>
          <p>Los edificios inteligentes representan el futuro de la construcción, combinando tecnología avanzada con sostenibilidad para crear espacios más eficientes y cómodos.</p>
          
          <h2>Sistemas de Gestión Energética</h2>
          <p>Los sistemas inteligentes monitorean y optimizan el consumo energético en tiempo real, ajustando automáticamente iluminación, climatización y otros sistemas según la ocupación y condiciones ambientales.</p>
          
          <h2>Beneficios Ambientales</h2>
          <p>La optimización energética no solo reduce costos, sino que también contribuye significativamente a la reducción de emisiones de carbono y al cumplimiento de objetivos de sostenibilidad.</p>
          
          <h2>Retorno de Inversión</h2>
          <p>Las inversiones en tecnología de optimización energética suelen recuperarse en plazos razonables gracias a los ahorros generados en costos operativos.</p>
          
          <h2>Implementación Práctica</h2>
          <p>La implementación exitosa requiere una planificación cuidadosa, selección adecuada de tecnologías y capacitación del personal de mantenimiento.</p>
        `,
        isPublished: true,
      },
      {
        title: 'Machine Learning para Análisis Predictivo en Infraestructura',
        slug: generateSlug('Machine Learning para Análisis Predictivo en Infraestructura'),
        excerpt: 'Aprende cómo el machine learning está transformando el análisis predictivo en infraestructura, permitiendo anticipar problemas y optimizar operaciones.',
        author: 'Rabby Mahmud',
        tag: 'IA',
        publishedAt: new Date('2025-01-30T08:00:00Z'),
        headerImageUrl: 'https://placehold.co/800x400/CC0000/FFFFFF?text=Machine+Learning',
        contentHtml: `
          <h2>Machine Learning en Infraestructura</h2>
          <p>El machine learning está revolucionando la forma en que analizamos y gestionamos infraestructura, proporcionando insights predictivos que antes eran imposibles de obtener.</p>
          
          <h2>Modelos Predictivos</h2>
          <p>Los modelos de machine learning pueden analizar patrones históricos y datos en tiempo real para predecir fallos, optimizar mantenimiento y mejorar la eficiencia operativa.</p>
          
          <h2>Aplicaciones Prácticas</h2>
          <ul>
            <li>Predicción de fallos en equipos críticos</li>
            <li>Optimización de rutas de mantenimiento</li>
            <li>Análisis de patrones de uso y demanda</li>
            <li>Detección temprana de anomalías</li>
          </ul>
          
          <h2>Implementación y Desafíos</h2>
          <p>La implementación exitosa requiere datos de calidad, modelos bien entrenados y personal capacitado para interpretar y actuar sobre las predicciones.</p>
          
          <h2>Futuro del ML en Infraestructura</h2>
          <p>El futuro promete modelos aún más avanzados, integración con IoT y automatización completa de procesos de mantenimiento y optimización.</p>
        `,
        isPublished: true,
      },
    ];

    // Verificar si ya existen posts
    const existingPosts = await Post.count();
    if (existingPosts > 0) {
      logger.warn(`⚠ Ya existen ${existingPosts} posts en la base de datos.`);
      logger.info('💡 Si deseas recrear los posts, elimina los existentes primero.');
      return;
    }

    // Crear posts
    for (const postData of postsData) {
      await Post.create(postData);
      logger.info(`✓ Post creado: "${postData.title}"`);
    }

    logger.info(`\n✅ Seed completado: ${postsData.length} posts creados exitosamente.`);
  } catch (error) {
    logger.error('✗ Error durante el seed:', error);
    throw error;
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

// Ejecutar seed
seedPosts();


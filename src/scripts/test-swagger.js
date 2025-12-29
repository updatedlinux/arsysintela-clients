const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');

const routesDir = path.join(__dirname, '../routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

console.log('Archivos encontrados en routes/:', files);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test',
      version: '1.0.0',
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
  ],
};

try {
  const spec = swaggerJsdoc(options);
  console.log('\nPaths detectados por Swagger:');
  if (spec.paths) {
    Object.keys(spec.paths).forEach(path => {
      console.log(`  - ${path}`);
      Object.keys(spec.paths[path]).forEach(method => {
        const endpoint = spec.paths[path][method];
        console.log(`    ${method.toUpperCase()}: ${endpoint.summary || 'Sin resumen'}`);
        if (endpoint.tags) {
          console.log(`      Tags: ${endpoint.tags.join(', ')}`);
        }
      });
    });
  } else {
    console.log('  No se encontraron paths');
  }
  
  console.log('\nTags encontrados:');
  if (spec.tags) {
    spec.tags.forEach(tag => {
      console.log(`  - ${tag.name}`);
    });
  }
} catch (e) {
  console.error('Error:', e.message);
  console.error(e.stack);
}


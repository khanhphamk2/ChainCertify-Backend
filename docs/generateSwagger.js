const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const swaggerDefinition = require('./swaggerDef');

const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ['./docs/*.yml', './routes/*.js'],
});

fs.writeFileSync('./docs/swagger.json', JSON.stringify(specs, null, 2), 'utf-8');

console.log('Swagger JSON file generated successfully.');
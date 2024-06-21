const { version } = require('../package.json');
const config = require("../config/config");

const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'API documentation',
        version,
        license: {
            name: 'MIT',
            url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
        },
        description: 'Documentation for RESTful API',
    },
    servers: [
        {
            url: `http://localhost:${config.port}/v1`,
            description: 'Development server',
        },
    ],
};

module.exports = swaggerDef;
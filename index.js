const mongoose = require('mongoose');
const http = require('http');
const { start, apiRoute } = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;

mongoose.connect(config.mongoose.url).then(async () => {
    try {
        logger.info('Connected to MongoDB');
        logger.info('Starting server...');
        const app = start();
        const httpServer = http.createServer(app);

        apiRoute(app);

        server = httpServer.listen(config.port, () => {
            logger.info(`Listening to port ${config.port}`);
        });

        if (config.env == 'development') {
            logger.info(`Developmet Mode: API docs available at http://localhost:${config.port}/v1/api-docs`);
        }
    } catch (error) {
        logger.error(error.message);
    }
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
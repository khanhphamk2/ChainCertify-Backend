/* eslint-disable no-console */
const express = require('express');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const config = require('./config/config');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const start = function () {
    const app = express();

    // Use helmet for security headers
    app.use(helmet());

    // Parse JSON and URL-encoded data with size limits
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    // Protect against XSS attacks
    app.use(xss());

    // Sanitize data
    app.use(mongoSanitize());

    // Enable CORS
    app.use(cors());
    app.options('*', cors());

    // Apply rate limiter to authentication routes in production
    if (config.env === 'production') {
        app.use('/v1/auth', authLimiter);
    }

    return app;
};


const apiRoute = function (app) {
    // Use next() to skip to the next middleware
    app.use((_, res, next) => {
        next();
    });

    // Mount the routes at /v1
    app.use('/v1', routes);

    // Catch 404 errors and forward to error handler
    app.use((req, res, next) => {
        next(new ApiError(404, 'Not found'));
    });

    // Convert errors to ApiError, if needed
    app.use(errorConverter);

    // Handle errors
    app.use(errorHandler);
};

module.exports = {
    start,
    apiRoute,
};

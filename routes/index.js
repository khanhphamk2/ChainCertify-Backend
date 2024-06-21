const express = require('express');
const docsRoute = require('./docs.route');
const config = require('../config/config');
const issuerRoute = require('./issuer.route');
const holderRoute = require('./holder.route');
const credentialRoute = require('./credential.route');
// const ipfsRoute = require('./ipfs.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/issuer',
        route: issuerRoute,
    },
    {
        path: '/holder',
        route: holderRoute,
    },
    {
        path: '/credential',
        route: credentialRoute,
    },
    // {
    //     path: '/ipfs',
    //     route: ipfsRoute,
    // },
    // {
    //     path: '/auth',
    //     route: authRoute,
    // }
];

const devRoutes = [
    // routes available only in development mode
    {
        path: '/api-docs',
        route: docsRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}

module.exports = router;
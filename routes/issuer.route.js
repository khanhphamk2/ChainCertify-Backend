const express = require('express');
const issuerController = require('../controllers/issuer.controllder');

const router = express.Router();

router
    .route('/')
    .post(issuerController.addIssuer)
    .get(issuerController.getIssuers);
// router.route('/').put(issuerController.revokeIssuer);
// router.route('/').delete(issuerController.deleteIssuer);

// router.route('/requestIssue/').get(issuerController.getListRequestIssue);
// router
//     .route('/requestIssue/:address')
//     .get(issuerController.getRequestIssue)
//     .put(issuerController.approveRequestIssue)
//     .delete(issuerController.rejectRequestIssue);

// router.route('/requestRevoke/:address').get(issuerController.getListRequestRevoke);
// router.route('/requestRevoke/').get(issuerController.getListRequestRevoke);

module.exports = router;

// Swagger documentation for the issuer route

/**
 * @swagger
 * tags:
 *   name: Issuer
 *   description: Issuer management
 */

/**
 * @swagger
 * /issuer:
 *   post:
 *     summary: Add an issuer.
 *     description: Add an issuer.
 *     tags: [Issuer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - msgSender
 *               - address
 *             properties:
 *               msgSender:
 *                 type: string
 *                 description: The message sender (address of the issuer)
 *               address:
 *                 type: string
 *                 description: The holder's address
 *     responses:
 *       200:
 *         description: Issuer added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message confirming the addition of the issuer.
 *                 new_issuer:
 *                   type: string
 *                   description: The address of the new issuer.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   get:
 *     summary: Get all Ethereum addresses of issuers
 *     description: Retrieve a list of all Ethereum addresses of issuers.
 *     tags: [Issuer]
 *     responses:
 *       200:
 *         description: Successfully retrieved Ethereum addresses of issuers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: An Ethereum address
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
const express = require('express');
const holderController = require('../controllers/holder.controller');

const router = express.Router();

router
    .route('/')
    .get(holderController.getListCredentials);


router
    .route('/{hash}')
    .get(holderController.getCredential)
    .post(holderController.modifyCredential);

module.exports = router;

// Swagger documentation for the holder route

/**
 * @swagger
 * tags:
 *   name: Holder
 *   description: Holder management
 */

/**
 * @swagger
 * /holders:
 *   get:
 *     summary: Get holder's credentials
 *     description: Retrieve the credentials of the holder.
 *     tags: [Holder]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_issuer
 *               - holder_address
 *             properties:
 *               address_issuer:
 *                 type: string
 *                 description: Address wallet of the issuer
 *               holder_address:
 *                 type: string
 *                 description: Address wallet of the holder
 *     responses:
 *       "200":
 *         description: All credentials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 $ref: '#/components/schemas/Certificate'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */


/**
 * @swagger
 * /holders/{hash}:
 *   get:
 *     summary: Get holder's credentials by hash
 *     description: Retrieve the credentials of the holder by hash.
 *     tags: [Holder]
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: The hash of the credential
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_issuer
 *               - holder_address
 *             properties:
 *               address_issuer:
 *                 type: string
 *                 description: Address wallet of the issuer
 *               holder_address:
 *                 type: string
 *                 description: Address wallet of the holder
 *     responses:
 *       200:
 *         description: Holder's credentials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Certificate'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   post:
 *     summary: Request to modify credential
 *     description: Request to modify a credential by the holder.
 *     tags: [Holder]
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: The hash of the credential
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_issuer
 *               - holder_address
 *               - modifications
 *             properties:
 *               address_issuer:
 *                 type: string
 *                 description: Address wallet of the issuer
 *               holder_address:
 *                 type: string
 *                 description: Address wallet of the holder
 *               modifications:
 *                 type: object
 *                 description: Object containing modification details
 *                 properties:
 *                   holder_name:
 *                      type: string
 *                      description: Name of the holder
 *                   dob:
 *                      type: string
 *                      format: date
 *                      description: Date of birth of the holder
 *                   identity_number:
 *                      type: string
 *                      description: Identity number of the holder
 *                   score:
 *                      type: number
 *                      description: Score of the holder
 *     responses:
 *       200:
 *         description: Modification request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message confirming the modification request.
 *                 modifications:
 *                   type: object
 *                   description: Object containing modification details
 *                   properties:
 *                     holder_name:
 *                        type: string
 *                        description: Name of the holder
 *                     dob:
 *                        type: string
 *                        format: date
 *                        description: Date of birth of the holder
 *                     identity_number:
 *                        type: string
 *                        description: Identity number of the holder
 *                     score:
 *                        type: number
 *                        description: Score of the holder
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
const express = require('express');
const credentialController = require('../controllers/credential.controller');
const upload = require('../middlewares/upload');

const router = express.Router();

router
    .route('/address')
    // .post(upload.single('pdfFile'), credentialController.issueCredential)
    .post(credentialController.issueCredential)
    .get(credentialController.getCredentialsByHolderAddress);

router.route('/address/:hash')
    .get(credentialController.getCredentialByHash)
    .put(credentialController.revokeCredential);

// router.route('/address/verify').post(credentialController.verifyCredential);
module.exports = router;

// Swagger documentation for the credential route

/**
 * @swagger
 * tags:
 *   name: Certificate
 *   description: Certificate management
 */

/**
 * @swagger
 * /credential/address:
 *   post:
 *     summary: Create a new credential
 *     description: Create a new credential for a holder.
 *     tags: [Certificate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_issuer
 *               - holder_name
 *               - dob
 *               - identity_number
 *               - holder_address
 *               - score
 *               - note
 *             properties:
 *               address_issuer:
 *                 type: string
 *                 description: Address wallet of the issuer
 *               holder_name:
 *                 type: string
 *                 description: Name of the holder
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the holder
 *               identity_number:
 *                 type: string
 *                 description: Identity number of the holder
 *               holder_address:
 *                 type: string
 *                 description: Address wallet of the holder
 *               score:
 *                 type: number
 *                 description: Score of the holder
 *               note:
 *                 type: string
 *                 description: Note of the holder
 *     responses:
 *       "201":
 *        description: Credential created successfully
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           $ref: '#/components/schemas/Certificate'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   get:
 *     summary: Get all credentials for a Holder
 *     description: Retrieve all credentials.
 *     tags: [Certificate]
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
 * /credential/address/{hash}:
 *   get:
 *     summary: Get credential by hash value for a holder address
 *     description: Retrieve a credential for a specific holder based on their address and hash value.
 *     tags: [Certificate]
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: The hash of the credential to get for holder address
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
 *         description: Credentials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Certificate'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Revoke a credential by hash
 *     description: Revoke an existing credential using its hash.
 *     tags: [Certificate]
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: The hash of the credential to revoke
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_issuer
 *               - holder_address
 *               - note
 *             properties:
 *               address_issuer:
 *                 type: string
 *                 description: Address wallet of the issuer
 *               holder_address:
 *                 type: string
 *                 description: Address wallet of the holder
 *               note:
 *                 type: string
 *                 description: The reason for revoking the credential
 *     responses:
 *       200:
 *         description: Credential revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Credential revoked successfully
 *                 hash:
 *                   type: string
 *                   description: The hash of the revoked credential
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
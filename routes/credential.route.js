const express = require('express');
const credentialController = require('../controllers/credential.controller');
const upload = require('../middlewares/upload');

const router = express.Router();

router.route('/address').post(upload.single('pdfFile'), credentialController.issueCredential)

router.route('/:address').get(credentialController.getCredentialsByHolderAddress);


router
    .route('/address/:hash')
    .put(credentialController.revokeCredential)
    .get(credentialController.getCredentialByHash);

// router.route('/address/verify').post(credentialController.verifyCredential);
module.exports = router;

// Swagger documentation for the credential route

/**
 * @swagger
 * /address:
 *   post:
 *     summary: Issue a new credential
 *     description: Issue a new credential and store the certificate on IPFS and blockchain.
 *     tags: [Certificate]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - jsonData
 *               - pdfFile
 *             properties:
 *               jsonData:
 *                 type: string
 *                 description: JSON string containing the credential data
 *                 example: '{"name":"John Doe","identityNumber":"123456789","institution":"University of Blockchain","type":"Diploma","score":95,"note":"Top of the class","expireDate":"2025-12-31","holder":"0x123456789abcdef","issuer":"0xabcdef123456789"}'
 *                 schema:
 *                   type: object
 *                   required:
 *                     - name
 *                     - identityNumber
 *                     - institution
 *                     - type
 *                     - score
 *                     - note
 *                     - expireDate
 *                     - holder
 *                     - issuer
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the holder
 *                     identityNumber:
 *                       type: string
 *                       description: Identity number of the holder
 *                     institution:
 *                       type: string
 *                       description: Institution issuing the credential
 *                     type:
 *                       type: string
 *                       description: Type of the credential
 *                     score:
 *                       type: number
 *                       description: Score of the holder
 *                     note:
 *                       type: string
 *                       description: Note of the holder
 *                     expireDate:
 *                       type: string
 *                       format: date
 *                       description: Expiration date of the credential
 *                     holder:
 *                       type: string
 *                       description: Address wallet of the holder
 *                     issuer:
 *                       type: string
 *                       description: Address wallet of the issuer
 *               pdfFile:
 *                 type: string
 *                 format: binary
 *                 description: PDF file of the credential
 *     responses:
 *       201:
 *         description: Credential issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Credential issued successfully
 *                 certificateHash:
 *                   type: string
 *                   description: The hash of the issued certificate
 *                 ipfs:
 *                   type: string
 *                   description: The IPFS reference for the certificate
 *                 credential:
 *                   type: object
 *                   properties:
 *                     holder:
 *                       type: string
 *                       description: The holder's address
 *                     expireDate:
 *                       type: string
 *                       description: The expiration date of the credential
 *                 transactionHash:
 *                   type: string
 *                   description: The hash of the blockchain transaction
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /{address}:
 *   get:
 *     summary: Get credentials by holder address
 *     description: Retrieve all credentials associated with a specific holder address.
 *     tags: [Certificate]
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: The holder's address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               msgSender:
 *                 type: string
 *                 description: Address wallet of the sender
 *     responses:
 *       200:
 *         description: A list of credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       holder:
 *                         type: string
 *                       issuer:
 *                         type: string
 *                       ipfsHash:
 *                         type: string
 *                       issueDate:
 *                         type: string
 *                         format: date-time
 *                       note:
 *                         type: string
 *                       isRevoked:
 *                         type: boolean
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /address/{hash}:
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
 *               - holder
 *               - msgSender
 *             properties:
 *               holder:
 *                 type: string
 *                 description: Address wallet of the holder
 *               msgSender:
 *                 type: string
 *                 description: Address wallet of the sender
 *     responses:
 *       200:
 *         description: Credential retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 holder:
 *                   type: string
 *                 issuer:
 *                   type: string
 *                 ipfsHash:
 *                   type: string
 *                 issueDate:
 *                   type: string
 *                   format: date-time
 *                 note:
 *                   type: string
 *                 isRevoked:
 *                   type: boolean
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /address/{hash}:
 *   put:
 *     summary: Revoke a credential by hash
 *     description: Revoke an existing credential using its hash.
 *     tags: [Certificate]
 *     parameters:
 *       - in: query
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
 *               holder:
 *                 type: string
 *                 description: Address wallet of the issuer
 *               reason:
 *                 type: string
 *                 description: The reason for revoking the credential
 *               issuer:
 *                 type: string
 *                 description: The address of the sender
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
 *                 isRevoked:
 *                   type: boolean
 *                   description: Indicates if the credential was successfully revoked
 *                 result:
 *                   type: object
 *                   description: The transaction receipt
 *                   properties:
 *                     transactionHash:
 *                       type: string
 *                       description: The hash of the transaction
 *                     status:
 *                       type: boolean
 *                       description: The status of the transaction
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

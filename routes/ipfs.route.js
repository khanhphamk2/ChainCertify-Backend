const express = require('express');
const ipfsController = require('../controllers/ipfs.controller');

const router = express.Router();

router.route('/').post(ipfsController.addFile);
router.route('/').get(ipfsController.getFile);
router.route('/').delete(ipfsController.deleteFile);

module.exports = router;
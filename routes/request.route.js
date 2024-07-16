const express = require('express');
const upload = require('../middlewares/upload');
const { requestController } = require('../controllers');

const router = express.Router();

router
    .route('/issue')
    .post(upload.single('pdfFile'), requestController.addRequestIssue)
    .get(requestController.getListRequestIssue);
router.route('/issue/:id').get(requestController.getRequestIssue);
router.route('/issue/approve/:id').put(requestController.approveRequestIssue);
router.route('/issue/reject/:id').put(requestController.rejectRequestIssue);

router
    .route('/revoke')
    .post(requestController.addRequestRevoke)
    .get(requestController.getListRequestRevoke);
router.route('/revoke/:id').get(requestController.getRequestRevoke);
router.route('/revoke/approve/:id').put(requestController.approveRequestRevoke);
router.route('/revoke/reject/:id').put(requestController.rejectRequestRevoke);

module.exports = router;
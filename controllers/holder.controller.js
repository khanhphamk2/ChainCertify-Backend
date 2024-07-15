const { holderService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');

const requestIssueCredential = catchAsync(async (req, res) => {
    holderService.requestIssueCredential(req.body);
    res.status(httpStatus.CREATED).send('Request saved successfully');
});

const requestRevokeCredential = catchAsync(async (req, res) => {
    holderService.requestRevokeCredential(req.body);
    res.status(httpStatus.CREATED).send('Request saved successfully');
});

module.exports = {
    requestIssueCredential,
    requestRevokeCredential
};
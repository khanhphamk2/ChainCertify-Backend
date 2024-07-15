const { holderService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');

const requestIssueCredential = catchAsync(async (req, res) => {
    const data = JSON.parse(req.body.jsonData);
    const request = holderService.requestIssueCredential(data, req.file);
    res.status(httpStatus.CREATED).send({ message: 'Request saved successfully', request: request });
});

const requestRevokeCredential = catchAsync(async (req, res) => {
    const result = holderService.requestRevokeCredential(req.body);
    res.status(httpStatus.CREATED).send({ message: 'Request saved successfully', request: result });
});

module.exports = {
    requestIssueCredential,
    requestRevokeCredential
};
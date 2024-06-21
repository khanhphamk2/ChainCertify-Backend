const holderService = require('../services/holder.service');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');

const getCredentials = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['holderId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await holderService.queryCredentials(filter, options);
    res.send(result);
});

const requestModifyCredential = catchAsync(async (req, res) => {
    const credential = await holderService.requestModifyCredential(req.body);
    res.send(credential);
});

const getCredentialsByHash = catchAsync(async (req, res) => {
    const credentials = await holderService.getCredentialsByHash(req.query.hash);
    res.send(credentials);
});

module.exports = {
    getCredentials,
    requestModifyCredential,
    getCredentialsByHash
};
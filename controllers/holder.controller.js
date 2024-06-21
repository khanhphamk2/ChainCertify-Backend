const { holderService } = require('../services');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');

const getListCredentials = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['holderId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await holderService.queryCredentials(filter, options);
    res.send(result);
});

const getCredential = catchAsync(async (req, res) => {
    const credential = await holderService.getCredentialById(req.params.credentialId);
    if (!credential) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Credential not found');
    }
    res.send(credential);
});

const modifyCredential = catchAsync(async (req, res) => {
    const credential = await holderService.modifyCredential(req.body);
    res.send(credential);
});

module.exports = {
    getListCredentials,
    getCredential,
    modifyCredential
};
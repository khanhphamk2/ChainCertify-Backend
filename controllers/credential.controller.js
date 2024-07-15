const { credentialService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const issueCredential = catchAsync(async (req, res) => {
    const jsonData = JSON.parse(req.body.jsonData);
    const cert = await credentialService.issueCredential(jsonData, req.file);
    res.status(httpStatus.CREATED).json({ certificate: cert });
});

const getCredentialsByHolderAddress = catchAsync(async (req, res) => {
    const result = await credentialService.getCredentialsByHolderAddress(req.params.address.toString());
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Credential not found');
    }
    res.send(result);
});

const getCredentialByHash = catchAsync(async (req, res) => {
    const credential = await credentialService.getCredentialByHash(req.body, req.params.hash.toString());
    if (!credential) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Credential not found');
    }
    res.send(credential);
});

const revokeCredential = catchAsync(async (req, res) => {
    const result = await credentialService.revokeCredential(req.body, req.params.hash.toString());
    res.status(httpStatus.OK).send(result);
});


module.exports = {
    issueCredential,
    getCredentialByHash,
    getCredentialsByHolderAddress,
    revokeCredential,
};
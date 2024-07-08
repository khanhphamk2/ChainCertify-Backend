const { credentialService } = require('../services');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');

const issueCredential = catchAsync(async (req, res) => {
    const jsonData = JSON.parse(req.body.jsonData);
    const pdfFile = req.file;
    const credential = await credentialService.issueCredential(jsonData, pdfFile);
    res.status(httpStatus.CREATED).send(credential);
});


const getCredentialsByHolderAddress = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['holderId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await credentialService.queryCredentials(filter, options);
    res.send(result);
});

const getCredentialByHash = catchAsync(async (req, res) => {
    const credential = await credentialService.getCredentialByHash(req.body.holder, req.body.credentialHash);
    if (!credential) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Credential not found');
    }
    res.send(credential);
});

const revokeCredential = catchAsync(async (req, res) => {
    await credentialService.revokeCredential(req.body);
    res.status(httpStatus.OK).send("Successfully revoked");
});

module.exports = {
    issueCredential,
    getCredentialByHash,
    getCredentialsByHolderAddress,
    revokeCredential
};
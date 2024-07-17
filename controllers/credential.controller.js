const { credentialService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const uploadPdf = catchAsync(async (req, res) => {
    const pdf = await credentialService.uploadPdf(req.pdfFile);
    res.status(httpStatus.CREATED).json({ pdf });
});

const uploadJson = catchAsync(async (req, res) => {
    const json = await credentialService.uploadJson(req.jsonFile);
    res.status(httpStatus.CREATED).json({ json });
});

const issueCredential = catchAsync(async (req, res) => {
    const cert = await credentialService.issueCredential(req.body);
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
    uploadPdf,
    uploadJson
};
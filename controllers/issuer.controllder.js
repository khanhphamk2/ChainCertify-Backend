const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { issuerService } = require('../services');

const addIssuer = catchAsync(async (req, res) => {
    await issuerService.addIssuer(req.body.msgSender, req.body.address);
    res.status(httpStatus.OK).send({
        message: 'Issuer added successfully',
        new_issuer: req.body.address,
    });
});

const getIssuers = catchAsync(async (req, res) => {
    const issuers = issuerService.getIssuers(req.body.msgSender);
    res.status(httpStatus.OK).send(issuers);
});

// const revokeIssuer = catchAsync(async (req, res) => {
//     const transactionHash = issuerService.revokeIssuer(req.body.address);
//     res.status(httpStatus.OK).send({
//         message: 'Issuer revoked successfully',
//         transactionHash,
//     });
// });

const getListRequestIssue = catchAsync(async (req, res) => {
    const request = issuerService.getListRequestIssue(req.params.address);
    res.status(httpStatus.OK).send(request);
});

const getListRequestRevoke = catchAsync(async (req, res) => {
    const request = issuerService.getListRequestRevoke(req.params.address);
    res.status(httpStatus.OK).send(request);
});

module.exports = {
    addIssuer,
    getIssuers,
    // revokeIssuer,
    getListRequestIssue,
    getListRequestRevoke
};
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
    const issuers = issuerService.getIssuers();
    res.status(httpStatus.OK).send(issuers);
});

// const revokeIssuer = catchAsync(async (req, res) => {
//     const transactionHash = issuerService.revokeIssuer(req.body.address);
//     res.status(httpStatus.OK).send({
//         message: 'Issuer revoked successfully',
//         transactionHash,
//     });
// });

module.exports = {
    addIssuer,
    getIssuers,
    // revokeIssuer
};
const catchAsync = require('../utils/catchAsync');
const { RequestIssue, RequestRevoke } = require('../models');
const { requestStatus } = require('../config/request.enum');
const ipfs = require('../utils/ipfs');
const fs = require('fs');

const requestIssueCredential = catchAsync(async (body, pdfFile) => {
    try {
        const { IpfsHash: pdfsHash } = await ipfs.pinFileToIPFS(pdfFile.path, pdfFile.filename);
        fs.unlinkSync(pdfFile.path); // Remove the PDF file from local storage
        console.log('PDF file saved to IPFS:', pdfsHash);

        const info = {
            name: body.name,
            identityNumber: body.identityNumber,
            institution: body.institution,
            type: body.type,
            score: body.score,
            expireDate: body.expireDate,
        };

        const result = new RequestIssue({
            address: body.address,
            pdfIpfsHash: pdfsHash,
            data: info,
            status: requestStatus.PENDING
        });
        await result.save();
        return {
            massage: 'Request saved successfully',
            request: result
        };
    } catch (error) {
        console.error('Error saving credential issuance request:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }

});

const requestRevokeCredential = catchAsync(async (body) => {
    try {
        const { address, certHash, reason } = body;

        const request = new RequestRevoke({
            address: address,
            certHash: certHash,
            reason: reason,
            status: requestStatus.PENDING
        });
        await request.save();

        return request;
    } catch (error) {
        console.error('Error saving credential revocation request:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = {
    requestIssueCredential,
    requestRevokeCredential
};
const catchAsync = require('../utils/catchAsync');
const { RequestIssue, RequestRevoke } = require('../models');

const requestIssueCredential = catchAsync(async (body) => {
    try {
        const { address, pdfFile, ...credentialDetails } = body;

        const request = new RequestIssue({
            address,
            pdfFile,
            credentialDetails
        });
        await request.save();

        return {
            massage: 'Request saved successfully',
            request: request
        };
    } catch (error) {
        console.error('Error saving credential issuance request:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }

});

const requestRevokeCredential = catchAsync(async (body) => {
    try {
        const { address, certHash, revokeReason } = body;

        // Save request to MongoDB
        const request = new RequestRevoke({
            address,
            certHash,
            revokeReason
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
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { RequestIssue, RequestRevoke } = require('../models');
const { requestStatus } = require('../config/request.enum');
const { credentialService } = require('../services');
const ipfs = require('../utils/ipfs');
const fs = require('fs');

const addRequestIssue = catchAsync(async (body, pdfFile) => {
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

        return result;
    } catch (error) {
        let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

        if (error.statusCode) {
            statusCode = error.statusCode;
        }

        throw new ApiError(statusCode, error.message);
    }
});

const addRequestRevoke = catchAsync(async (body) => {
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

const getRequestIssue = async (id) => {
    try {
        console.log('holder:', id);
        const request = await RequestIssue.findById(id);
        if (!request) {
            throw new Error('Request not found');
        }
        return request;
    } catch (error) {
        console.error('Error getting request issue:', error);
        throw error;
    }
}

const getRequestRevoke = async (id) => {
    try {
        const request = await RequestRevoke.findById(id);
        if (!request) {
            throw new Error('Request not found');
        }
        return request;
    }
    catch (error) {
        console.error('Error getting request revoke:', error);
        throw error;
    }
}

const getListRequestIssue = async () => {
    try {
        const listRequest = await RequestIssue.find();
        return listRequest;
    } catch (error) {
        console.error('Error getting list request issue:', error);
        throw error;
    }
}

const getListRequestRevoke = async () => {
    try {
        const listRequest = await RequestRevoke.find();
        return listRequest;
    } catch (error) {
        console.error('Error getting list request revoke:', error);
        throw error;
    }
}

const approveRequestIssue = async (body, id) => {
    try {
        const request = await RequestIssue.findById(id);
        if (!request) {
            throw new Error('Request not found');
        }

        if (request.status !== requestStatus.PENDING) {
            throw new Error('Request is not pending');
        }

        const result = await credentialService.issueCredentialFromRequest(
            request.address,
            body.issuer,
            request.data,
            request.pdfIpfsHash,
            body.note
        );

        if (!result) {
            throw new Error('Error issuing credential');
        }

        request.note = `Credential issued: ${body.issuer}`;
        request.status = requestStatus.APPROVED;
        request.updateAt = new Date();

        await request.save();

        return result;
    } catch (error) {
        console.error('Error approving request issue:', error);
        throw error;
    }
};


const rejectRequestIssue = async (body, id) => {
    try {
        const request = await RequestIssue.findById(id);
        if (!request) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
        }

        if (request.status !== requestStatus.PENDING) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Request is not pending');
        }

        request.note = `Issuer ${body.issuer} rejected. Reason: ${body.reason}`;
        request.status = requestStatus.REJECTED;
        request.updateAt = new Date();

        await request.save();

        return request;
    } catch (error) {
        console.error('Error rejecting request issue:', error);
        throw error;
    }
};


const approveRequestRevoke = async (body, id) => {
    try {
        const request = await RequestRevoke.findById(id);
        if (!request) {
            throw new Error('Request not found');
        }

        if (request.status !== requestStatus.PENDING) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Request is not pending');
        }
        console.log('Request revoke:', request);

        const result = await credentialService.revokeCredential(body, request.certHash);
        if (!result) {
            throw new Error('Error revoking credential');
        }

        request.note = `Issuer ${body.issuer} approved.`;
        request.status = requestStatus.APPROVED;
        request.updateAt = new Date();

        await request.save();

        return result;

    } catch (error) {
        console.error('Error approving request revoke:', error);
        throw error;
    }
}

const rejectRequestRevoke = async (body, id) => {
    try {
        const request = await RequestRevoke.findById(id);
        if (!request) {
            throw new Error('Request not found');
        }
        if (request.status !== requestStatus.PENDING) {
            throw new Error('Request is not pending');
        }

        request.note = `Issuer ${body.issuer} rejected. Reason: ${body.reason}`;
        request.status = requestStatus.REJECTED;
        request.updateAt = new Date();

        await request.save();

        return request;
    } catch (error) {
        console.error('Error rejecting request revoke:', error);
        throw error;
    }
}

module.exports = {
    addRequestIssue,
    addRequestRevoke,
    getRequestIssue,
    getRequestRevoke,
    getListRequestIssue,
    getListRequestRevoke,
    approveRequestIssue,
    rejectRequestIssue,
    approveRequestRevoke,
    rejectRequestRevoke
};
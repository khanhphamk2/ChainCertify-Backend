const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const hashObject = require('../utils/hashObject');
const { ethers } = require('ethers');
const abiCred = require('../utils/ABI/certificate.json');
const ipfs = require('../utils/ipfs');
const fs = require('fs');
const { Credential } = require('../models');
const exp = require('constants');
const { json } = require('express');

const provider = new ethers.JsonRpcProvider(config.RPC_LOCAL);

const addCredential = async (certHash, holder, expireDate) => {
    try {
        const cred = new Credential({ certHash, holder, expireDate });
        await cred.save();
        return cred;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error adding credential: ' + error.message);
    }
}

const getListCred = async (holder) => {
    try {
        const credentials = await Credential.find({ holder: holder });
        if (!credentials.length) {
            console.log('No certificates found for this holder');
            return [];
        }
        return credentials.map(cred => cred.certHash);
    } catch (error) {
        console.log(error);
        return [];
    }
};

const issueCredentialFromRequest = async (holder, issuer, data, pdfsHash, note) => {
    try {

        const info = {
            name: data.name,
            identityNumber: data.identityNumber,
            institution: data.institution,
            type: data.type,
            score: data.score,
            expireDate: data.expireDate,
        };

        const cert = {
            holder: holder,
            pdf: pdfsHash,
            info,
        };

        const hashInfo = hashObject(info);

        const customName = `${holder}_${hashInfo.slice(2)}`;

        const { IpfsHash: jsonIpfsHash } = await ipfs.uploadJSONToIPFS(cert, customName);

        const ipns = await ipfs.getFile(jsonIpfsHash);

        const tx = await contract.issueCertificate(holder, jsonIpfsHash, hashInfo, note, { from: issuer });

        const receipt = await tx.wait();

        const certHash = receipt.logs
            .map(log => contract.interface.parseLog(log))
            .find(log => log.name === 'CertificateIssued')?.args._certificateHash;

        if (!certHash) {
            throw new Error('CertificateIssued event not found in transaction logs');
        }

        const cred = await addCredential(certHash, holder, data.expireDate);

        return {
            message: 'Credential Issued Successfully!',
            certificateHash: certHash,
            ipfs: ipns,
            credential: cred,
            transactionHash: receipt.hash,
        };

    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error creating credential: ${error.message}`);
    }
}

const uploadPdf = async (pdfFile) => {
    try {
        console.log('Uploading pdf to IPFS...', pdfFile);
        const { IpfsHash: pdfIpfsHash } = await ipfs.pinFileToIPFS(pdfFile.path, pdfFile.filename);
        fs.unlinkSync(pdfFile.path);
        return pdfIpfsHash;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error uploading pdf: ${error.message}`);
    }
}

const uploadJson = async (body) => {
    try {
        const customName = `${body.holder}_${body.hashInfo.slice(2)}`;
        const { IpfsHash: jsonIpfsHash } = await ipfs.uploadJSONToIPFS(body, customName);
        return jsonIpfsHash;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error uploading json: ${error.message}`);
    }
}

const issueCredential = async (body) => {
    try {
        // const temp = {
        //     certHash,
        //     holder,
        //     expireDate,
        //     jsonIpfsHash,
        //     txHash,
        // };

        const cred = await addCredential(body.certHash, body.holder, body.expireDate);
        await cred.save();
        // Return the success response
        return {
            message: 'Credential Issued Successfully!',
            certificateHash: body.certHash,
            ipfs: body.jsonIpfsHash,
            pdfsHash: body.pdfIpfsHash,
            credential: body.cred,
            transactionHash: body.hash,
        };
    } catch (error) {
        // Handle any errors that occur during the process
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error creating credential: ${error.message}`);
    }
};

const getCredentialsByHolderAddress = async (holder) => {
    try {
        const credentials = await getListCred(holder);

        const listCerts = await contract.getCertificatesByList(holder, credentials, { from: config.ACCOUNT_ADDRESS });

        const res = listCerts.map(certificate => ({
            holder: certificate[0],
            issuer: certificate[1],
            certHash: certificate[2],
            ipfsHash: certificate[3],
            issueDate: new Date(Number(certificate[4]) * 1000), // Convert BigInt to Date
            note: certificate[5],
            isRevoked: certificate[6]
        }));

        return {
            message: 'Get List Credential Successful!',
            result: res
        };
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error: ' + error.message);
    }
};

const getCredentialByHash = async (body, hash) => {
    try {
        const certificate = await contract.getCertificateByHash(body.holder, hash, { from: body.msgSender });
        const certificateJson = {
            holder: certificate[0],
            issuer: certificate[1],
            certHash: certificate[2],
            ipfsHash: certificate[3],
            issueDate: new Date(Number(certificate[4]) * 1000), // Convert BigInt to Date
            note: certificate[5],
            isRevoked: certificate[6]
        };
        return certificateJson;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error: ' + error.message);
    }
};

const revokeCredential = async (body, hash) => {
    try {
        const tx = await contract.revokeCertificate(body.holder, hash, body.reason, {
            from: body.issuer
        })
        const receipt = await tx.wait();

        const logs = receipt.logs.map(log => contract.interface.parseLog(log));
        let _isRevoked = false;
        for (const log of logs) {
            if (log.name === 'RevokedCertificate') {
                _isRevoked = log.args._isRevoked;
                // console.log('Certificate hash:', log.args._certificateHash);
                // console.log('args', log.args._isRevoked);
            }
        }

        return {
            message: 'Credential Revoked Successfully!',
            reason: body.reason,
            isRevoked: _isRevoked,
            result: receipt
        };
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error revoking credential: ' + error.message);
    }
}


module.exports = {
    issueCredential,
    issueCredentialFromRequest,
    getCredentialsByHolderAddress,
    getCredentialByHash,
    revokeCredential,
    addCredential,
    getListCred,
    uploadPdf,
    uploadJson,
    // verifyCredential
};
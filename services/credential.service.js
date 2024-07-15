const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const hashObject = require('../utils/hashObject');
const { ethers } = require('ethers');
const abiCred = require('../utils/ABI/certificate.json');
const ipfs = require('../utils/ipfs');
const fs = require('fs');
const { Credential } = require('../models');

const provider = new ethers.JsonRpcProvider(config.RPC_LOCAL);

const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);

const contract = new ethers.Contract(config.CRED_CONTRACT, abiCred, wallet);

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

const issueCredential = async (reqBody, pdfFile) => {
    try {
        // Pin the PDF file to IPFS and get its hash
        const { IpfsHash: pdfIpfsHash } = await ipfs.pinFileToIPFS(pdfFile.path, pdfFile.filename);
        fs.unlinkSync(pdfFile.path); // Remove the PDF file from local storage

        // Create the certificate information object
        const info = {
            name: reqBody.name,
            identityNumber: reqBody.identityNumber,
            institution: reqBody.institution,
            type: reqBody.type,
            score: reqBody.score,
            expireDate: reqBody.expireDate,
        };

        console.log('info', reqBody.note);

        // Create the certificate object
        const cert = {
            holder: reqBody.holder,
            pdf: pdfIpfsHash,
            info,
        };

        // Hash the certificate information
        const hashInfo = hashObject(info);

        // Create a custom name for the IPFS JSON upload
        const customName = `${reqBody.holder}_${hashInfo.slice(2)}`;

        // Upload the certificate object to IPFS as JSON
        const { IpfsHash: jsonIpfsHash } = await ipfs.uploadJSONToIPFS(cert, customName);

        // Get the IPFS file reference (IPNS)
        const ipns = await ipfs.getFile(jsonIpfsHash);

        // Issue the certificate on the blockchain
        const tx = await contract.issueCertificate(reqBody.holder, jsonIpfsHash, hashInfo, reqBody.note, { from: reqBody.msgSender });

        // Wait for the transaction to be confirmed
        const receipt = await tx.wait();

        // Extract the certificate hash from the transaction logs
        const certHash = receipt.logs
            .map(log => contract.interface.parseLog(log))
            .find(log => log.name === 'CertificateIssued')?.args._certificateHash;

        if (!certHash) {
            throw new Error('CertificateIssued event not found in transaction logs');
        }

        const cred = await addCredential(certHash, reqBody.holder, reqBody.expireDate);

        // Return the success response
        return {
            message: 'Credential Issued Successfully!',
            certificateHash: certHash,
            ipfs: ipns,
            credential: cred,
            transactionHash: receipt.hash,
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
            ipfsHash: certificate[2],
            issueDate: new Date(Number(certificate[3]) * 1000), // Convert BigInt to Date
            note: certificate[4],
            isRevoked: certificate[5]
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
            ipfsHash: certificate[2],
            issueDate: new Date(Number(certificate[3]) * 1000), // Convert BigInt to Date
            isRevoked: certificate[4]
        };
        return certificateJson;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error: ' + error.message);
    }
};

const revokeCredential = async (body) => {
    try {
        const tx = await contract.revokeCertificate(body.holder, body.hash, body.reason, {
            from: body.issuer
        })
        const receipt = await tx.wait();

        const logs = receipt.logs.map(log => contract.interface.parseLog(log));
        let _isRevoked = false;
        for (const log of logs) {
            if (log.name === 'RevokedCertificate') {
                _isRevoked = log.args._isRevoked;
                console.log('Certificate hash:', log.args._certificateHash);
                console.log('args', log.args._isRevoked);
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
    getCredentialsByHolderAddress,
    getCredentialByHash,
    revokeCredential,
    // verifyCredential
};
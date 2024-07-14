const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const hashObject = require('../utils/hashObject');
const { ethers } = require('ethers');
const abiCred = require('../utils/ABI/certificate.json');
const ipfs = require('../utils/ipfs');
const fs = require('fs');

const provider = new ethers.JsonRpcProvider(config.RPC_LOCAL);

const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);

const contract = new ethers.Contract(config.CRED_CONTRACT, abiCred, wallet);

const issueCredential = async (reqBody, pdfFile) => {
    try {
        // Pin the PDF file to IPFS and get its hash
        const { IpfsHash: pdfIpfsHash } = await ipfs.pinFileToIPFS(pdfFile.path, pdfFile.filename);
        fs.unlinkSync(pdfFile.path); // Remove the PDF file from local storage

        // Create the certificate information object
        const info = {
            name: reqBody.name,
            identity_number: reqBody.identityNumber,
            institution: reqBody.institution,
            type: reqBody.type,
            score: reqBody.score,
            expireDate: reqBody.expireDate,
            note: reqBody.note,
        };

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
        const tx = await contract.issueCertificate(reqBody.holder, jsonIpfsHash, hashInfo, { from: reqBody.msgSender });

        // Wait for the transaction to be confirmed
        const receipt = await tx.wait();

        // Extract the certificate hash from the transaction logs
        const certHash = receipt.logs
            .map(log => contract.interface.parseLog(log))
            .find(log => log.name === 'CertificateIssued')?.args._certificateHash;

        if (!certHash) {
            throw new Error('CertificateIssued event not found in transaction logs');
        }

        console.log('Certificate hash:', certHash);

        // Return the success response
        return {
            status: 'success',
            message: 'Credential Issued Successfully!',
            certificateHash: certHash,
            ipfs: ipns,
            result: receipt,
        };
    } catch (error) {
        // Handle any errors that occur during the process
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error creating credential: ${error.message}`);
    }
};


// const getCredentialsByHolderAddress = async (holderAddress) => {
//     try {
//         const tx = await contract.getCredentialsByHolderAddress(holderAddress);

//         await tx.wait();
//         return {
//             status: 'success',
//             message: 'Get List Credential Successful!',
//             result: tx
//         };
//     } catch (error) {
//         throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching credentials: ' + error.message);
//     }
// };

const getCredentialByHash = async (body, hash) => {
    try {
        console.log('body:', body);
        console.log('hash:', hash);
        const certificate = await contract.getCertificateByHash(body.holder, hash, { from: body.msgSender });
        const certificateJson = {
            holder: certificate[0],
            issuer: certificate[1],
            ipfsHash: certificate[2],
            timestamp: new Date(Number(certificate[3]) * 1000), // Convert BigInt to string
            isRevoked: certificate[4]
        };
        console.log('Certificate:', certificate);
        return certificateJson;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching credential: ' + error.message);
    }
};

const revokeCredential = async (reqBody) => {
    try {
        const tx = await contract.revokeCertificate(reqBody.holder, reqBody.hash, {
            from: reqBody.msgSender
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
            status: 'success',
            message: 'Credential Revoked Successfully!',
            isRevoked: _isRevoked,
            result: receipt
        };
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error revoking credential: ' + error.message);
    }
}


module.exports = {
    issueCredential,
    // getCredentialsByHolderAddress,
    getCredentialByHash,
    revokeCredential,
    // verifyCredential
};
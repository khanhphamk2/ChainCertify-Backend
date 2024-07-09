const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const hashObject = require('../utils/hashObject');
const { ethers } = require('ethers');
const abiCred = require('../utils/ABI/certificate.json');
const ipfs = require('../utils/ipfs');
const fs = require('fs');

const provider = new ethers.JsonRpcProvider(config.L2_RPC + config.INFURA_API_KEY);

const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);

const contract = new ethers.Contract(config.L2_CRED_CON_ADDR, abiCred, wallet);

const issueCredential = async (reqBody, pdfFile) => {
    try {
        const pdfHash = await ipfs.pinFileToIPFS(pdfFile.path, pdfFile.filename);
        fs.unlinkSync(pdfFile.path);

        const info = {
            name: reqBody.name,
            identity_number: reqBody.identityNumber,
            institution: reqBody.institution,
            type: reqBody.type,
            score: reqBody.score,
            expireDate: reqBody.expireDate,
            note: reqBody.note,
        };

        const cert = {
            holder: reqBody.holder,
            pdf: pdfHash.IpfsHash,
            info: info
        };

        const hashInfo = hashObject(info);

        const customName = `${reqBody.holder}_${hashInfo.slice(2)}`;

        const ipfsHash = await ipfs.uploadJSONToIPFS(cert, customName);

        const ipns = await ipfs.getFile(ipfsHash.IpfsHash);

        const tx = await contract.issueCertificate(reqBody.holder, ipfsHash.IpfsHash, hashInfo, { from: reqBody.msgSender });

        const receipt = await tx.wait();

        let certHash = "";

        const logs = receipt.logs.map(log => contract.interface.parseLog(log));

        for (const log of logs) {
            if (log.name === 'CertificateIssued') {
                certHash = log.args._certificateHash;
                console.log('Certificate hash:', log.args._certificateHash);
            }
        }

        return {
            status: 'success',
            message: 'Credential Issued Successfully!',
            certificateHash: certHash,
            ipfs: ipns,
            result: receipt
        };

    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating credential: ' + error.message);
    }
};

const testContract = async (req) => {
    try {
        const tx = await contract.issueCertificate(reqBody.holder, ipfsHash.IpfsHash, hashInfo, { from: reqBody.msgSender });

        const receipt = await tx.wait();

        const event = receipt.events.find(event => event.event === 'CertificateIssued');
        const certificateHash = ethers.EventLog.args.certificateHash;

        return {
            status: 'success',
            message: 'Credential Issued Successfully!',
            certificateHash: receipt.events.CertificateIssued.returnValues._certificateHash,
            result: receipt
        };

    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating credential: ' + error.message);
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

const getCredentialByHash = async (holder, credentialHash) => {
    try {
        const certificate = await certificatesContract.methods
            .getCertificateByHash(holder, credentialHash)
            .call();
        return certificate;
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
    // getCredentialByHash,
    revokeCredential,
    // verifyCredential
};
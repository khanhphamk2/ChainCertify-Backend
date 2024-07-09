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

        const tx = await contract.issueCertificate(reqBody.holder, ipfsHash.IpfsHash, hashInfo, { from: reqBody.msgSender });

        const receipt = await tx.wait();
        return {
            status: 'success',
            message: 'Credential Issued Successfully!',
            // certificateHash: receipt.events.CertificateIssued.returnValues._certificateHash,
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
        const gasFee = await certificatesContract.methods
            .revokeCertificate(reqBody.holder, reqBody.certificateHash)
            .estimateGas({
                from: reqBody.msgSender
            });

        const receipt = await certificatesContract.methods
            .revokeCertificate(reqBody.holder, reqBody.certificateHash)
            .send({
                from: reqBody.msgSender,
                gas: gasFee,
            });

        console.log("Certificate revoked successfully with transaction hash:", receipt.transactionHash);
        return receipt.events.RevokedCertificate.returnValues._certificateHash;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error revoking credential: ' + error.message);
    }
}


module.exports = {
    issueCredential,
    // getCredentialsByHolderAddress,
    // getCredentialByHash,
    // revokeCredential,
    // verifyCredential
};
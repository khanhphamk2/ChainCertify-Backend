const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { ethers } = require('ethers');
const abi = require('../utils/ABI/certificate.json');
const keccak256 = require('keccak');
const { ipfsService } = require('../services');
const path = require('path');

const provider = new ethers.JsonRpcProvider(config.RPC_LOCAL);
const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.LOCAL_CRED_CON_ADDR, abi, wallet);

const hashInfo = async (info) => {
    const hash = keccak256(info.name + info.identity_number + info.institution + info.type + info.score + info.expireDate + info.note + info.ipfsPDF).toString('hex');
    return hash;
};

/**
 * Generate keccak256 hash of a JSON object
 * @param {Object} jsonObject 
 * @returns {string} Keccak256 hash
 */
const hashJsonObject = (jsonObject) => {
    const jsonString = JSON.stringify(jsonObject);
    const jsonBytes = ethers.utils.toUtf8Bytes(jsonString);
    return ethers.utils.keccak256(jsonBytes);
};

const issueCredential = async (reqBody, file) => {
    try {
        const certPath = path.join(__dirname, '..', 'uploads', file.filename);
        const ipfsPDF = await ipfsService.pinFileToIPFS(certPath);

        const info = {
            name: reqBody.name,
            identity_number: reqBody.identityNumber,
            institution: reqBody.institution,
            type: reqBody.type,
            score: reqBody.score,
            expireDate: reqBody.expireDate,
            note: reqBody.note,
            ipfsPDF: ipfsPDF
        };

        const cert = {
            holder: reqBody.holder,
            pdf: ipfsPDF,
            info: info
        };

        const hashInfo = hashJsonObject(info);

        const ipfsHash = await ipfsService.pinJSONToIPFS(cert, hashInfo);

        // const gas = await contract.issueCertificate({ holder: reqBody.holder, ipfsHash, info })
        //     .estimateGas({
        //         from: reqBody.msgSender
        //     });

        // const receipt = await contract.issueCertificate(reqBody.holder, reqBody.fileUrl, reqBody.score, reqBody.expireDate)
        //     .send({
        //         from: reqBody.publicKey,
        //         gas: gas
        //     });

        // console.log("Certificate issued successfully with transaction hash:", receipt.transactionHash);

        // return {
        //     status: 'success',
        //     message: 'Credential Issued Successfully!',
        //     result: receipt.events.IssuedCertificate.returnValues._certificateHash
        // };

        return { cert: cert, hashInfo: hashInfo, ipfsHash: ipfsHash };
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

// const verifyCredential = async (credentialAddress) => {
//     try {
//         const credential = await contract.verifyCredential(credentialAddress);

//         return credential;
//     } catch (error) {
//         throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error verifying credential: ' + error.message);
//     }
// };

module.exports = {
    issueCredential,
    // getCredentialsByHolderAddress,
    // getCredentialByHash,
    // revokeCredential,
    // verifyCredential
};
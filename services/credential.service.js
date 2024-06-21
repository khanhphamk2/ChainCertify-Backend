const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const ethers = require('ethers');
const abi = require('../utils/ABI/certificate.json');

const provider = new ethers.JsonRpcProvider(config.RPC_LOCAL);
const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.L1_CERT, abi, wallet);

const issueCredential = async (reqBody) => {
    try {
        const gas = await certificatesContract.methods
            .issueCertificate(reqBody.holder, reqBody.fileUrl, reqBody.score, reqBody.expireDate)
            .estimateGas({
                from: reqBody.msgSender
            });

        const receipt = await contract.methods
            .issueCertificate(reqBody.holder, reqBody.fileUrl, reqBody.score, reqBody.expireDate)
            .send({
                from: reqBody.publicKey,
                gas: gas
            });

        console.log("Certificate issued successfully with transaction hash:", receipt.transactionHash);

        return {
            status: 'success',
            message: 'Credential Issued Successfully!',
            result: receipt.events.IssuedCertificate.returnValues._certificateHash
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
    getCredentialByHash,
    revokeCredential,
    // verifyCredential
};
const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const hashObject = require('../utils/hashObject');
const { ethers } = require('ethers');
const abi = require('../utils/ABI/certificate.json');
const ipfs = require('../utils/ipfs');
const path = require('path');
const fs = require('fs');

const provider = new ethers.JsonRpcProvider(config.RPC_LOCAL);
const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.LOCAL_CRED_CON_ADDR, abi, wallet);

const issueCredential = async () => {
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
        // const holder = "0x7F3A97FD9Ba255d0581cd5C66Af63aA335Aef7Ff";
        // const msgSender = "0x8ee3dE1016175EEa28acB4FD6e1F9a4195F4404d";
        // const hashInfo = "dabfbc6efbb58f335d14fb39a478ca9182e48c7c6fb63561cf79b2d0cb610ac0";
        // const ipfsHash = "QmX8Q7aZ7n1cYbQmZ2Fy4m7z7n1cYbQmZ2Fy4m7z";
        // console.log('Holder:', ethers.getAddress(holder.toLowerCase()));
        // const gas = await contract.issueCertificate.estimateGas(ethers.getAddress(holder.toLowerCase()), ipfsHash, hashInfo, { from: ethers.getAddress(msgSender.toLowerCase()) });
        // const tx = await contract.issueCertificate(
        //     ethers.getAddress(holder.toLowerCase()),
        //     ipfsHash,
        //     hashInfo,
        //     { from: ethers.getAddress(msgSender.toLowerCase()) }
        // );
        // console.log('Gas:', gas.toString());
        // const estimatedGas = await tx.estimateGas({ from: ethers.getAddress(msgSender.toLowerCase()) });

        // console.log('Estimated Gas:', estimatedGas.toString());

        return {
            status: 'success',
            message: 'Credential Issued Successfully!'
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
    // getCredentialByHash,
    // revokeCredential,
    // verifyCredential
};
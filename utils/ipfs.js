const { IPFS_ACCESS_TOKEN_KEY_1, IPFS_JWT_KEY } = require('../config/config');
const axios = require('axios');
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');

const pinata = new pinataSDK({ pinataJWTKey: IPFS_JWT_KEY });

const getFileJSON = async (CID) => {
    return `https://black-delicate-hamster-859.mypinata.cloud/ipfs/${CID}?pinataGatewayToken=${IPFS_ACCESS_TOKEN_KEY_1}`;
}

const testConnect = async () => {
    try {
        const res = await pinata.testAuthentication();
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

const pinFileToIPFS = async (filePath, myCustomName) => {
    try {
        const readableStreamForFile = fs.createReadStream(filePath);

        const options = {
            pinataMetadata: {
                name: myCustomName,
            },
            pinataOptions: {
                cidVersion: 0
            }
        };

        const res = await pinata.pinFileToIPFS(readableStreamForFile, options);

        return res;
    } catch (error) {
        console.log(error);
    }
}

const pinFromFS = async (sourcePath) => {
    try {
        const options = {
            pinataMetadata: {
                name: 'My Awesome Website',
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        const res = await pinata.pinFromFS(sourcePath, options);
        return res;
    } catch (error) {
        console.log(error);
    }
}

const uploadJSONToIPFS = async (jsonObject, customName) => {
    try {
        const options = {
            pinataMetadata: {
                name: customName,
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        const res = await pinata.pinJSONToIPFS(jsonObject, options);
        return res;
    }
    catch (error) {
        console.log(error);
    }
}

const userPinnedDataTotal = async () => {
    try {
        const res = await pinata.userPinnedDataTotal();
        return res;
    } catch (error) {
        console.log(error);
    }
}

const unpin = async (cid) => {
    try {
        const res = await pinata.unpin(cid);
        return res;
    } catch (error) {
        console.log(error);
    }
}

const hashMetadata = async (ipfsHash, data) => {
    try {
        const metadata = {
            name: 'new custom name',
            keyvalues: {
                newKey: 'newValue',
                existingKey: 'newValue',
                existingKeyToRemove: null
            }
        };
        const res = await pinata.hashMetadata(ipfsHash, metadata);
        return res;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getFileJSON,
    testConnect,
    pinFileToIPFS,
    pinFromFS,
    uploadJSONToIPFS,
    userPinnedDataTotal,
    unpin
};

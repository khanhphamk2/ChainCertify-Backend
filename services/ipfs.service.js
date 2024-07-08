const { ACCESS_TOKEN, PINATA_JWT_KEY } = require('../config/config');
const axios = require('axios');
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');

const pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT_KEY });

const getFileJSON = async (CID) => {
    axios.get(`https://black-delicate-hamster-859.mypinata.cloud/ipfs/${CID}?pinataGatewayToken=${ACCESS_TOKEN}`)
        .then((response) => {
            console.log(response.json());
        })
        .catch((error) => {
            console.error(error);
        });
}

const testConnect = async () => {
    try {
        const res = await pinata.testAuthentication();
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

const pinFileToIPFS = async (filePath) => {
    try {
        const readableStreamForFile = fs.createReadStream(filePath);

        const options = {
            pinataMetadata: {
                name: MyCustomName,
                keyvalues: {
                    customKey: 'customValue',
                    customKey2: 'customValue2'
                }
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
                keyvalues: {
                    customKey: 'customValue',
                    customKey2: 'customValue2'
                }
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

const pinJSONToIPFS = async (jsonObject, customName) => {
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
    } catch (error) {
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
    pinJSONToIPFS,
    userPinnedDataTotal,
    unpin
};

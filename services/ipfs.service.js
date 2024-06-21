const { get } = require('mongoose');
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const JWT = "PASTE_YOUR_PINATA_JWT";
const pinata = new pinataSDK('yourPinataApiKey', 'yourPinataSecretApiKey');
// const pinata = new pinataSDK({ pinataJWTKey: 'yourPinataJWTKey' });

const getFile = async (ipfsHash) => {
    try {
        const res = await fetch(
            "https://mygateway.mypinata.cloud/ipfs/" + ipfsHash
        );
        const resData = await res.text();
        console.log(resData);
    } catch (error) {
        console.log(error);
    }
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

        console.log(res);
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
        const res = await pinata.pinFromFS(sourcePath, options)
        console.log(res)
    } catch (error) {
        console.log(error);
    }
}

const pinJSONToIPFS = async (jsonObject, customName) => {
    try {
        const options = {
            pinataMetadata: {
                name: customName,
                keyvalues: {
                    customKey: 'customValue',
                    customKey2: 'customValue2'
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        const res = await pinata.pinJSONToIPFS(jsonObject, options);
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

const userPinnedDataTotal = async () => {
    try {
        const res = await pinata.userPinnedDataTotal();
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

const unpin = async (cid) => {
    try {
        const res = await pinata.unpin(cid);
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getFile,
    testConnect,
    pinFileToIPFS,
    pinFromFS,
    pinJSONToIPFS,
    userPinnedDataTotal,
    unpin
};

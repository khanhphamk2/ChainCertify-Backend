const ipfs = require('../utils/ipfs');

async function main() {

    const ipfsHash = {
        IpfsHash: 'QmZdYiZQ3V7zL6v2JQZQpYbQ4YR6QH2Qz2m9Q2ZQZQZQZQ'
    }
    console.log(ipfsHash.IpfsHash);

    const url = await ipfs.getFile(ipfsHash.IpfsHash);

    console.log(url);
}

main();
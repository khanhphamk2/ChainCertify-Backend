const config = require('../config/config');
const ethers = require('ethers');
const abiIssuer = require('../utils/ABI/issuer.json');

const provider = new ethers.JsonRpcProvider(config.RPC_LOCAL);

const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.L1_ISSUER, abiIssuer, wallet);

/**
 * Add a new issuer
 * @param {string} msgSender 
 * @param {string} issuer 
 * @returns {Promise<Object>}
 */
const addIssuer = async (msgSender, issuer) => {
    const receipt = await contract.methods
        .addIssuer(issuer)
        .send({ from: msgSender});
    await receipt.wait();
    console.log("Add issuer transaction receipt:", receipt);
    return receipt.hash;
};

const getIssuers = async () => {
    return await contract.getIssuers();
};

const revokeIssuer = async (issuer) => {
    const tx = await contract.revokeIssuer(issuer);
    await tx.wait();
    return tx.hash;
};

module.exports = {
    addIssuer,
    getIssuers,
    revokeIssuer
};
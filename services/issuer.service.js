const config = require('../config/config');
const ethers = require('ethers');
const abiIssuer = require('../utils/ABI/issuer.json');

const provider = new ethers.JsonRpcProvider(config.L2_RPC + config.INFURA_API_KEY);

const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.L2_ISSUER_CON_ADDR, abiIssuer, wallet);

/**
 * Add a new issuer
 * @param {string} msgSender 
 * @param {string} issuer 
 * @returns {Promise<Object>}
 */

const addIssuer = async (msgSender, issuer) => {
    try {
        const tx = await contract.addIssuer(issuer, { from: msgSender });
        const receipt = await tx.wait();
        console.log("Add issuer transaction receipt:", receipt);
        return receipt;
    } catch (error) {
        console.error("Error adding issuer:", error);
        throw error;
    }
};

const getIssuers = async (msgSender) => {
    const tx = await contract.getIssuers({ from: msgSender });
    const issuers = await tx.wait();
    console.log("Issuers:", issuers);
    return issuers;
};

const revokeIssuer = async (msgSender, issuer) => {
    const tx = await contract.revokeIssuer(issuer, { from: msgSender });
    await tx.wait();
    return tx.hash;
};

module.exports = {
    addIssuer,
    getIssuers,
    revokeIssuer
};
const config = require('../config/config');
const ethers = require('ethers');
const abiIssuer = require('../utils/ABI/issuer.json');
const { User } = require('../models');
const { userRole } = require('../config/role.enum');

const provider = new ethers.JsonRpcProvider(config.LOCAL_RPC);

const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.ISSUER_CONTRACT, abiIssuer, wallet);

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

        const user = new User({ address: issuer, role: userRole.ISSUER });
        await user.save();

        return receipt;
    } catch (error) {
        console.error("Error adding issuer:", error);
        throw error;
    }
};

/**
 * 
 * @param {string} msgSender 
 * @returns {Promise<Object>}
 */
const getIssuers = async (msgSender) => {
    const tx = await contract.getIssuers({ from: msgSender });
    const issuers = await tx.wait();
    console.log("Issuers:", issuers);
    return issuers;
};

/**
 * 
 * @param {string} msgSender 
 * @param {string} issuer 
 * @returns {Promise<string>}
 */
const revokeIssuer = async (msgSender, issuer) => {
    const tx = await contract.revokeIssuer(issuer, { from: msgSender });
    await tx.wait();
    return tx.hash;
};


module.exports = {
    addIssuer,
    getIssuers,
    revokeIssuer,
};
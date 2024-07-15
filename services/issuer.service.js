const config = require('../config/config');
const ethers = require('ethers');
const abiIssuer = require('../utils/ABI/issuer.json');
const { RequestIssue, RequestRevoke } = require('../models');

const provider = new ethers.JsonRpcProvider(config.L2_RPC);

const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
const contract = new ethers.Contract(config.L2_ISSUER, abiIssuer, wallet);

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

const getListRequestIssue = async (address) => {
    try {
        const listRequest = await RequestIssue.find();

        return listRequest;
    } catch (error) {
        console.error('Error getting list request issue:', error);
        throw error;
    }
}

const getListRequestRevoke = async (address) => {
    try {
        const listRequest = await RequestRevoke.find();
        return listRequest;
    } catch (error) {
        console.error('Error getting list request revoke:', error);
        throw error;
    }
}

const approveRequestIssue = async (address) => {
    try {
        const request = await RequestIssue.findOne({ address });
        if (!request) {
            throw new Error('Request not found');
        }
    } catch (error) {
        console.error('Error approving request issue:', error);
        throw error;
    }
}

module.exports = {
    addIssuer,
    getIssuers,
    revokeIssuer,
    getListRequestIssue,
    getListRequestRevoke
};
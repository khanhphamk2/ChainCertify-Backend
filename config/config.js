const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(3000),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),

        LOCAL_RPC: Joi.string().required().description('LOCAL RPC url'),
        CRED_CONTRACT: Joi.string().required().description('Certificates contract address Local tesnet'),
        ISSUER_CONTRACT: Joi.string().required().description('Issuers contract address Local tesnet'),

        L1_RPC: Joi.string().required().description('L1 RPC url'),
        L2_RPC: Joi.string().required().description('L2 RPC url'),

        INFURA_API_KEY: Joi.string().required().description('Infura API key'),
        INFURA_SECRET_KEY: Joi.string().required().description('Infura API key secret'),

        L2_CRED_CONTRACT_ADDRESS: Joi.string().required().description('Certificates contract address L2 tesnet'),
        L2_ISSUER_CONTRACT_ADDRESS: Joi.string().required().description('Issuers contract address L2 tesnet'),

        ACCOUNT_ADDRESS: Joi.string().required().description('Account address'),
        PRIVATE_KEY: Joi.string().required().description('Private key'),

        IPFS_JWT_KEY: Joi.string().required().description('Pinata JWT key'),
        IPFS_API_KEY: Joi.string().required().description('Pinata API key'),
        IPFS_API_SECRET_KEY: Joi.string().required().description('Pinata secret API key'),
        IPFS_ACCESS_TOKEN_KEY_1: Joi.string().required().description('Access token key1'),

        FRAUD_DETECTION: Joi.string().required().description('Fraud detection url'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        // options: {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // },
    },
    ACCOUNT_ADDRESS: envVars.ACCOUNT_ADDRESS,
    PRIVATE_KEY: envVars.PRIVATE_KEY,
    // LOCAL
    RPC_LOCAL: envVars.LOCAL_RPC,
    CRED_CONTRACT: envVars.CRED_CONTRACT,
    ISSUER_CONTRACT: envVars.ISSUER_CONTRACT,

    // Layer 1
    L1_RPC: envVars.L1_RPC,
    // Layer 2
    L2_RPC: envVars.L2_RPC,
    L2_CRED_CON_ADDR: envVars.L2_CRED_CONTRACT_ADDRESS,
    L2_ISSUER_CON_ADDR: envVars.L2_ISSUER_CONTRACT_ADDRESS,
    // Infura
    INFURA_API_KEY: envVars.INFURA_API_KEY,
    INFURA_SECRET_KEY: envVars.INFURA_SECRET_KEY,
    // IPFS
    IPFS_JWT_KEY: envVars.IPFS_JWT_KEY,
    IPFS_API_KEY: envVars.IPFS_API_KEY,
    IPFS_API_SECRET_KEY: envVars.IPFS_API_SECRET_KEY,
    IPFS_ACCESS_TOKEN_KEY_1: envVars.IPFS_ACCESS_TOKEN_KEY_1,
    // Fraud Detection
    FRAUD_DETECTION: envVars.FRAUD_DETECTION,
};
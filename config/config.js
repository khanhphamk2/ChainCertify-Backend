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
        L1_RPC: Joi.string().required().description('L1 RPC url'),
        L2_RPC: Joi.string().required().description('L2 RPC url'),

        INFURA_API_KEY: Joi.string().required().description('Infura API key'),
        INFURA_SECRET_KEY: Joi.string().required().description('Infura API key secret'),

        LOCAL_CRED_CONTRACT_ADDRESS: Joi.string().required().description('Credential contract address Local'),
        LOCAL_ISSUER_CONTRACT_ADDRESS: Joi.string().required().description('Issuer contract address Local'),

        L1_CRED_CONTRACT_ADDRESS: Joi.string().required().description('Credential contract address L1 tesnet'),
        L1_ISSUER_CONTRACT_ADDRESS: Joi.string().required().description('Issuer contract address L1 tesnet'),

        L2_CRED_CONTRACT_ADDRESS: Joi.string().required().description('Certificates contract address L2 tesnet'),
        L2_ISSUER_CONTRACT_ADDRESS: Joi.string().required().description('Issuers contract address L2 tesnet'),

        ACCOUNT_ADDRESS: Joi.string().required().description('Account address'),
        PRIVATE_KEY: Joi.string().required().description('Private key'),

        IPFS_JWT_KEY: Joi.string().required().description('Pinata JWT key'),
        IPFS_API_KEY: Joi.string().required().description('Pinata API key'),
        IPFS_API_SECRET_KEY: Joi.string().required().description('Pinata secret API key'),
        IPFS_ACCESS_TOKEN_KEY_1: Joi.string().required().description('Access token key1'),

        FRAUD_DETECTION: Joi.string().required().description('Fraud detection url'),
        LOCAL_FD: Joi.string().required().description('Fraud detection local url'),

        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which verify email token expires'),
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
    LOCAL_CRED_CON_ADDR: envVars.LOCAL_CRED_CONTRACT_ADDRESS,
    LOCAL_ISSUER_CON_ADDR: envVars.LOCAL_ISSUER_CONTRACT_ADDRESS,
    
    // Layer 1
    L1_RPC: envVars.L1_RPC,
    L1_CRED_CON_ADDR: envVars.L1_CRED_CONTRACT_ADDRESS,
    L1_ISSUER_CON_ADDR: envVars.L1_ISSUER_CONTRACT_ADDRESS,
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
    IPFS_ACCESS_TOKEN_KEY_1: envVars.IPFS_ACC_TOK_1,
    // Fraud Detection
    FRAUD_DETECTION: envVars.FRAUD_DETECTION,
    LOCAL_FD: envVars.LOCAL_FD,
    // JWT
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    }
};
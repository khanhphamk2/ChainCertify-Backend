const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(3000),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
        RPC_PROVIDER: Joi.string().required().description('Provider RPC url'),
        RPC_L1: Joi.string().required().description('L1 RPC url'),
        RPC_L2: Joi.string().required().description('L2 RPC url'),
        INFURA_API_KEY: Joi.string().required().description('Infura API key'),
        INFURA_API_KEY_SECRET: Joi.string().required().description('Infura API key secret'),
        CREDENTIAL_CONTRACT_ADDRESS: Joi.string().required().description('Credential contract address L1'),
        ISSUER_CONTRACT_ADDRESS: Joi.string().required().description('Issuer contract address L2'),
        ARBISEPOLIA_ISSUERS_CONTRACT_ADDRESS: Joi.string().required().description('ArbiSepolia Issuers contract address'),
        ARBISEPOLIA_CERTIFICATES_CONTRACT_ADDRESS: Joi.string().required().description('ArbiSepolia Certificates contract address'),
        ACCOUNT_ADDRESS: Joi.string().required().description('Account address'),
        PRIVATE_KEY: Joi.string().required().description('Private key'),
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
    RPC_LOCAL: envVars.RPC_PROVIDER,
    L1_CERT: envVars.CREDENTIAL_CONTRACT_ADDRESS,
    L1_ISSUER: envVars.ISSUER_CONTRACT_ADDRESS,
    RPC_L1: envVars.RPC_L1,
    RPC_L2: envVars.RPC_L2,
    INFURA_API_KEY: envVars.INFURA_API_KEY,
    INFURA_API_KEY_SECRET: envVars.INFURA_API_KEY_SECRET,
    ARB_ISSUER: envVars.ARBISEPOLIA_ISSUERS_CONTRACT_ADDRESS,
    ARB_CERT: envVars.ARBISEPOLIA_CERTIFICATES_CONTRACT_ADDRESS,
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    }
};
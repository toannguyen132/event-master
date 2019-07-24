const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4000),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  HOST: Joi.string(),
  GOOGLE_API_KEY: Joi.string(),
  BRAINTREE_MERCHANT_ID: Joi.string(),
  BRAINTREE_PUBLIC_KEY: Joi.string(),
  BRAINTREE_PRIVATE_KEY: Joi.string(),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  host: envVars.HOST,
  googleApiKey: envVars.GOOGLE_API_KEY,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT
  },
  braintree: {
    merchantId: envVars.BRAINTREE_MERCHANT_ID,
    publicKey: envVars.BRAINTREE_PUBLIC_KEY,
    privateKey: envVars.BRAINTREE_PRIVATE_KEY,
  }
};

module.exports = config;

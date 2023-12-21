const dotenv = require('dotenv');
const { AccessEnv } = require('../common/utility');
const packageJSON = require('../../package.json');

const PACKAGE_VERSION = packageJSON.version;
dotenv.config({ silent: process.env.NODE_ENV === 'test' });

const ENV = AccessEnv('ENV'); // Configuration.isTest = process['env']['NODE_ENV'] === 'test'
const BUILD_NUMBER = AccessEnv('BUILD_NUMBER');

const HOST = AccessEnv('HOST');
const HOST_PORT = AccessEnv('HOST_PORT');
const HOST_SERVICE_NAME = AccessEnv('HOST_SERVICE_NAME');

// const DB_HOST = AccessEnv('DB_HOST');
// const DB_USER = AccessEnv('DB_USER');
// const DB_PASSWORD = AccessEnv('DB_PASSWORD');
// const DB_PORT = AccessEnv('DB_PORT');

const MONGO_URL = AccessEnv('MONGO_URL');

const HS256_TOKEN_SECRET = AccessEnv('HS256_TOKEN_SECRET');
const ACCESS_TOKEN_EXPIRESIN = AccessEnv('ACCESS_TOKEN_EXPIRESIN');
const REFRESH_TOKEN_EXPIRESIN = AccessEnv('REFRESH_TOKEN_EXPIRESIN');

const INTERNAL_LOAD_BALANCER = AccessEnv('INTERNAL_LOAD_BALANCER');
const SESSION_NAME = AccessEnv("SESSION_NAME", "logger_session");

module.exports = {
  packageVersion: PACKAGE_VERSION,
  isTest: ENV === 'test',
  env: ENV, // ['production'].includes(process['env']['NODE_ENV'])
  // apm: 'false', // const apmConfiguration = Configuration.apm;
  node: {
    url: `${HOST}:${HOST_PORT}`,
    pathPrefix: `/${HOST_SERVICE_NAME}/apis`,
    host: HOST,
    port: HOST_PORT,
    serviceName: HOST_SERVICE_NAME,
    buildNumber: BUILD_NUMBER,
  },
  // db: {
  //   client: 'mongodb',
  //   connection: {
  //     host: DB_HOST,
  //     user: DB_USER,
  //     port: DB_PORT,
  //     password: DB_PASSWORD,
  //     database: 'UserDB',
  //     charset: 'utf8mb4',
  //     timezone: 'UTC',
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     directory: './knex/migrations',
  //     tableName: 'knex_migrations',
  //   },
  // },
  mongodb: {
    url: MONGO_URL,
  },
  jwt: {
    HS256_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRESIN,
    REFRESH_TOKEN_EXPIRESIN,
  },
  url: {
    INTERNAL_LOAD_BALANCER,
  },
  session_name: SESSION_NAME,
};

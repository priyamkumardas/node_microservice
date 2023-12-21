const { AccessEnv } = require('../common/utility');
const CONSTANTS = require('../constants/constants');
const packageJSON = require('../../package.json');

const PACKAGE_VERSION = packageJSON.version;

const ENV = AccessEnv('NODE_ENV'); // Configuration.isTest = process['env']['NODE_ENV'] === 'test'
const BUILD_NUMBER = AccessEnv('BUILD_NUMBER');

const HOST = AccessEnv('HOST');
const HOST_PORT = AccessEnv('HOST_PORT');
const HOST_SERVICE_NAME = AccessEnv('HOST_SERVICE_NAME');
const SESSION_NAME = AccessEnv('SESSION_NAME', 'logger_session');

const AWS_BUCKET = AccessEnv('AWS_BUCKET');
const AWS_EXPIRATION = AccessEnv('AWS_EXPIRATION');

const AWS_QUEUE_URL = AccessEnv('AWS_QUEUE_URL');

const MONGO_DB_HOST = AccessEnv('MONGO_DB_HOST');
const MONGO_DB_USER = AccessEnv('MONGO_DB_USER');
const MONGO_DB_PASSWORD = AccessEnv('MONGO_DB_PASSWORD'); // env needs to changed here
const MONGO_DB_PORT = AccessEnv('MONGO_DB_PORT');
const MONGO_DB_CLUSTER = AccessEnv('MONGO_DB_CLUSTER');
const MONGO_DB_DATABASE = AccessEnv('MONGO_DB_DATABASE');
const MONGO_DB_COLLECTION = AccessEnv('MONGO_DB_COLLECTION');

const SQL_DB_HOST = AccessEnv('SQL_DB_HOST');
const SQL_DB_USER = AccessEnv('SQL_DB_USER');
const SQL_DB_PASSWORD = AccessEnv('SQL_DB_PASSWORD');
const SQL_DB_PORT = AccessEnv('SQL_DB_PORT', 5432);
const SQL_DB_NAME = AccessEnv('SQL_DB_NAME');
const SQL_DB_DIALECT = AccessEnv('SQL_DB_DIALECT');

const SYSTEM_TOKEN = AccessEnv('SYSTEM_TOKEN');
const LOAD_BALANCER = AccessEnv('LOAD_BALANCER');

const DISTANCE = AccessEnv('DISTANCE');
const IS_SUBSCRIBE_REQUIRED = AccessEnv('IS_SUBSCRIBE_REQUIRED');

const MEDIA_CDN = AccessEnv('MEDIA_CDN');
const MEDIA_S3 = AccessEnv('MEDIA_S3');
const BIZ_BASE_URL = AccessEnv('BIZ_BASE_URL');

const ELASTIC_APM_SERVER_URL = AccessEnv('ELASTIC_APM_SERVER_URL');
const ELASTIC_APM_SECRET_TOKEN = AccessEnv('ELASTIC_APM_SECRET_TOKEN');

const UNIQUE_SHOP_ID_TYPE = AccessEnv('UNIQUE_SHOP_ID_TYPE', CONSTANTS.ID.BASE_NUMERIC);

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

  aws: {
    s3: {
      bucket: AWS_BUCKET,
      urlExpirationTime: AWS_EXPIRATION,
    },
    queue: {
      queue_url: AWS_QUEUE_URL
    }
  },
  db: {
    client: 'mongodb',
    connection: {
      host: MONGO_DB_HOST,
      user: MONGO_DB_USER,
      port: MONGO_DB_PORT,
      password: MONGO_DB_PASSWORD,
      database: MONGO_DB_DATABASE,
      cluster: MONGO_DB_CLUSTER,
      collectin: MONGO_DB_COLLECTION,
      charset: 'utf8mb4',
      timezone: 'UTC',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './knex/migrations',
      tableName: 'knex_migrations',
    },
  },

  SqlDB: {
    client: 'pg',
    connection: {
      host: SQL_DB_HOST,
      user: SQL_DB_USER,
      port: SQL_DB_PORT,
      password: SQL_DB_PASSWORD,
      dialect: SQL_DB_DIALECT,
      database: SQL_DB_NAME,
      charset: 'utf8mb4',
      timezone: 'UTC',
    },
    debug: true,
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000000,
      createTimeoutMillis: 30000000,
      acquireTimeoutMillis: 30000000,
      propagateCreateError: false,
    },
    migrations: {
      directory: './knex/migrations',
      tableName: 'knex_migrations',
    },
  },
  UNIQUE_SHOP_ID_TYPE,
  system_token: SYSTEM_TOKEN,
  media_cdn: MEDIA_CDN,
  media_s3: MEDIA_S3,
  loadBalancer: LOAD_BALANCER,
  distance: DISTANCE,
  isSubscribeRequired: IS_SUBSCRIBE_REQUIRED,
  session_name: SESSION_NAME,
  bizBaseUrl: BIZ_BASE_URL,

  elasticApmServerUrl: ELASTIC_APM_SERVER_URL,
  elasticApmSecretToken: ELASTIC_APM_SECRET_TOKEN,
};

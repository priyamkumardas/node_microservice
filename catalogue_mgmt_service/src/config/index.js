const { AccessEnv } = require('../common/utility');
const packageJSON = require('../../package.json');

const PACKAGE_VERSION = packageJSON.version;

const ENV = AccessEnv('NODE_ENV'); // Configuration.isTest = process['env']['NODE_ENV'] === 'test'
const BUILD_NUMBER = AccessEnv('BUILD_NUMBER');

const HOST = AccessEnv('HOST');
const HOST_PORT = AccessEnv('HOST_PORT');
const HOST_SERVICE_NAME = AccessEnv('HOST_SERVICE_NAME');

const AWS_BUCKET = AccessEnv('AWS_BUCKET');
const AWS_EXPIRATION = AccessEnv('AWS_EXPIRATION');

const SQL_DB_HOST = AccessEnv('SQL_DB_HOST');
const SQL_DB_USER = AccessEnv('SQL_DB_USER');
const SQL_DB_PASSWORD = AccessEnv('SQL_DB_PASSWORD');
const SQL_DB_PORT = AccessEnv('SQL_DB_PORT', 5432);
const SQL_DB_NAME = AccessEnv('SQL_DB_NAME');
const SQL_DB_DIALECT = AccessEnv('SQL_DB_DIALECT');

const SQL_DB_NAME_META = AccessEnv('SQL_DB_NAME_META');

const MONGO_DB_HOST = AccessEnv('MONGO_DB_HOST');
const MONGO_DB_USER = AccessEnv('MONGO_DB_USER');
const MONGO_DB_PASSWORD = AccessEnv('MONGO_DB_PASSWORD');
const MONGO_DB_PORT = AccessEnv('MONGO_DB_PORT');
const MONGO_DB_CLUSTER = AccessEnv('MONGO_DB_CLUSTER');
const MONGO_DB_DATABASE = AccessEnv('MONGO_DB_DATABASE');
const MONGO_DB_COLLECTION = AccessEnv('MONGO_DB_COLLECTION');

const CDN_URL = AccessEnv('CDN_URL');
const LOADBALANCER = AccessEnv('LOAD_BALANCER');
const SYSTEMTOKEN = AccessEnv('SYSTEM_TOKEN');
const SESSION_NAME = AccessEnv('SESSION_NAME', 'logger_session');
const CATALOG_FOLDER = AccessEnv('CATALOG_FOLDER', 'catalog_url');

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
    metaConnection: {
      host: SQL_DB_HOST,
      user: SQL_DB_USER,
      port: SQL_DB_PORT,
      password: SQL_DB_PASSWORD,
      dialect: SQL_DB_DIALECT,
      database: SQL_DB_NAME_META,
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
  cdnUrl: CDN_URL,
  catalogFolder: CATALOG_FOLDER,
  loadBalancer: LOADBALANCER,
  system_token: SYSTEMTOKEN,
  session_name: SESSION_NAME,
};

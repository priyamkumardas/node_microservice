const { AccessEnv } = require('../common/utility');
const packageJSON = require('../../package.json');

const PACKAGE_VERSION = packageJSON.version;

const ENV = AccessEnv('NODE_ENV'); // Configuration.isTest = process['env']['NODE_ENV'] === 'test'
const BUILD_NUMBER = AccessEnv('BUILD_NUMBER');

const HOST = AccessEnv('HOST');
const HOST_PORT = AccessEnv('HOST_PORT');
const HOST_SERVICE_NAME = AccessEnv('HOST_SERVICE_NAME');

const MONGO_DB_HOST = AccessEnv('MONGO_DB_HOST');
const MONGO_DB_USER = AccessEnv('MONGO_DB_USER');
const MONGO_DB_PASSWORD = AccessEnv('MONGO_DB_PASSWORD'); // env needs to changed here
const MONGO_DB_PORT = AccessEnv('MONGO_DB_PORT');
const MONGO_DB_CLUSTER = AccessEnv('MONGO_DB_CLUSTER');
const MONGO_DB_DATABASE = AccessEnv('MONGO_DB_DATABASE');
const MONGO_DB_COLLECTION = AccessEnv('MONGO_DB_COLLECTION');
// const SYSTEM_TOKEN = AccessEnv('SYSTEM_TOKEN');

const RETRY_LIMIT = AccessEnv('RETRY_LIMIT');

const LOAD_BALANCER = AccessEnv('LOAD_BALANCER');
const SYSTEM_TOKEN = AccessEnv('SYSTEM_TOKEN');

const QUEUE_URL = AccessEnv('QUEUE_URL');
const SESSION_NAME = AccessEnv('SESSION_NAME', 'logger_session')


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
  db: {
    client: 'mongodb',
    connection: {
      host: MONGO_DB_HOST,
      USERNAME: MONGO_DB_USER,
      port: MONGO_DB_PORT,
      PASSWORD: MONGO_DB_PASSWORD,
      database: MONGO_DB_DATABASE,
      CLUSTER: MONGO_DB_CLUSTER,
      collection: MONGO_DB_COLLECTION,
      charset: 'utf8mb4',
      timezone: 'UTC',
    },
  },
  aws: {
    queue_url: QUEUE_URL,
  },
  LOAD_BALANCER,
  retryLimit: RETRY_LIMIT,
  systemToken: SYSTEM_TOKEN,
  sessionName: SESSION_NAME
};

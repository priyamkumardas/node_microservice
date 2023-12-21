const { AccessEnv } = require('../common/utility');
const packageJSON = require('../../package.json');

const PACKAGE_VERSION = packageJSON.version;

const ENV = AccessEnv('NODE_ENV'); // Configuration.isTest = process['env']['NODE_ENV'] === 'test'
const BUILD_NUMBER = AccessEnv('BUILD_NUMBER');

const HOST = AccessEnv('HOST');
const HOST_PORT = AccessEnv('HOST_PORT');
const HOST_SERVICE_NAME = AccessEnv('HOST_SERVICE_NAME');

const DB_URL = AccessEnv('DB_URL');

const SQL_DB_HOST = AccessEnv('SQL_DB_HOST');
const SQL_DB_USER = AccessEnv('SQL_DB_USER');
const SQL_DB_PASSWORD = AccessEnv('SQL_DB_PASSWORD');
const SQL_DB_PORT = AccessEnv('SQL_DB_PORT', 5432);
const SQL_DB_NAME = AccessEnv('SQL_DB_NAME');
const SQL_DB_DIALECT = AccessEnv('SQL_DB_DIALECT');

const INVITE_LIMIT = AccessEnv('INVITE_LIMIT');
const REMINDER_LIMIT = AccessEnv('REMINDER_LIMIT');

const HS256_TOKEN_SECRET = AccessEnv('HS256_TOKEN_SECRET');
const ACCESS_TOKEN_EXPIRESIN = AccessEnv('ACCESS_TOKEN_EXPIRESIN');
const REFRESH_TOKEN_EXPIRESIN = AccessEnv('REFRESH_TOKEN_EXPIRESIN');

const LOAD_BALANCER = AccessEnv('LOAD_BALANCER');

const SYSTEM_TOKEN = AccessEnv('SYSTEM_TOKEN');
const SESSION_NAME = AccessEnv('SESSION_NAME', 'logger_session');
const WELCOME = AccessEnv('WELCOME');
const CARE = AccessEnv('CARE');
const REPORT = AccessEnv('REPORT');

const AWS_BUCKET = AccessEnv('AWS_BUCKET');
const AWS_EXPIRATION = AccessEnv('AWS_EXPIRATION');

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
  monogURL: DB_URL,
  db: {
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
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './knex/migrations',
      tableName: 'knex_migrations',
    },
  },
  inviteLimit: parseInt(INVITE_LIMIT, 10),
  reminderLimit: parseInt(REMINDER_LIMIT, 10),
  jwt: {
    HS256_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRESIN,
    REFRESH_TOKEN_EXPIRESIN,
  },
  load_balancer: LOAD_BALANCER,
  system_token: SYSTEM_TOKEN,
  session_name: SESSION_NAME,
  email: {
    welcome: WELCOME,
    care: CARE,
    report: REPORT,
  },
};

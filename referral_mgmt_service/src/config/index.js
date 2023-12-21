const { AccessEnv } = require("../common/utility");
const packageJSON = require("../../package.json");

const PACKAGE_VERSION = packageJSON.version;

const ENV = AccessEnv("NODE_ENV"); // Configuration.isTest = process['env']['NODE_ENV'] === 'test'
const BUILD_NUMBER = AccessEnv("BUILD_NUMBER");

const HOST = AccessEnv("HOST");
const HOST_PORT = AccessEnv("HOST_PORT");
const HOST_SERVICE_NAME = AccessEnv("HOST_SERVICE_NAME");

const DB_HOST = AccessEnv("DB_HOST");
const DB_USER = AccessEnv("DB_USER");
const DB_PASSWORD = AccessEnv("DB_PASSWORD");
const DB_PORT = AccessEnv("DB_PORT", 3306);
const DB_URL = AccessEnv("DB_URL");

const INVITE_LIMIT = AccessEnv("INVITE_LIMIT");
const REMINDER_LIMIT = AccessEnv("REMINDER_LIMIT");

const HS256_TOKEN_SECRET = AccessEnv("HS256_TOKEN_SECRET");
const ACCESS_TOKEN_EXPIRESIN = AccessEnv("ACCESS_TOKEN_EXPIRESIN");
const REFRESH_TOKEN_EXPIRESIN = AccessEnv("REFRESH_TOKEN_EXPIRESIN");

const LOAD_BALANCER = AccessEnv("LOAD_BALANCER");

const SYSTEM_TOKEN = AccessEnv("SYSTEM_TOKEN");
const WELCOME = AccessEnv("WELCOME");
const SESSION_NAME = AccessEnv('SESSION_NAME', 'logger_session');

const REWARD_HOUSEHOLD_ORDER_COUNT = AccessEnv("REWARD_HOUSEHOLD_ORDER_COUNT")
const REWARD_RETAILER_ORDER_COUNT = AccessEnv("REWARD_RETAILER_ORDER_COUNT")
const REWARD_LOGISTICS_TRIP_COUNT = AccessEnv("REWARD_LOGISTICS_TRIP_COUNT")

module.exports = {
  packageVersion: PACKAGE_VERSION,
  isTest: ENV === "test",
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
  monogURL: DB_URL,
  db: {
    client: "mysql",
    connection: {
      host: DB_HOST,
      user: DB_USER,
      port: DB_PORT,
      password: DB_PASSWORD,
      database: "clubs",
      charset: "utf8mb4",
      timezone: "UTC",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./knex/migrations",
      tableName: "knex_migrations",
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
  emails: {
    welcome: WELCOME,
  },
  rewards: {
    rewardHouseholdOrderCount: REWARD_HOUSEHOLD_ORDER_COUNT,
    rewardRetailerOrderCount: REWARD_RETAILER_ORDER_COUNT,
    rewardLogisticsTripCount: REWARD_LOGISTICS_TRIP_COUNT
  }
};

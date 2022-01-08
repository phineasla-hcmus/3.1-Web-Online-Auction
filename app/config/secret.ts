import logger from '../utils/logger';

/**
 * @param key
 * @param defaultVal
 * @param isOptional default to `false`
 * @returns can return `undefined` if `isOption = true`
 */
const getEnv = (key: string, defaultVal?: any, isOptional = false) => {
  const env = process.env[key] || defaultVal;
  if (!env && !isOptional) {
    logger.error(`Missing ${key} environment variable`);
    process.exit(1);
  }
  return env;
};

export const DB_CONFIG = {
  host: getEnv('DB_HOST'),
  port: getEnv('DB_PORT'),
  user: getEnv('DB_USER'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_DATABASE'),
  ssl: {
    // Force unsecured connection to PlanetScale
    // https://www.w3resource.com/node.js/nodejs-mysql.php#SSL_options
    rejectUnauthorized: false,
  },
};
export const DB_POOL = {
  min: Number(getEnv('DB_POOL_MIN')),
  max: Number(getEnv('DB_POOL_MAX')),
};
export const SESSION_SECRET = getEnv('SESSION_SECRET');
export const RECAPTCHA_SECRET = getEnv('RECAPTCHA_SECRET');
export const RECAPTCHA_SITE = getEnv('RECAPTCHA_SITE');

export const MAIL_SENDER = getEnv('MAIL_SENDER');
export const MAIL_CLIENT_ID = getEnv('MAIL_CLIENT_ID');
export const MAIL_CLIENT_SECRET = getEnv('MAIL_CLIENT_SECRET');
export const MAIL_REFRESH_TOKEN = getEnv('MAIL_REFRESH_TOKEN');

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const COOKIE_MAX_AGE = 2 * DAY;

const KB = 1024;
const MB = 1024 * KB;

export const MAX_IMAGE_SIZE = 2 * MB;
export const MAX_IMAGES = 10;

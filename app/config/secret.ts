import logger from '../utils/logger';

/**
 * @param key
 * @param defaultVal
 * @param isOptional
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
};
export const DB_POOL = {
  min: Number(getEnv('DB_POOL_MIN')),
  max: Number(getEnv('DB_POOL_MAX')),
};
export const SESSION_SECRET = getEnv('SESSION_SECRET');
// export const RECAPTCHA_SECRET = getEnv('RECAPTCHA_SECRET');

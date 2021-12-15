import knexConfig from 'knex';
import { DB_CONFIG, DB_POOL } from './secret';

const config = {
  client: 'mysql2',
  connection: DB_CONFIG,
  pool: DB_POOL,
};

const knex = knexConfig(config);

export default knex;

import knexConfig from "knex";
import { DB_CONFIG, DB_POOL, DB_URL } from "./secret";

const knex = knexConfig({
  client: "mysql2",
  connection: DB_URL,
  pool: DB_POOL,
});

export default knex;

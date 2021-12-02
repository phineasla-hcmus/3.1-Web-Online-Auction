import knexConfig from "knex";
import { DB_CONFIG, DB_POOL } from "./secret";

const knex = knexConfig({
  client: "mysql2",
  connection: DB_CONFIG,
  pool: DB_POOL,
});

export default knex;

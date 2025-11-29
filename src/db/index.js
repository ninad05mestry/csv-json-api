import pg from "pg";
import config from "../config/env.js";

const { Pool } = pg;

export const pool = new Pool({
  host: config.db.host,
  database: config.db.name,
  user: config.db.user,
  password: config.db.pass,
  port: config.db.port
});

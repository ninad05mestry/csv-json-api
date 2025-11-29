import { pool } from "./db/index.js";

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL at:", res.rows[0].now);
    process.exit(0);
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1);
  }
})();

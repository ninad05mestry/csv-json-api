import dotenv from "dotenv";
dotenv.config();

export default {
  csvPath: process.env.CSV_PATH,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
  }
};

import mysql from "mysql2/promise";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

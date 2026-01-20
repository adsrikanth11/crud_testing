import dotenv from "dotenv";
import { truncateTables, initializeDatabase } from "./helpers/test-db.js";
import db from "../src/config/db.js";

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  console.log("🔧 Test environment setup");
  await initializeDatabase();
});

beforeEach(async () => {
  try {
    await truncateTables();
  } catch (err) {
    console.error("Failed to truncate tables:", err.message);
    throw err;
  }
});

afterAll(async () => {
  try {
    await db.end();
    console.log("🧹 Database connections closed");
  } catch (err) {
    console.error("Error closing database:", err.message);
  }
});

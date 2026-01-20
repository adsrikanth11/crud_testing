import db from "../../src/config/db.js";
import fs from "fs";
import path from "path";

const cleanSQL = (sql) => {
  // Remove comment lines (lines starting with --)
  const lines = sql.split("\n").filter((line) => !line.trim().startsWith("--"));

  // Join back and split by semicolon
  return lines
    .join("\n")
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);
};

export const initializeDatabase = async () => {
  try {
    const dbPath = path.resolve(process.cwd(), "database");

    console.log("📊 Initializing database (first time only)...");

    // Create users table if it doesn't exist
    try {
      const usersSQL = fs.readFileSync(path.join(dbPath, "users.sql"), "utf8");
      const usersStatements = cleanSQL(usersSQL);

      for (const statement of usersStatements) {
        if (statement.length > 0) {
          // Skip DROP TABLE and CREATE INDEX statements
          if (
            statement.toUpperCase().includes("DROP TABLE") ||
            statement.toUpperCase().includes("CREATE INDEX")
          ) {
            continue;
          }
          // Replace CREATE TABLE with CREATE TABLE IF NOT EXISTS
          const modifiedStatement = statement.replace(
            /CREATE TABLE\s+/i,
            "CREATE TABLE IF NOT EXISTS ",
          );
          await db.query(modifiedStatement);
        }
      }
      console.log("✅ Users table ready");
    } catch (err) {
      console.error("Error setting up users table:", err.message);
      throw err;
    }

    // Create products table if it doesn't exist
    try {
      const productsSQL = fs.readFileSync(
        path.join(dbPath, "products.sql"),
        "utf8",
      );
      const productsStatements = cleanSQL(productsSQL);

      for (const statement of productsStatements) {
        if (statement.length > 0) {
          // Skip DROP TABLE and CREATE INDEX statements
          if (
            statement.toUpperCase().includes("DROP TABLE") ||
            statement.toUpperCase().includes("CREATE INDEX")
          ) {
            continue;
          }
          // Replace CREATE TABLE with CREATE TABLE IF NOT EXISTS
          const modifiedStatement = statement.replace(
            /CREATE TABLE\s+/i,
            "CREATE TABLE IF NOT EXISTS ",
          );
          await db.query(modifiedStatement);
        }
      }
      console.log("✅ Products table ready");
    } catch (err) {
      console.error("Error setting up products table:", err.message);
      throw err;
    }

    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ Error initializing database:", err.message);
    throw err;
  }
};

export const truncateTables = async () => {
  try {
    await db.query("SET FOREIGN_KEY_CHECKS=0");
    await db.query("TRUNCATE TABLE users");
    await db.query("TRUNCATE TABLE products");
    await db.query("SET FOREIGN_KEY_CHECKS=1");
    console.log("✅ Tables truncated successfully");
  } catch (err) {
    // If tables don't exist, reinitialize
    if (err.message && err.message.includes("doesn't exist")) {
      console.log("🔄 Tables not found, initializing...");
      await initializeDatabase();
    } else {
      throw err;
    }
  }
};

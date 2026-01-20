import db from "../src/config/db.js";

export default async () => {
  try {
    console.log("Closing DB connections...");
    await db.end();
  } catch (err) {
    console.error("Error closing database:", err.message);
  }
};

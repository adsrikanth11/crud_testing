import db from "../../src/config/db.js";

export const truncateTables = async () => {
  await db.query("SET FOREIGN_KEY_CHECKS=0");
  await db.query("TRUNCATE TABLE products");
  await db.query("SET FOREIGN_KEY_CHECKS=1");
};

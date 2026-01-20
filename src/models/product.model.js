import db from "../config/db.js";

export default class Product {
  static async create(data) {
    if (!data.name || data.price === undefined) {
      throw new Error("Name and price are required");
    }
    const [result] = await db.query(
      "INSERT INTO products (name, price) VALUES (?, ?)",
      [data.name, parseFloat(data.price)],
    );
    return { id: result.insertId, ...data };
  }

  static async findAll() {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0] || null;
  }

  static async update(id, data) {
    if (!data.name || data.price === undefined) {
      throw new Error("Name and price are required");
    }
    const [result] = await db.query(
      "UPDATE products SET name=?, price=? WHERE id=?",
      [data.name, parseFloat(data.price), id],
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM products WHERE id=?", [id]);
    return result.affectedRows > 0;
  }
}

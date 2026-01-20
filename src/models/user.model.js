import db from "../config/db.js";
import bcrypt from "bcryptjs";

export default class User {
  static async create(data) {
    const { username, email, password, role = "user" } = data;

    if (!username || !email || !password) {
      throw new Error("Username, email, and password are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    // Check if user already exists
    const existingUser = await this.findByUsernameOrEmail(username, email);
    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role],
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await db.query(
      "SELECT id, username, email, role, is_active, created_at, updated_at FROM users WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  }

  static async findByUsername(username) {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  }

  static async findByUsernameOrEmail(username, email) {
    const [rows] = await db.query(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email],
    );
    return rows[0] || null;
  }

  static async findAll() {
    const [rows] = await db.query(
      "SELECT id, username, email, role, is_active, created_at, updated_at FROM users ORDER BY id DESC",
    );
    return rows;
  }

  static async update(id, data) {
    const { username, email, role } = data;
    const fields = [];
    const values = [];

    if (username !== undefined) {
      fields.push("username = ?");
      values.push(username);
    }
    if (email !== undefined) {
      fields.push("email = ?");
      values.push(email);
    }
    if (role !== undefined) {
      fields.push("role = ?");
      values.push(role);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const [result] = await db.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  static async updatePassword(id, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, id],
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async deactivate(id) {
    const [result] = await db.query(
      "UPDATE users SET is_active = FALSE WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }

  static async activate(id) {
    const [result] = await db.query(
      "UPDATE users SET is_active = TRUE WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

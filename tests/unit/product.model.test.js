import Product from "../../src/models/product.model.js";
import db from "../../src/config/db.js";

jest.mock("../../src/config/db.js");

describe("Product Model - Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a product successfully", async () => {
      db.query.mockResolvedValue([{ insertId: 1 }]);

      const result = await Product.create({ name: "Phone", price: 1000 });

      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO products (name, price) VALUES (?, ?)",
        ["Phone", 1000],
      );
      expect(result.id).toBe(1);
      expect(result.name).toBe("Phone");
      expect(result.price).toBe(1000);
    });

    it("should throw error when name is missing", async () => {
      await expect(Product.create({ price: 1000 })).rejects.toThrow(
        "Name and price are required",
      );
    });

    it("should throw error when price is missing", async () => {
      await expect(Product.create({ name: "Phone" })).rejects.toThrow(
        "Name and price are required",
      );
    });

    it("should convert price to float", async () => {
      db.query.mockResolvedValue([{ insertId: 1 }]);

      await Product.create({ name: "Phone", price: "999.99" });

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [
        "Phone",
        999.99,
      ]);
    });
  });

  describe("findAll", () => {
    it("should return all products ordered by id descending", async () => {
      const mockProducts = [
        { id: 2, name: "Laptop", price: 50000 },
        { id: 1, name: "Phone", price: 1000 },
      ];
      db.query.mockResolvedValue([mockProducts]);

      const result = await Product.findAll();

      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM products ORDER BY id DESC",
      );
      expect(result).toEqual(mockProducts);
    });

    it("should return empty array when no products", async () => {
      db.query.mockResolvedValue([[]]);

      const result = await Product.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("findById", () => {
    it("should find a product by id", async () => {
      const mockProduct = { id: 1, name: "Phone", price: 1000 };
      db.query.mockResolvedValue([[mockProduct]]);

      const result = await Product.findById(1);

      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM products WHERE id = ?",
        [1],
      );
      expect(result).toEqual(mockProduct);
    });

    it("should return null when product not found", async () => {
      db.query.mockResolvedValue([[]]);

      const result = await Product.findById(999);

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a product successfully", async () => {
      const mockProduct = { id: 1, name: "Laptop", price: 50000 };
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      db.query.mockResolvedValueOnce([[mockProduct]]);

      const result = await Product.update(1, { name: "Laptop", price: 50000 });

      expect(db.query).toHaveBeenNthCalledWith(
        1,
        "UPDATE products SET name=?, price=? WHERE id=?",
        ["Laptop", 50000, 1],
      );
      expect(result).toEqual(mockProduct);
    });

    it("should throw error when name is missing", async () => {
      await expect(Product.update(1, { price: 5000 })).rejects.toThrow(
        "Name and price are required",
      );
    });

    it("should return null when product not found", async () => {
      db.query.mockResolvedValue([{ affectedRows: 0 }]);

      const result = await Product.update(999, { name: "Item", price: 100 });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete a product successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await Product.delete(1);

      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM products WHERE id=?",
        [1],
      );
      expect(result).toBe(true);
    });

    it("should return false when product not found", async () => {
      db.query.mockResolvedValue([{ affectedRows: 0 }]);

      const result = await Product.delete(999);

      expect(result).toBe(false);
    });
  });
});

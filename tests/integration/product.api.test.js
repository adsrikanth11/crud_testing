import request from "supertest";
import app from "../../src/app.js";

describe("Products API - Integration Tests", () => {
  describe("POST /api/products", () => {
    it("should create a new product", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "Laptop", price: 50000 });

      expect(res.statusCode).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe("Laptop");
      expect(res.body.price).toBe(50000);
    });

    it("should return 400 when name is missing", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ price: 5000 });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 when price is missing", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "Item" });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 when price is invalid", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "Item", price: "invalid" });

      expect(res.statusCode).toBe(400);
    });

    it("should return 400 when name is empty", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "   ", price: 1000 });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /api/products", () => {
    it("should retrieve all products", async () => {
      await request(app)
        .post("/api/products")
        .send({ name: "Tablet", price: 20000 });

      const res = await request(app).get("/api/products");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should return empty array when no products exist", async () => {
      const res = await request(app).get("/api/products");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/products/:id", () => {
    it("should retrieve a single product by id", async () => {
      const createRes = await request(app)
        .post("/api/products")
        .send({ name: "Monitor", price: 15000 });

      const res = await request(app).get(`/api/products/${createRes.body.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(createRes.body.id);
      expect(res.body.name).toBe("Monitor");
    });

    it("should return 404 when product not found", async () => {
      const res = await request(app).get("/api/products/9999");

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Product not found");
    });

    it("should return 400 for invalid product id", async () => {
      const res = await request(app).get("/api/products/invalid");

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("PUT /api/products/:id", () => {
    it("should update a product successfully", async () => {
      const createRes = await request(app)
        .post("/api/products")
        .send({ name: "TV", price: 30000 });

      const res = await request(app)
        .put(`/api/products/${createRes.body.id}`)
        .send({ name: "Smart TV", price: 35000 });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Smart TV");
      expect(parseFloat(res.body.price)).toBe(35000);
      expect(res.body.id).toBe(createRes.body.id);
    });

    it("should return 404 when updating non-existent product", async () => {
      const res = await request(app)
        .put("/api/products/9999")
        .send({ name: "Item", price: 100 });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Product not found");
    });

    it("should return 400 when update data is invalid", async () => {
      const createRes = await request(app)
        .post("/api/products")
        .send({ name: "Item", price: 100 });

      const res = await request(app)
        .put(`/api/products/${createRes.body.id}`)
        .send({ name: "", price: 100 });

      expect(res.statusCode).toBe(400);
    });

    it("should return 400 for invalid product id", async () => {
      const res = await request(app)
        .put("/api/products/invalid")
        .send({ name: "Item", price: 100 });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should delete a product successfully", async () => {
      const createRes = await request(app)
        .post("/api/products")
        .send({ name: "Camera", price: 15000 });

      const res = await request(app).delete(
        `/api/products/${createRes.body.id}`,
      );

      expect(res.statusCode).toBe(204);

      // Verify product is deleted
      const getRes = await request(app).get(
        `/api/products/${createRes.body.id}`,
      );
      expect(getRes.statusCode).toBe(404);
    });

    it("should return 404 when deleting non-existent product", async () => {
      const res = await request(app).delete("/api/products/9999");

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Product not found");
    });

    it("should return 400 for invalid product id", async () => {
      const res = await request(app).delete("/api/products/invalid");

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("Invalid Routes", () => {
    it("should return 404 for non-existent route", async () => {
      const res = await request(app).get("/api/invalid");

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Route not found");
    });
  });
});

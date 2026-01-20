import request from "supertest";
import app from "../../src/app.js";

describe("Error & 404 Handler Middlewares - Integration Tests", () => {
  describe("404 Not Found Handler", () => {
    it("should return 404 for non-existent route", async () => {
      const res = await request(app).get("/api/nonexistent");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "Route not found");
      expect(res.body).toHaveProperty("status", 404);
      expect(res.body).toHaveProperty("path", "/api/nonexistent");
      expect(res.body).toHaveProperty("method", "GET");
    });

    it("should return 404 for POST to non-existent route", async () => {
      const res = await request(app)
        .post("/api/invalid/endpoint")
        .send({ data: "test" });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Route not found");
      expect(res.body.method).toBe("POST");
    });

    it("should return 404 for PUT to non-existent route", async () => {
      const res = await request(app)
        .put("/unknown/path")
        .send({ data: "test" });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Route not found");
      expect(res.body.method).toBe("PUT");
    });

    it("should return 404 for DELETE to non-existent route", async () => {
      const res = await request(app).delete("/api/missing");

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Route not found");
      expect(res.body.method).toBe("DELETE");
    });

    it("should include path information in 404 response", async () => {
      const paths = ["/test", "/api/v1/users", "/static/assets"];

      for (const path of paths) {
        const res = await request(app).get(path);
        expect(res.body.path).toBe(path);
      }
    });
  });

  describe("Error Handler Middleware", () => {
    it("should catch errors thrown by controllers", async () => {
      // This test verifies that errors thrown in routes/controllers
      // are caught and properly formatted by the error handler
      const res = await request(app)
        .post("/api/products")
        .send({ name: "Test", price: -100 });

      // The validation middleware should prevent this, but if an error occurs
      expect([400, 500]).toContain(res.statusCode);
    });

    it("should return proper error response format", async () => {
      const res = await request(app).get("/api/invalid");

      expect(res.body).toHaveProperty("error");
      expect(res.body).toHaveProperty("status");
      expect(typeof res.body.error).toBe("string");
      expect(typeof res.body.status).toBe("number");
    });

    it("should not expose stack trace in test environment", async () => {
      const res = await request(app).get("/api/nonexistent");

      // In test environment (NODE_ENV=test), stack trace should not be included
      // only in development environment
      expect(res.body).not.toHaveProperty("stack");
    });
  });

  describe("Middleware Order and Interaction", () => {
    it("should route valid requests correctly before hitting 404", async () => {
      const res = await request(app).get("/");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("should route valid API requests correctly", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "Test Product", price: 100 });

      expect(res.statusCode).toBe(201);
      expect(res.body.id).toBeDefined();
    });

    it("should return validation error before 404 handler", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "", price: 100 });

      // Should be validation error (400) not 404
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(JSON.stringify(res.body.errors)).toContain("name");
    });

    it("should return 404 only for undefined routes", async () => {
      const res = await request(app).get("/random/undefined/path");

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Route not found");
    });
  });
});

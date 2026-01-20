import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
} from "../../src/validations/productValidation.js";

describe("Product Validation Schemas - Unit Tests", () => {
  describe("createProductSchema", () => {
    it("should validate a correct product creation payload", () => {
      const payload = {
        name: "Laptop",
        price: 50000.99,
      };

      const { error } = createProductSchema.validate(payload);
      expect(error).toBeUndefined();
    });

    it("should fail when name is missing", () => {
      const payload = {
        price: 50000,
      };

      const { error } = createProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("required");
    });

    it("should fail when name is less than 3 characters", () => {
      const payload = {
        name: "ab",
        price: 50000,
      };

      const { error } = createProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("at least 3 characters");
    });

    it("should fail when name exceeds 255 characters", () => {
      const payload = {
        name: "a".repeat(256),
        price: 50000,
      };

      const { error } = createProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("not exceed 255 characters");
    });

    it("should fail when name is not a string", () => {
      const payload = {
        name: 123,
        price: 50000,
      };

      const { error } = createProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("string");
    });

    it("should fail when price is missing", () => {
      const payload = {
        name: "Laptop",
      };

      const { error } = createProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("required");
    });

    it("should fail when price is not a number", () => {
      const payload = {
        name: "Laptop",
        price: "invalid",
      };

      const { error } = createProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("number");
    });

    it("should fail when price is not positive", () => {
      const payload = {
        name: "Laptop",
        price: -50000,
      };

      const { error } = createProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("positive");
    });

    it("should fail when price is zero", () => {
      const payload = {
        name: "Laptop",
        price: 0,
      };

      const { error } = createProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("positive");
    });

    it("should accept decimal prices", () => {
      const payload = {
        name: "Laptop",
        price: 50000.99,
      };

      const { error } = createProductSchema.validate(payload);
      expect(error).toBeUndefined();
    });

    it("should remove unknown fields", () => {
      const payload = {
        name: "Laptop",
        price: 50000,
        unknownField: "should be removed",
      };

      const { value } = createProductSchema.validate(payload, {
        stripUnknown: true,
      });
      expect(value).not.toHaveProperty("unknownField");
      expect(Object.keys(value).length).toBe(2);
    });
  });

  describe("updateProductSchema", () => {
    it("should validate an update with name and price", () => {
      const payload = {
        name: "Updated Laptop",
        price: 55000,
      };

      const { error } = updateProductSchema.validate(payload);
      expect(error).toBeUndefined();
    });

    it("should validate an update with only name", () => {
      const payload = {
        name: "Updated Laptop",
      };

      const { error } = updateProductSchema.validate(payload);
      expect(error).toBeUndefined();
    });

    it("should validate an update with only price", () => {
      const payload = {
        price: 55000,
      };

      const { error } = updateProductSchema.validate(payload);
      expect(error).toBeUndefined();
    });

    it("should validate an empty update (all fields optional)", () => {
      const payload = {};

      const { error } = updateProductSchema.validate(payload);
      expect(error).toBeUndefined();
    });

    it("should fail when name is less than 3 characters", () => {
      const payload = {
        name: "ab",
      };

      const { error } = updateProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("at least 3 characters");
    });

    it("should fail when name exceeds 255 characters", () => {
      const payload = {
        name: "a".repeat(256),
      };

      const { error } = updateProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("not exceed 255 characters");
    });

    it("should fail when price is not positive", () => {
      const payload = {
        price: -50000,
      };

      const { error } = updateProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("positive");
    });

    it("should fail when price is zero", () => {
      const payload = {
        price: 0,
      };

      const { error } = updateProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("positive");
    });

    it("should remove unknown fields", () => {
      const payload = {
        name: "Updated Laptop",
        unknownField: "should be removed",
      };

      const { value } = updateProductSchema.validate(payload, {
        stripUnknown: true,
      });
      expect(value).not.toHaveProperty("unknownField");
    });
  });

  describe("getProductSchema", () => {
    it("should validate a correct product ID", () => {
      const payload = {
        id: 1,
      };

      const { error } = getProductSchema.validate(payload);
      expect(error).toBeUndefined();
    });

    it("should fail when id is missing", () => {
      const payload = {};

      const { error } = getProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("required");
    });

    it("should fail when id is not a number", () => {
      const payload = {
        id: "invalid",
      };

      const { error } = getProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("number");
    });

    it("should fail when id is not positive", () => {
      const payload = {
        id: -1,
      };

      const { error } = getProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("positive");
    });

    it("should fail when id is zero", () => {
      const payload = {
        id: 0,
      };

      const { error } = getProductSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("positive");
    });

    it("should accept large positive IDs", () => {
      const payload = {
        id: 999999,
      };

      const { error } = getProductSchema.validate(payload);
      expect(error).toBeUndefined();
    });
  });
});

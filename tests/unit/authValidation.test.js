import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../../src/validations/authValidation.js";

describe("Auth Validation Schemas - Unit Tests", () => {
  describe("registerSchema", () => {
    it("should validate a correct registration payload", () => {
      const payload = {
        username: "newuser",
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const { error } = registerSchema.validate(payload);
      expect(error).toBeUndefined();
    });

    it("should fail when username is missing", () => {
      const payload = {
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const { error } = registerSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("required");
    });

    it("should fail when username is less than 3 characters", () => {
      const payload = {
        username: "ab",
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const { error } = registerSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("at least 3 characters");
    });

    it("should fail when username exceeds 30 characters", () => {
      const payload = {
        username: "a".repeat(31),
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const { error } = registerSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("not exceed 30 characters");
    });

    it("should fail when username contains non-alphanumeric characters", () => {
      const payload = {
        username: "user@name",
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const { error } = registerSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("alphanumeric");
    });

    it("should fail when email is invalid", () => {
      const payload = {
        username: "newuser",
        email: "invalid-email",
        password: "password123",
        confirmPassword: "password123",
      };

      const { error } = registerSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("valid email");
    });

    it("should fail when email is missing", () => {
      const payload = {
        username: "newuser",
        password: "password123",
        confirmPassword: "password123",
      };

      const { error } = registerSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("required");
    });

    it("should fail when password is missing", () => {
      const payload = {
        username: "newuser",
        email: "user@example.com",
        confirmPassword: "password123",
      };

      const { error } = registerSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("required");
    });

    it("should fail when password is less than 6 characters", () => {
      const payload = {
        username: "newuser",
        email: "user@example.com",
        password: "pass",
        confirmPassword: "pass",
      };

      const { error } = registerSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("at least 6 characters");
    });

    it("should fail when confirmPassword does not match password", () => {
      const payload = {
        username: "newuser",
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password456",
      };

      const { error } = registerSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("do not match");
    });

    it("should fail when confirmPassword is missing", () => {
      const payload = {
        username: "newuser",
        email: "user@example.com",
        password: "password123",
      };

      const { error } = registerSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("required");
    });

    it("should remove unknown fields", () => {
      const payload = {
        username: "newuser",
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
        unknownField: "should be removed",
      };

      const { value } = registerSchema.validate(payload, {
        stripUnknown: true,
      });
      expect(value).not.toHaveProperty("unknownField");
      expect(Object.keys(value).length).toBe(4);
    });
  });

  describe("loginSchema", () => {
    it("should validate a correct login payload", () => {
      const payload = {
        username: "user",
        password: "password123",
      };

      const { error } = loginSchema.validate(payload);
      expect(error).toBeUndefined();
    });

    it("should fail when username is missing", () => {
      const payload = {
        password: "password123",
      };

      const { error } = loginSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("required");
    });

    it("should fail when password is missing", () => {
      const payload = {
        username: "user",
      };

      const { error } = loginSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("required");
    });

    it("should accept any username format", () => {
      const payload = {
        username: "user@123",
        password: "password123",
      };

      const { error } = loginSchema.validate(payload);
      expect(error).toBeUndefined();
    });

    it("should fail when username is not a string", () => {
      const payload = {
        username: 123,
        password: "password123",
      };

      const { error } = loginSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("string");
    });

    it("should fail when password is not a string", () => {
      const payload = {
        username: "user",
        password: 123,
      };

      const { error } = loginSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("string");
    });
  });

  describe("refreshTokenSchema", () => {
    it("should validate a correct refresh token payload", () => {
      const payload = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      };

      const { error } = refreshTokenSchema.validate(payload);
      expect(error).toBeUndefined();
    });

    it("should fail when token is missing", () => {
      const payload = {};

      const { error } = refreshTokenSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("required");
    });

    it("should fail when token is not a string", () => {
      const payload = {
        token: 123,
      };

      const { error } = refreshTokenSchema.validate(payload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("string");
    });

    it("should accept any string as token", () => {
      const payload = {
        token: "any-string-token",
      };

      const { error } = refreshTokenSchema.validate(payload);
      expect(error).toBeUndefined();
    });
  });
});

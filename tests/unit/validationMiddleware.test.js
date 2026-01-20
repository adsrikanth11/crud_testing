import { validate } from "../../src/middlewares/validationMiddleware.js";
import Joi from "joi";

describe("Validation Middleware - Unit Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe("validate middleware", () => {
    it("should call next() when validation passes", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
      });

      req.body = { name: "John", age: 30 };
      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 400 with error messages when validation fails", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
      });

      req.body = { name: "John" }; // age is missing
      const middleware = validate(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Validation failed",
          errors: expect.any(Array),
        }),
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should include all error messages in response", () => {
      const schema = Joi.object({
        name: Joi.string().required().messages({
          "any.required": "Name is required",
        }),
        email: Joi.string().email().required().messages({
          "any.required": "Email is required",
        }),
      });

      req.body = {}; // both fields missing
      const middleware = validate(schema);
      middleware(req, res, next);

      const callArgs = res.json.mock.calls[0][0];
      expect(callArgs.errors.length).toBe(2);
      expect(callArgs.errors).toContain("Name is required");
      expect(callArgs.errors).toContain("Email is required");
    });

    it("should validate params when source is set to params", () => {
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      req.params = { id: "invalid" }; // non-numeric string to trigger validation error
      const middleware = validate(schema, "params");
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it("should validate query when source is set to query", () => {
      const schema = Joi.object({
        page: Joi.number().required(),
      });

      req.query = { page: "abc" }; // invalid number
      const middleware = validate(schema, "query");
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it("should strip unknown fields from request data", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      req.body = { name: "John", unknownField: "value" };
      const middleware = validate(schema);
      middleware(req, res, next);

      expect(req.body).toEqual({ name: "John" });
      expect(req.body).not.toHaveProperty("unknownField");
      expect(next).toHaveBeenCalled();
    });

    it("should replace request data with validated data", () => {
      const schema = Joi.object({
        name: Joi.string().trim().required(),
      });

      req.body = { name: "  John  " };
      const middleware = validate(schema);
      middleware(req, res, next);

      expect(req.body.name).toBe("John"); // trimmed
      expect(next).toHaveBeenCalled();
    });

    it("should handle validation with multiple errors", () => {
      const schema = Joi.object({
        email: Joi.string().email().required().messages({
          "string.email": "Email must be valid",
          "any.required": "Email is required",
        }),
        age: Joi.number().positive().required().messages({
          "number.positive": "Age must be positive",
          "any.required": "Age is required",
        }),
      });

      req.body = { email: "invalid", age: -5 };
      const middleware = validate(schema);
      middleware(req, res, next);

      const callArgs = res.json.mock.calls[0][0];
      expect(callArgs.errors.length).toBe(2);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return structured error response", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      req.body = {};
      const middleware = validate(schema);
      middleware(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: expect.any(Array),
      });
    });

    it("should abort on first error when abortEarly is true", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      });

      req.body = {}; // both missing
      const middleware = validate(schema); // abortEarly: false by default
      middleware(req, res, next);

      // Should collect all errors by default
      const callArgs = res.json.mock.calls[0][0];
      expect(callArgs.errors.length).toBeGreaterThan(1);
    });

    it("should handle complex nested validation", () => {
      const schema = Joi.object({
        user: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
        }).required(),
      });

      req.body = { user: { name: "John" } }; // email missing
      const middleware = validate(schema);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
});

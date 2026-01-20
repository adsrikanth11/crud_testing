import {
  authenticate,
  authorize,
  authenticateOptional,
  JWT_SECRET,
} from "../../src/middlewares/authMiddleware.js";
import jwt from "jsonwebtoken";

describe("Auth Middleware", () => {
  describe("authenticate middleware", () => {
    it("should call next() if valid token is provided", (done) => {
      const token = jwt.sign(
        {
          id: 1,
          username: "testuser",
          email: "test@example.com",
          role: "user",
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      const req = {
        cookies: { token },
      };
      const res = {};
      const next = jest.fn();

      authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.username).toBe("testuser");
      done();
    });

    it("should return 401 if no token is provided", (done) => {
      const req = {
        cookies: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "No token provided. Authentication required.",
      });
      expect(next).not.toHaveBeenCalled();
      done();
    });

    it("should return 401 if token is invalid", (done) => {
      const req = {
        cookies: { token: "invalid-token" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid token",
      });
      expect(next).not.toHaveBeenCalled();
      done();
    });

    it("should return 401 if token is expired", (done) => {
      const expiredToken = jwt.sign(
        {
          id: 1,
          username: "testuser",
          email: "test@example.com",
          role: "user",
        },
        JWT_SECRET,
        { expiresIn: "-1h" },
      );

      const req = {
        cookies: { token: expiredToken },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Token has expired",
      });
      expect(next).not.toHaveBeenCalled();
      done();
    });
  });

  describe("authorize middleware", () => {
    it("should call next() if user has required role", (done) => {
      const req = {
        user: {
          id: 1,
          username: "adminuser",
          role: "admin",
        },
      };
      const res = {};
      const next = jest.fn();
      const middleware = authorize(["admin"]);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      done();
    });

    it("should call next() if user has one of multiple required roles", (done) => {
      const req = {
        user: {
          id: 1,
          username: "testuser",
          role: "user",
        },
      };
      const res = {};
      const next = jest.fn();
      const middleware = authorize(["admin", "user"]);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      done();
    });

    it("should return 403 if user does not have required role", (done) => {
      const req = {
        user: {
          id: 1,
          username: "testuser",
          role: "user",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      const middleware = authorize(["admin"]);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Access denied. Required role: admin",
      });
      expect(next).not.toHaveBeenCalled();
      done();
    });

    it("should return 401 if no user is authenticated", (done) => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      const middleware = authorize(["admin"]);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Authentication required",
      });
      expect(next).not.toHaveBeenCalled();
      done();
    });
  });

  describe("authenticateOptional middleware", () => {
    it("should set req.user if valid token is provided", (done) => {
      const token = jwt.sign(
        {
          id: 1,
          username: "testuser",
          email: "test@example.com",
          role: "user",
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      const req = {
        cookies: { token },
      };
      const res = {};
      const next = jest.fn();

      authenticateOptional(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.username).toBe("testuser");
      expect(next).toHaveBeenCalled();
      done();
    });

    it("should call next() if no token is provided", (done) => {
      const req = {
        cookies: {},
      };
      const res = {};
      const next = jest.fn();

      authenticateOptional(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
      done();
    });

    it("should call next() if token is invalid", (done) => {
      const req = {
        cookies: { token: "invalid-token" },
      };
      const res = {};
      const next = jest.fn();

      authenticateOptional(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
      done();
    });

    it("should call next() if token is expired", (done) => {
      const expiredToken = jwt.sign(
        {
          id: 1,
          username: "testuser",
        },
        JWT_SECRET,
        { expiresIn: "-1h" },
      );

      const req = {
        cookies: { token: expiredToken },
      };
      const res = {};
      const next = jest.fn();

      authenticateOptional(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
      done();
    });
  });
});

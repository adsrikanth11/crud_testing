import errorHandler from "../../src/middlewares/errorHandler.js";

describe("Error Handler Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      path: "/test",
      method: "GET",
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();

    // Mock console methods
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it("should handle error with custom status code", () => {
    const error = new Error("Bad Request");
    error.status = 400;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Bad Request",
      status: 400,
    });
  });

  it("should handle error with statusCode property", () => {
    const error = new Error("Conflict");
    error.statusCode = 409;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "Conflict",
      status: 409,
    });
  });

  it("should default to 500 status when no status provided", () => {
    const error = new Error("Internal error");

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal error",
      status: 500,
    });
  });

  it("should use default error message when error message is empty", () => {
    const error = new Error("");
    error.status = 500;

    errorHandler(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
      status: 500,
    });
  });

  it("should log error to console", () => {
    const error = new Error("Test error");
    error.status = 400;

    errorHandler(error, req, res, next);

    expect(console.error).toHaveBeenCalledWith(
      "[Error] Status: 400, Message: Test error",
    );
    expect(console.error).toHaveBeenCalledWith(error.stack);
  });

  it("should include stack trace in development environment", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const error = new Error("Dev error");
    error.status = 500;

    errorHandler(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Dev error",
        status: 500,
        stack: error.stack,
      }),
    );

    process.env.NODE_ENV = originalEnv;
  });

  it("should not include stack trace in production environment", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const error = new Error("Prod error");
    error.status = 500;

    errorHandler(error, req, res, next);

    const callArgs = res.json.mock.calls[0][0];
    expect(callArgs).not.toHaveProperty("stack");

    process.env.NODE_ENV = originalEnv;
  });

  it("should handle errors with multiple properties", () => {
    const error = new Error("Complex error");
    error.status = 422;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error: "Complex error",
      status: 422,
    });
  });
});

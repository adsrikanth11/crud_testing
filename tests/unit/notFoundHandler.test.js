import notFoundHandler from "../../src/middlewares/notFoundHandler.js";

describe("Not Found Handler Middleware", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      path: "/api/invalid",
      method: "GET",
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should return 404 status code", () => {
    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return proper error response with route not found message", () => {
    notFoundHandler(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Route not found",
        status: 404,
      }),
    );
  });

  it("should include request path in response", () => {
    req.path = "/api/products/invalid";

    notFoundHandler(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/api/products/invalid",
      }),
    );
  });

  it("should include request method in response", () => {
    req.method = "POST";

    notFoundHandler(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("should handle different HTTP methods", () => {
    const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

    methods.forEach((method) => {
      req.method = method;
      res.json.mockClear();

      notFoundHandler(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          method: method,
        }),
      );
    });
  });

  it("should handle various paths", () => {
    const paths = ["/unknown", "/api/v2/users", "/static/file"];

    paths.forEach((path) => {
      req.path = path;
      res.json.mockClear();

      notFoundHandler(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          path: path,
        }),
      );
    });
  });

  it("should return all required properties in response", () => {
    req.path = "/test/path";
    req.method = "DELETE";

    notFoundHandler(req, res);

    const responseBody = res.json.mock.calls[0][0];

    expect(responseBody).toHaveProperty("error");
    expect(responseBody).toHaveProperty("status");
    expect(responseBody).toHaveProperty("path");
    expect(responseBody).toHaveProperty("method");
  });
});

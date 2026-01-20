import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";

/**
 * Helper function to register a test user
 * @param {Object} userData - User data for registration
 * @returns {Promise<Object>} Response object with user data and token
 */
export async function registerTestUser(userData = {}) {
  const defaultData = {
    username: "testuser" + Math.random().toString(36).substring(7),
    email: `test${Math.random().toString(36).substring(7)}@example.com`,
    password: "password123",
    confirmPassword: "password123",
    role: "user",
  };

  const finalData = { ...defaultData, ...userData };

  const response = await request(app)
    .post("/api/auth/register")
    .send(finalData);

  return {
    status: response.status,
    body: response.body,
    headers: response.headers,
    user: response.body.user,
  };
}

/**
 * Helper function to login a test user
 * @param {string} username - Username to login
 * @param {string} password - Password to login
 * @returns {Promise<Object>} Response object with token and user data
 */
export async function loginTestUser(username, password) {
  const response = await request(app).post("/api/auth/login").send({
    username,
    password,
  });

  const token = extractTokenFromResponse(response);

  return {
    status: response.status,
    body: response.body,
    headers: response.headers,
    user: response.body.user,
    token,
  };
}

/**
 * Helper function to extract token from response headers
 * @param {Object} response - Response object from supertest
 * @returns {string|null} JWT token or null
 */
export function extractTokenFromResponse(response) {
  const setCookieHeader = response.headers["set-cookie"];
  if (!setCookieHeader || !Array.isArray(setCookieHeader)) {
    return null;
  }

  const tokenCookie = setCookieHeader.find((cookie) =>
    cookie.startsWith("token="),
  );
  if (!tokenCookie) {
    return null;
  }

  return tokenCookie.split("token=")[1].split(";")[0];
}

/**
 * Helper function to make authenticated request
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} path - API path
 * @param {string} token - JWT token
 * @param {Object} body - Request body (for POST, PUT requests)
 * @returns {Promise<Object>} Response object
 */
export async function makeAuthenticatedRequest(
  method,
  path,
  token,
  body = null,
) {
  let req = request(app)[method.toLowerCase()](path);

  if (token) {
    req = req.set("Cookie", `token=${token}`);
  }

  if (body) {
    req = req.send(body);
  }

  return req;
}

/**
 * Helper function to create a test user in database directly
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user object
 */
export async function createTestUserInDB(userData = {}) {
  const defaultData = {
    username: "testuser" + Math.random().toString(36).substring(7),
    email: `test${Math.random().toString(36).substring(7)}@example.com`,
    password: "password123",
    role: "user",
  };

  const finalData = { ...defaultData, ...userData };

  try {
    const user = await User.create(finalData);
    return user;
  } catch (error) {
    throw new Error(`Failed to create test user: ${error.message}`);
  }
}

/**
 * Helper function to get a valid JWT token for testing
 * @param {Object} userData - User data to create
 * @returns {Promise<string>} Valid JWT token
 */
export async function getValidToken(userData = {}) {
  const registerResponse = await registerTestUser(userData);

  if (registerResponse.status !== 201) {
    throw new Error("Failed to register test user");
  }

  return extractTokenFromResponse({
    headers: registerResponse.headers,
  });
}

/**
 * Helper function to verify authentication error response
 * @param {Object} response - Response object
 * @returns {boolean} True if response is authentication error
 */
export function isAuthenticationError(response) {
  return (
    response.status === 401 &&
    response.body &&
    response.body.success === false &&
    response.body.message
  );
}

/**
 * Helper function to verify authorization error response
 * @param {Object} response - Response object
 * @returns {boolean} True if response is authorization error
 */
export function isAuthorizationError(response) {
  return (
    response.status === 403 &&
    response.body &&
    response.body.success === false &&
    response.body.message
  );
}

/**
 * Helper function to clean up test database
 * @returns {Promise<void>}
 */
export async function cleanupTestDatabase() {
  try {
    // This will be implemented based on your database setup
    // For now, individual tests should handle cleanup
  } catch (error) {
    console.error("Failed to cleanup test database:", error);
  }
}

/**
 * Helper function to verify JWT token validity
 * @param {string} token - JWT token to verify
 * @returns {boolean} True if token is valid
 */
export function isValidToken(token) {
  if (!token) return false;

  try {
    // Token structure validation
    const parts = token.split(".");
    return parts.length === 3; // JWT has 3 parts: header.payload.signature
  } catch {
    return false;
  }
}

/**
 * Helper function to wait for a specific duration
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Helper function to batch create test users
 * @param {number} count - Number of users to create
 * @param {Object} baseData - Base user data template
 * @returns {Promise<Array>} Array of created users
 */
export async function createMultipleTestUsers(count, baseData = {}) {
  const users = [];

  for (let i = 0; i < count; i++) {
    const userData = {
      ...baseData,
      username: `testuser${i}${Math.random().toString(36).substring(7)}`,
      email: `test${i}${Math.random().toString(36).substring(7)}@example.com`,
    };

    const response = await registerTestUser(userData);
    if (response.status === 201) {
      users.push(response.user);
    }
  }

  return users;
}

# JWT Cookie-Based Authentication & Authorization Guide

## Overview

This project implements a complete JWT (JSON Web Token) cookie-based authentication and authorization system with role-based access control (RBAC). The implementation includes comprehensive unit and integration tests.

## Features

- ✅ **User Registration** - Create new user accounts with email validation
- ✅ **User Login** - Authenticate users with credentials
- ✅ **JWT Tokens** - Secure token-based authentication
- ✅ **HTTP-Only Cookies** - Secure token storage in cookies
- ✅ **Password Hashing** - bcryptjs for secure password storage
- ✅ **Role-Based Access Control** - Support for user and admin roles
- ✅ **Token Refresh** - Ability to refresh expired tokens
- ✅ **User Deactivation** - Disable user accounts
- ✅ **Comprehensive Testing** - Unit and integration tests

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install:

- `jsonwebtoken` - JWT token generation and verification
- `bcryptjs` - Password hashing
- `cookie-parser` - Parse cookies from requests
- `express` - Web framework
- `mysql2` - Database driver

### 2. Setup Database

Create the users table in your MySQL database:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
```

Or use the provided SQL file:

```bash
mysql -u root -p your_database < database/users.sql
```

### 3. Environment Configuration

Update your `.env` file with:

```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=7d
NODE_ENV=production
```

For testing, update `.env.test`:

```env
JWT_SECRET=test-secret-key
JWT_EXPIRY=1h
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=test_db
NODE_ENV=test
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "newuser",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### 2. Login User

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "newuser",
    "email": "user@example.com",
    "role": "user"
  }
}

Headers:
Set-Cookie: token=<JWT_TOKEN>; HttpOnly; SameSite=Strict; ...
```

#### 3. Get Current User

```
GET /api/auth/me
Cookie: token=<JWT_TOKEN>

Response: 200 OK
{
  "success": true,
  "user": {
    "id": 1,
    "username": "newuser",
    "email": "user@example.com",
    "role": "user",
    "is_active": true,
    "created_at": "2024-01-20T...",
    "updated_at": "2024-01-20T..."
  }
}
```

#### 4. Refresh Token

```
POST /api/auth/refresh-token
Cookie: token=<JWT_TOKEN>

Response: 200 OK
{
  "success": true,
  "message": "Token refreshed successfully"
}

Headers:
Set-Cookie: token=<NEW_JWT_TOKEN>; HttpOnly; SameSite=Strict; ...
```

#### 5. Logout User

```
POST /api/auth/logout
Cookie: token=<JWT_TOKEN>

Response: 200 OK
{
  "success": true,
  "message": "Logout successful"
}

Headers:
Set-Cookie: token=; Max-Age=0; HttpOnly; SameSite=Strict; ...
```

## Architecture

### File Structure

```
src/
├── app.js                          # Express app configuration
├── server.js                       # Server startup
├── config/
│   └── db.js                       # Database connection
├── models/
│   ├── user.model.js               # User model with auth methods
│   └── product.model.js            # Product model
├── controllers/
│   ├── auth.controller.js          # Auth logic (register, login, etc)
│   └── product.controller.js       # Product logic
├── middlewares/
│   ├── authMiddleware.js           # JWT verification & authorization
│   ├── errorHandler.js             # Error handling
│   └── notFoundHandler.js          # 404 handling
└── routes/
    ├── auth.routes.js              # Auth endpoints
    └── product.routes.js           # Product endpoints

tests/
├── unit/
│   ├── user.model.test.js          # User model tests
│   ├── authMiddleware.test.js      # Middleware tests
│   ├── errorHandler.test.js
│   ├── notFoundHandler.test.js
│   └── product.model.test.js
├── integration/
│   ├── auth.api.test.js            # Auth endpoint tests
│   ├── product.api.test.js
│   └── errorHandler.integration.test.js
└── helpers/
    ├── test-db.js
    └── auth-test-helper.js         # Auth testing utilities
```

### Core Components

#### 1. User Model (`src/models/user.model.js`)

```javascript
// Static methods available:
User.create(data); // Register new user
User.findById(id); // Get user by ID
User.findByUsername(username); // Find user by username
User.findByEmail(email); // Find user by email
User.update(id, data); // Update user info
User.updatePassword(id, newPassword); // Change password
User.delete(id); // Delete user
User.verifyPassword(plain, hash); // Check password match
User.deactivate(id); // Deactivate user
User.activate(id); // Activate user
User.isValidEmail(email); // Validate email format
```

#### 2. Auth Controller (`src/controllers/auth.controller.js`)

```javascript
AuthController.register(req, res); // Handle user registration
AuthController.login(req, res); // Handle user login
AuthController.logout(req, res); // Handle logout
AuthController.getCurrentUser(); // Get authenticated user
AuthController.refreshToken(); // Refresh JWT token
```

#### 3. Auth Middleware (`src/middlewares/authMiddleware.js`)

```javascript
authenticate; // Verify JWT token (required)
authorize(roles); // Check user role (required)
authenticateOptional; // Verify JWT token if present (optional)
```

#### 4. Auth Routes (`src/routes/auth.routes.js`)

```javascript
POST / api / auth / register; // Public
POST / api / auth / login; // Public
POST / api / auth / logout; // Protected
GET / api / auth / me; // Protected
POST / api / auth / refresh - token; // Protected
```

## Usage Examples

### Node.js/JavaScript Client

```javascript
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// 1. Register
const registerResponse = await axios.post(`${API_URL}/auth/register`, {
  username: "john_doe",
  email: "john@example.com",
  password: "SecurePass123",
  confirmPassword: "SecurePass123",
});

// 2. Login (cookie is automatically stored)
const loginResponse = await axios.post(
  `${API_URL}/auth/login`,
  {
    username: "john_doe",
    password: "SecurePass123",
  },
  {
    withCredentials: true, // Important: send cookies
  },
);

// 3. Get current user
const userResponse = await axios.get(`${API_URL}/auth/me`, {
  withCredentials: true, // Send the token cookie
});

console.log(userResponse.data.user);

// 4. Logout
await axios.post(
  `${API_URL}/auth/logout`,
  {},
  {
    withCredentials: true,
  },
);
```

### cURL Commands

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }' \
  -c cookies.txt

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123"
  }' \
  -c cookies.txt

# Get current user (using saved cookies)
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt

# Refresh token
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -b cookies.txt
```

## Protecting Routes

### Basic Authentication

```javascript
import { authenticate } from "./src/middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

// Protected route - requires valid token
router.get("/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
```

### Role-Based Authorization

```javascript
import { authenticate, authorize } from "./src/middlewares/authMiddleware.js";

// Only admin users can access
router.delete("/users/:id", authenticate, authorize(["admin"]), (req, res) => {
  // Admin-only logic
});

// User or admin can access
router.get(
  "/dashboard",
  authenticate,
  authorize(["user", "admin"]),
  (req, res) => {
    // User or admin logic
  },
);
```

## Running Tests

### All Tests

```bash
npm test
```

### Unit Tests Only

```bash
npm run test:unit
```

### Integration Tests Only

```bash
npm run test:integration
```

### Watch Mode

```bash
npm run test:watch
```

### With Coverage Report

```bash
npm run test:coverage
```

## Test Files

### Unit Tests

1. **`tests/unit/user.model.test.js`** - User model functionality
   - User creation and validation
   - Password hashing and verification
   - User lookup and updates
   - Account activation/deactivation

2. **`tests/unit/authMiddleware.test.js`** - Auth middleware
   - Token verification
   - Role-based authorization
   - Error handling

### Integration Tests

1. **`tests/integration/auth.api.test.js`** - Full auth flow
   - Registration process
   - Login process
   - Token management
   - Protected endpoints
   - Complete authentication workflow

### Test Helpers

**`tests/helpers/auth-test-helper.js`** provides utility functions:

```javascript
import {
  registerTestUser, // Register a test user via API
  loginTestUser, // Login a test user
  extractTokenFromResponse, // Extract token from response
  makeAuthenticatedRequest, // Make authenticated requests
  createTestUserInDB, // Create user in database
  getValidToken, // Get valid JWT token
  isAuthenticationError, // Check auth error response
  isAuthorizationError, // Check authz error response
  isValidToken, // Validate token format
  createMultipleTestUsers, // Batch create users
} from "../helpers/auth-test-helper.js";
```

## Security Considerations

### ✅ Best Practices Implemented

1. **Password Security**
   - Passwords hashed with bcryptjs (salt rounds: 10)
   - Passwords never returned in API responses
   - Passwords never logged

2. **Cookie Security**
   - `HttpOnly` flag prevents JavaScript access
   - `SameSite=Strict` prevents CSRF attacks
   - `Secure` flag set in production (HTTPS only)

3. **Token Security**
   - JWT signed with secret key
   - Tokens include expiration
   - Token rotation on refresh

4. **Database Security**
   - Input validation on all endpoints
   - SQL injection prevention (prepared statements)
   - Unique constraints on username and email

5. **API Security**
   - All sensitive endpoints require authentication
   - Role-based access control
   - Account deactivation support
   - Rate limiting recommended (not implemented)

### 🔒 Recommendations for Production

```env
# Use a strong, random secret
JWT_SECRET=<generate-with-crypto-library>

# Set appropriate expiry time
JWT_EXPIRY=24h

# Enable HTTPS
NODE_ENV=production

# Implement rate limiting
# npm install express-rate-limit

# Add request validation
# npm install joi

# Monitor authentication logs
# Implement audit trail

# Use environment-specific cookie settings
# Update Secure flag based on NODE_ENV
```

### Rate Limiting Example

```javascript
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
});

// Apply to auth routes
router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.login);
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "All fields are required"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "No token provided. Authentication required."
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied. Required role: admin"
}
```

### 409 Conflict (User Exists)

```json
{
  "success": false,
  "message": "Username or email already exists"
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Indexes

```sql
CREATE INDEX idx_username ON users(username);  -- Fast username lookup
CREATE INDEX idx_email ON users(email);        -- Fast email lookup
```

## Migration Notes

### From Previous Version

If updating from a previous version without auth:

1. Run the users.sql migration
2. Add auth dependencies: `npm install`
3. Update app.js to include auth middleware
4. Update .env with JWT_SECRET
5. Run tests: `npm test`

## Troubleshooting

### Issue: "No token provided"

- Ensure cookies are being sent with requests
- Check `withCredentials: true` in axios/fetch
- Verify cookie is set in browser DevTools

### Issue: "Token has expired"

- Use `/api/auth/refresh-token` to get new token
- Implement automatic token refresh in client
- Adjust `JWT_EXPIRY` if needed

### Issue: "Invalid username or password"

- Verify credentials are correct
- Check user exists in database
- Ensure user account is active

### Issue: "Access denied. Required role: admin"

- User does not have admin role
- Check user.role in database
- Only admins can access admin-protected endpoints

## Performance Optimization

### Recommended Indexes

```sql
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);
CREATE INDEX idx_is_active ON users(is_active);
```

### Connection Pooling

Already configured in `src/config/db.js`:

```javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  queueLimit: 0,
  // ...
});
```

## Future Enhancements

- [ ] Two-Factor Authentication (2FA)
- [ ] OAuth2 integration (Google, GitHub)
- [ ] Social login (Facebook, Twitter)
- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Account recovery options
- [ ] Login history and activity logs
- [ ] IP whitelisting
- [ ] Session management
- [ ] Refresh token rotation

## License

ISC

## Support

For issues or questions, refer to the test files for implementation examples.

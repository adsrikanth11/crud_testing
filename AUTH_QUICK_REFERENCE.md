# Authentication Quick Reference

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create users table (run once)
mysql -u root -p your_database < database/users.sql

# 3. Configure environment
# Update .env with JWT_SECRET and other settings
```

## Core Features

| Feature       | Endpoint                  | Method | Auth Required | Role Required |
| ------------- | ------------------------- | ------ | ------------- | ------------- |
| Register      | `/api/auth/register`      | POST   | No            | -             |
| Login         | `/api/auth/login`         | POST   | No            | -             |
| Get Profile   | `/api/auth/me`            | GET    | Yes           | -             |
| Refresh Token | `/api/auth/refresh-token` | POST   | Yes           | -             |
| Logout        | `/api/auth/logout`        | POST   | Yes           | -             |

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:unit              # Unit tests only
npm run test:integration       # Integration tests only
npm run test:watch            # Watch mode
npm run test:coverage         # With coverage report
```

## API Examples

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user1",
    "email": "user1@example.com",
    "password": "pass123",
    "confirmPassword": "pass123"
  }' -c cookies.txt
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user1",
    "password": "pass123"
  }' -c cookies.txt
```

### Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me -b cookies.txt
```

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
```

## Middleware Usage

### Require Authentication

```javascript
import { authenticate } from "./src/middlewares/authMiddleware.js";

router.get("/protected", authenticate, (req, res) => {
  console.log(req.user); // { id, username, email, role }
  res.json({ data: "sensitive" });
});
```

### Require Specific Role

```javascript
import { authenticate, authorize } from "./src/middlewares/authMiddleware.js";

// Admin only
router.delete("/users/:id", authenticate, authorize(["admin"]), (req, res) => {
  // Only admins can access
});

// User or Admin
router.get(
  "/dashboard",
  authenticate,
  authorize(["user", "admin"]),
  (req, res) => {
    // Both user and admin can access
  },
);
```

### Optional Authentication

```javascript
import { authenticateOptional } from "./src/middlewares/authMiddleware.js";

router.get("/public", authenticateOptional, (req, res) => {
  if (req.user) {
    res.json({ message: "Hello " + req.user.username });
  } else {
    res.json({ message: "Hello Guest" });
  }
});
```

## Database Model

### User Model Methods

```javascript
import User from "./src/models/user.model.js";

// Create
const user = await User.create({
  username: "john",
  email: "john@example.com",
  password: "pass123",
  role: "user",
});

// Read
const user = await User.findById(1);
const user = await User.findByUsername("john");
const user = await User.findByEmail("john@example.com");
const users = await User.findAll();

// Update
const updated = await User.update(1, { role: "admin" });
const updated = await User.updatePassword(1, "newpass123");

// Delete
const success = await User.delete(1);

// Deactivate/Activate
await User.deactivate(1);
await User.activate(1);

// Verify
const isValid = await User.verifyPassword("password", hashedPassword);
const isEmail = User.isValidEmail("test@example.com");
```

## Test Helpers

```javascript
import {
  registerTestUser,
  loginTestUser,
  createTestUserInDB,
  extractTokenFromResponse,
  makeAuthenticatedRequest,
  getValidToken,
  isAuthenticationError,
  isAuthorizationError,
} from "../helpers/auth-test-helper.js";

// Register test user via API
const result = await registerTestUser({
  username: "testuser",
  email: "test@example.com",
  password: "pass123",
});
const token = result.token;

// Create test user in database
const user = await createTestUserInDB({
  username: "dbuser",
  email: "dbuser@example.com",
});

// Make authenticated request
const response = await makeAuthenticatedRequest("get", "/api/auth/me", token);

// Check error types
if (isAuthenticationError(response)) {
  console.log("Auth failed");
}
if (isAuthorizationError(response)) {
  console.log("Access denied");
}
```

## Response Formats

### Success (200/201)

```json
{
  "success": true,
  "message": "Operation successful",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "role": "user",
    "is_active": true
  }
}
```

### Error (4xx)

```json
{
  "success": false,
  "message": "Error description"
}
```

## Common Error Codes

| Code | Meaning      | Solution                        |
| ---- | ------------ | ------------------------------- |
| 400  | Bad Request  | Check required fields           |
| 401  | Unauthorized | Login or provide valid token    |
| 403  | Forbidden    | User doesn't have required role |
| 409  | Conflict     | Username/email already exists   |

## Cookie Information

- **Name**: `token`
- **HttpOnly**: Yes (prevent XSS)
- **SameSite**: Strict (prevent CSRF)
- **Secure**: Yes in production
- **MaxAge**: 7 days (configurable)

## Environment Variables

```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=test_db
PORT=3000
```

## Files Added

```
src/
├── controllers/auth.controller.js
├── models/user.model.js
├── middlewares/authMiddleware.js
└── routes/auth.routes.js

tests/
├── unit/user.model.test.js
├── unit/authMiddleware.test.js
├── integration/auth.api.test.js
└── helpers/auth-test-helper.js

database/
└── users.sql

docs/
└── AUTH_IMPLEMENTATION.md (this file)
```

## Next Steps

1. **Install dependencies**: `npm install`
2. **Setup database**: Run `database/users.sql`
3. **Configure JWT**: Set `JWT_SECRET` in `.env`
4. **Run tests**: `npm test`
5. **Start server**: `npm start`
6. **Test endpoints**: Use provided cURL/Postman examples

## Support & Documentation

- Full API documentation: See `AUTH_IMPLEMENTATION.md`
- Test examples: See `tests/integration/auth.api.test.js`
- Implementation examples: See `src/controllers/auth.controller.js`

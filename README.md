# CRUD Testing Project

A Node.js REST API project with comprehensive testing coverage using Jest, including unit tests, integration tests, and database testing.

## Project Overview

This project demonstrates best practices for building a scalable Node.js REST API with a focus on testing. It includes:

- User authentication with JWT tokens
- Product management API endpoints
- Database integration with MySQL
- Secure password hashing with bcryptjs
- Authentication and authorization middleware
- Comprehensive error handling middleware
- Unit and integration tests with Jest
- Test coverage reporting

## Project Structure

```
crud_testing/
├── src/                          # Main application code
│   ├── app.js                   # Express app configuration
│   ├── server.js                # Server entry point
│   ├── config/
│   │   └── db.js                # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication business logic
│   │   └── product.controller.js # Product business logic
│   ├── middlewares/
│   │   ├── authMiddleware.js    # JWT authentication & authorization
│   │   ├── errorHandler.js      # Global error handling
│   │   └── notFoundHandler.js   # 404 handling
│   ├── models/
│   │   ├── user.model.js        # User data models
│   │   └── product.model.js     # Product data models
│   └── routes/
│       ├── auth.routes.js       # Authentication routes
│       └── product.routes.js    # Product API routes
├── tests/                        # Test files
│   ├── setup.js                 # Test setup configuration
│   ├── teardown.js              # Test cleanup
│   ├── helpers/
│   │   └── test-db.js           # Database test utilities
│   ├── unit/                    # Unit tests
│   │   ├── user.model.test.js
│   │   ├── authMiddleware.test.js
│   │   ├── authValidation.test.js
│   │   ├── product.model.test.js
│   │   ├── productValidation.test.js
│   │   ├── validationMiddleware.test.js
│   │   ├── errorHandler.test.js
│   │   └── notFoundHandler.test.js
│   └── integration/             # Integration tests
│       ├── auth.api.test.js
│       ├── product.api.test.js
│       └── errorHandler.integration.test.js
├── coverage/                     # Code coverage reports
├── database/
│   ├── users.sql               # User schema
│   └── products.sql            # Product schema
├── jest.config.mjs             # Jest configuration
├── package.json                # Project dependencies
└── README.md                   # This file
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL database

### Setup Steps

1. **Clone or navigate to the project directory:**

   ```bash
   cd crud_testing
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory (if needed)
   - Update database connection details in `src/config/db.js`

4. **Set up the database:**
   ```bash
   mysql -u root -p < database/products.sql
   ```

## Running the Application

### Start the Server

```bash
npm start
```

The server will start on the configured port (default: 3000).

### Run Tests

**Run all tests:**

```bash
npm test
```

**Run tests in watch mode:**

```bash
npm run test:watch
```

**Run specific test file:**

```bash
npm test -- tests/unit/product.model.test.js
```

**Generate coverage report:**

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory with HTML reports in `coverage/lcov-report/`.

**Run only unit tests:**

```bash
npm run test:unit
```

**Run only integration tests:**

```bash
npm run test:integration
```

**Run specific test file:**

```bash
npm test -- tests/unit/user.model.test.js
npm test -- tests/unit/authValidation.test.js
npm test -- tests/integration/auth.api.test.js
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `POST /api/auth/logout` - Logout and clear refresh token
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (requires authentication)

### Product Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Test Coverage

The project includes comprehensive testing with unit and integration tests:

### Unit Tests

#### User Model Tests (`user.model.test.js`)

- User creation with valid/invalid data
- Admin user creation
- Email and username uniqueness constraints
- Password validation (minimum 6 characters)
- Email format validation
- User retrieval by ID, username, and email
- Password verification
- User update and delete operations
- User activation and deactivation

#### Auth Middleware Tests (`authMiddleware.test.js`)

- Valid token authentication
- Missing token handling
- Invalid token rejection
- Expired token handling
- Authorization role checks
- Optional authentication middleware

#### Auth Validation Tests (`authValidation.test.js`)

- Registration schema validation (username, email, password requirements)
- Login schema validation
- Refresh token schema validation
- Username constraints (3-30 characters, alphanumeric)
- Email format validation
- Password matching validation
- Unknown field stripping

#### Product Validation Tests (`productValidation.test.js`)

- Product creation schema validation
- Product update schema validation
- Product retrieval schema validation
- Name length constraints (3-255 characters)
- Price validation (positive numbers, decimal support)
- Unknown field removal

#### Validation Middleware Tests (`validationMiddleware.test.js`)

- Validation middleware functionality
- Error response formatting
- Multiple error handling
- Body, params, and query validation
- Unknown field stripping
- Structured error responses

#### Error Handler Tests (`errorHandler.test.js`)

- Global error handling
- Error response formatting
- HTTP status code mapping

#### Not Found Handler Tests (`notFoundHandler.test.js`)

- 404 error handling
- Not found route responses

### Integration Tests

#### Auth API Tests (`auth.api.test.js`)

- User registration with valid credentials
- Secure HTTP-only cookie setting
- Password mismatch validation
- Missing required field validation
- Duplicate username/email handling
- User login with correct credentials
- Invalid credential rejection
- User logout functionality
- Refresh token generation and usage
- Current user retrieval with authentication
- Token expiration handling

#### Product API Tests (`product.api.test.js`)

- Product creation via API
- Product retrieval (all and by ID)
- Product update functionality
- Product deletion
- Error handling for invalid inputs
- Not found responses

#### Error Handler Integration Tests (`errorHandler.integration.test.js`)

- Global error handling in API responses
- Error message formatting
- Status code mapping

Run `npm run test:coverage` to view detailed coverage statistics.

## Test Examples and Best Practices

### Running Tests Efficiently

```bash
# Run all tests with coverage
npm run test:coverage

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run specific test file
npm test -- tests/unit/user.model.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="auth"

# Run tests with verbose output
npm test -- --verbose

# Clear Jest cache (useful when having issues)
npx jest --clearCache
```

### Test Organization

- **Unit Tests**: Test individual components (models, middleware, validation)
- **Integration Tests**: Test API endpoints and component interactions
- **Database Tests**: All tests include database initialization and cleanup via setup.js

### Database Testing Strategy

The test infrastructure includes:

- Automatic table creation before tests
- Table truncation after each test for data isolation
- Proper cleanup after all tests complete
- Support for both users and products tables

## Configuration

### Database Configuration

Database connection settings are configured in [src/config/db.js](src/config/db.js). Update the connection parameters as needed:

```javascript
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "crud_testing",
});
```

### Authentication Configuration

Authentication is configured with JWT tokens:

- Set `JWT_SECRET` environment variable for token signing (default: `your-secret-key-change-in-production`)
- Access tokens expire in 7 days
- Refresh tokens are stored in secure HTTP-only cookies
- Token validation via [src/middlewares/authMiddleware.js](src/middlewares/authMiddleware.js)

### Jest Configuration

Test configuration is managed in [jest.config.mjs](jest.config.mjs). Includes:

- Test environment setup
- Database initialization with users and products tables
- Table truncation before each test
- Coverage thresholds
- Module resolution
- Test timeouts

## Authentication Usage

### User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password",
    "confirmPassword": "secure_password"
  }'
```

### User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure_password"
  }'
```

Returns JWT token in response and refresh token in secure cookie.

### Using JWT Token

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json"
```

Requires valid refresh token in cookies.

## Documentation

Additional documentation files:

- [TESTING_QUICK_REFERENCE.md](TESTING_QUICK_REFERENCE.md) - Quick guide to running tests
- [TESTING_CONFIGURATION.md](TESTING_CONFIGURATION.md) - Detailed testing setup information
- [PROJECT_ASSESSMENT.md](PROJECT_ASSESSMENT.md) - Project assessment details

## Troubleshooting

### Database Connection Issues

- Ensure MySQL is running
- Verify connection credentials in `src/config/db.js`
- Check that the database has been created with the SQL schema

### Test Failures

- Clear the Jest cache: `npx jest --clearCache`
- Ensure all dependencies are installed: `npm install`
- Check that environment variables are properly configured

### Coverage Issues

- Run tests with coverage flag: `npm run test:coverage`
- Check the HTML report in `coverage/lcov-report/index.html`

## Scripts

Available npm scripts defined in `package.json`:

- `npm start` - Start the application
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

## Dependencies

Key dependencies:

- **express** - Web framework
- **mysql** - Database driver
- **jest** - Testing framework
- **supertest** - HTTP assertion library (for integration tests)

See [package.json](package.json) for complete list of dependencies.

## Best Practices Demonstrated

- ✅ Separation of concerns (controllers, models, routes)
- ✅ Comprehensive error handling
- ✅ Database abstraction layer
- ✅ Unit and integration test coverage
- ✅ Middleware pattern for cross-cutting concerns
- ✅ Consistent API error responses
- ✅ Test utilities and helpers

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Implement the feature
3. Ensure all tests pass
4. Maintain or improve code coverage

## License

This project is for educational and testing purposes.

---

**Last Updated:** January 2026

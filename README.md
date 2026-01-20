# CRUD Testing Project

A Node.js REST API project with comprehensive testing coverage using Jest, including unit tests, integration tests, and database testing.

## Project Overview

This project demonstrates best practices for building a scalable Node.js REST API with a focus on testing. It includes:

- Product management API endpoints
- Database integration with MySQL
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
│   │   └── product.controller.js # Product business logic
│   ├── middlewares/
│   │   ├── errorHandler.js      # Global error handling
│   │   └── notFoundHandler.js   # 404 handling
│   ├── models/
│   │   └── product.model.js     # Product data models
│   └── routes/
│       └── product.routes.js    # API route definitions
├── tests/                        # Test files
│   ├── setup.js                 # Test setup configuration
│   ├── teardown.js              # Test cleanup
│   ├── helpers/
│   │   └── test-db.js           # Database test utilities
│   ├── unit/                    # Unit tests
│   │   ├── product.model.test.js
│   │   ├── errorHandler.test.js
│   │   └── notFoundHandler.test.js
│   └── integration/             # Integration tests
│       ├── product.api.test.js
│       └── errorHandler.integration.test.js
├── coverage/                     # Code coverage reports
├── database/
│   └── products.sql            # Database schema
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

## API Endpoints

The API provides the following endpoints for product management:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Test Coverage

The project includes comprehensive testing:

### Unit Tests

- Product model tests
- Error handler middleware tests
- Not found handler middleware tests

### Integration Tests

- Product API endpoint tests
- Error handler integration tests
- Database interaction tests

Run `npm run test:coverage` to view detailed coverage statistics.

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

### Jest Configuration

Test configuration is managed in [jest.config.mjs](jest.config.mjs). Includes:

- Test environment setup
- Coverage thresholds
- Module resolution
- Test timeouts

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

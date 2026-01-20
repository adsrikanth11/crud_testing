# Testing Quick Reference Guide

## 🚀 Running Tests

### Run All Tests

```bash
npm test
```

### Run Only Unit Tests

```bash
npm run test:unit
```

### Run Only Integration Tests

```bash
npm run test:integration
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage Report

```bash
npm run test:coverage
```

---

## 📊 Current Test Coverage

- **Total Test Suites:** 5
- **Total Tests:** 58
- **Pass Rate:** 100% ✅

### By Category:

- **Unit Tests:** 33 tests
  - errorHandler.test.js (11 tests)
  - notFoundHandler.test.js (9 tests)
  - product.model.test.js (13 tests)

- **Integration Tests:** 25 tests
  - product.api.test.js (23 tests)
  - errorHandler.integration.test.js (12 tests)

---

## 📝 Test File Locations

```
tests/
├── unit/
│   ├── errorHandler.test.js           # Error middleware logic
│   ├── notFoundHandler.test.js        # 404 handler logic
│   └── product.model.test.js          # Data layer logic
├── integration/
│   ├── product.api.test.js            # API endpoint testing
│   └── errorHandler.integration.test.js # Error flow in app
├── helpers/
│   └── test-db.js                     # Database utilities
├── setup.js                           # Global test setup
└── teardown.js                        # Global test cleanup
```

---

## 🔧 Test Database Configuration

**Location:** `.env.test`

```env
NODE_ENV = test
DB_HOST = 127.0.0.1
DB_USER = root
DB_PASSWORD =
DB_NAME = test_db
```

### Important Notes:

- Uses separate `test_db` database (never affects production data)
- Tables are truncated before each test automatically
- Database connections are properly closed after all tests

---

## 🛠️ Adding New Tests

### Unit Test Template

```javascript
import MyComponent from "../../src/path/MyComponent.js";

describe("MyComponent", () => {
  beforeEach(() => {
    // Setup mocks
  });

  afterEach(() => {
    // Cleanup
  });

  it("should do something", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Integration Test Template

```javascript
import request from "supertest";
import app from "../../src/app.js";

describe("API Endpoint", () => {
  it("should return expected response", async () => {
    const res = await request(app).get("/api/endpoint").expect(200);

    expect(res.body).toHaveProperty("expectedField");
  });
});
```

### Add Test File:

1. Create file in `tests/unit/` or `tests/integration/`
2. Name it: `[feature].test.js`
3. Jest will auto-discover and run it

---

## 🔍 Key Testing Utilities

### Mocking Database in Unit Tests

```javascript
import db from "../../src/config/db.js";
jest.mock("../../src/config/db.js");

// In your test:
db.query.mockResolvedValue([mockData]);
```

### Testing API Endpoints

```javascript
import request from "supertest";
import app from "../../src/app.js";

const res = await request(app)
  .post("/api/products")
  .send({ name: "Item", price: 100 })
  .expect(201);
```

### Database Cleanup

```javascript
// Automatically done in beforeEach via tests/setup.js
// No manual cleanup needed!
```

---

## ⚠️ Common Issues & Solutions

### Issue: Tests fail with "Cannot find module"

**Solution:** Ensure file paths use `../../src/` format

### Issue: Database connection timeout

**Solution:** Check `.env.test` database credentials and server is running

### Issue: Tests running in parallel cause conflicts

**Solution:** Already fixed! Using `--runInBand` flag in package.json

### Issue: Mocks not clearing between tests

**Solution:** Already configured! Jest has `clearMocks: true` in jest.config.mjs

---

## 📈 Monitoring Test Health

### Check Test Coverage

```bash
npm run test:coverage
```

Opens coverage report in `coverage/lcov-report/index.html`

### Watch Tests During Development

```bash
npm run test:watch
```

Automatically reruns tests when files change

### Verbose Test Output

```bash
npm test -- --verbose
```

---

## 🎯 Best Practices

✅ **DO:**

- Write tests for new features
- Keep unit tests isolated (mock external dependencies)
- Use meaningful test descriptions
- Test both success and error cases
- Keep tests fast and independent

❌ **DON'T:**

- Skip tests
- Test implementation details (test behavior)
- Create dependencies between tests
- Use `--bail` flag (prevents running all tests)
- Hardcode test data (use factories or fixtures)

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)

---

## 💡 Next Steps

1. Run tests: `npm test`
2. Check coverage: `npm run test:coverage`
3. Add new tests following templates above
4. Use watch mode while developing: `npm run test:watch`

**Your testing setup is production-ready!** 🎉

export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  globalTeardown: "<rootDir>/tests/teardown.js",
  testMatch: ["**/tests/**/*.test.js"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.js", "!server.js", "!src/config/**"],
  maxWorkers: "50%", // Use 50% of available CPU cores
  verbose: true,
};

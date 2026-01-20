import User from "../../src/models/user.model.js";
import db from "../../src/config/db.js";

describe("User Model", () => {
  beforeAll(async () => {
    // Create users table for testing
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  });

  afterEach(async () => {
    // Clear users table after each test
    await db.query("TRUNCATE TABLE users");
  });

  afterAll(async () => {
    // Drop table after all tests
    await db.query("DROP TABLE IF EXISTS users");
  });

  describe("create", () => {
    it("should create a new user with valid data", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const user = await User.create(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.username).toBe("testuser");
      expect(user.email).toBe("test@example.com");
      expect(user.role).toBe("user");
      expect(user.is_active).toBe(1);
    });

    it("should create an admin user", async () => {
      const userData = {
        username: "adminuser",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      };

      const user = await User.create(userData);

      expect(user.role).toBe("admin");
    });

    it("should throw error if username or email is missing", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should throw error if password is missing", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should throw error if password is less than 6 characters", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "short",
      };

      await expect(User.create(userData)).rejects.toThrow(
        "Password must be at least 6 characters long",
      );
    });

    it("should throw error if email is invalid", async () => {
      const userData = {
        username: "testuser",
        email: "invalid-email",
        password: "password123",
      };

      await expect(User.create(userData)).rejects.toThrow(
        "Invalid email format",
      );
    });

    it("should throw error if username already exists", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      await User.create(userData);

      const duplicateData = {
        username: "testuser",
        email: "different@example.com",
        password: "password123",
      };

      await expect(User.create(duplicateData)).rejects.toThrow(
        "Username or email already exists",
      );
    });

    it("should throw error if email already exists", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      await User.create(userData);

      const duplicateData = {
        username: "differentuser",
        email: "test@example.com",
        password: "password123",
      };

      await expect(User.create(duplicateData)).rejects.toThrow(
        "Username or email already exists",
      );
    });
  });

  describe("findById", () => {
    it("should find a user by id", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = await User.create(userData);
      const foundUser = await User.findById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(createdUser.id);
      expect(foundUser.username).toBe("testuser");
      expect(foundUser.email).toBe("test@example.com");
    });

    it("should return null if user not found", async () => {
      const user = await User.findById(9999);
      expect(user).toBeNull();
    });

    it("should not include password in response", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = await User.create(userData);
      const foundUser = await User.findById(createdUser.id);

      expect(foundUser).not.toHaveProperty("password");
    });
  });

  describe("findByUsername", () => {
    it("should find a user by username", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      await User.create(userData);
      const foundUser = await User.findByUsername("testuser");

      expect(foundUser).toBeDefined();
      expect(foundUser.username).toBe("testuser");
    });

    it("should return null if username not found", async () => {
      const user = await User.findByUsername("nonexistent");
      expect(user).toBeNull();
    });

    it("should include password hash in response", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      await User.create(userData);
      const foundUser = await User.findByUsername("testuser");

      expect(foundUser).toHaveProperty("password");
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      await User.create(userData);
      const foundUser = await User.findByEmail("test@example.com");

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe("test@example.com");
    });

    it("should return null if email not found", async () => {
      const user = await User.findByEmail("nonexistent@example.com");
      expect(user).toBeNull();
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = await User.create(userData);
      const foundUser = await User.findByUsername("testuser");

      const isValid = await User.verifyPassword(
        "password123",
        foundUser.password,
      );
      expect(isValid).toBe(true);
    });

    it("should not verify incorrect password", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = await User.create(userData);
      const foundUser = await User.findByUsername("testuser");

      const isValid = await User.verifyPassword(
        "wrongpassword",
        foundUser.password,
      );
      expect(isValid).toBe(false);
    });
  });

  describe("update", () => {
    it("should update user email", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = await User.create(userData);
      const updatedUser = await User.update(createdUser.id, {
        email: "newemail@example.com",
      });

      expect(updatedUser.email).toBe("newemail@example.com");
    });

    it("should update user role", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = await User.create(userData);
      const updatedUser = await User.update(createdUser.id, {
        role: "admin",
      });

      expect(updatedUser.role).toBe("admin");
    });

    it("should return null if user not found", async () => {
      const result = await User.update(9999, { role: "admin" });
      expect(result).toBeNull();
    });
  });

  describe("updatePassword", () => {
    it("should update user password", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = await User.create(userData);
      await User.updatePassword(createdUser.id, "newpassword123");

      const foundUser = await User.findByUsername("testuser");
      const isValid = await User.verifyPassword(
        "newpassword123",
        foundUser.password,
      );

      expect(isValid).toBe(true);
    });

    it("should throw error if password is less than 6 characters", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = await User.create(userData);

      await expect(
        User.updatePassword(createdUser.id, "short"),
      ).rejects.toThrow("Password must be at least 6 characters long");
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = await User.create(userData);
      const result = await User.delete(createdUser.id);

      expect(result).toBe(true);

      const foundUser = await User.findById(createdUser.id);
      expect(foundUser).toBeNull();
    });

    it("should return false if user not found", async () => {
      const result = await User.delete(9999);
      expect(result).toBe(false);
    });
  });

  describe("deactivate", () => {
    it("should deactivate a user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = await User.create(userData);
      const result = await User.deactivate(createdUser.id);

      expect(result).toBe(true);

      const foundUser = await User.findById(createdUser.id);
      expect(foundUser.is_active).toBe(0);
    });
  });

  describe("activate", () => {
    it("should activate a user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const createdUser = await User.create(userData);
      await User.deactivate(createdUser.id);
      const result = await User.activate(createdUser.id);

      expect(result).toBe(true);

      const foundUser = await User.findById(createdUser.id);
      expect(foundUser.is_active).toBe(1);
    });
  });

  describe("isValidEmail", () => {
    it("should validate correct email format", () => {
      expect(User.isValidEmail("test@example.com")).toBe(true);
      expect(User.isValidEmail("user+tag@example.co.uk")).toBe(true);
    });

    it("should reject invalid email format", () => {
      expect(User.isValidEmail("invalid")).toBe(false);
      expect(User.isValidEmail("invalid@")).toBe(false);
      expect(User.isValidEmail("@example.com")).toBe(false);
    });
  });
});

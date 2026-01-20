# Authentication Integration Guide

## Adding Authentication to Existing Routes

This guide shows how to protect existing routes with authentication and authorization.

## 1. Protecting Product Routes

### Before (Unprotected)

```javascript
// src/routes/product.routes.js
import express from "express";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", ProductController.getAll);
router.post("/", ProductController.create);
router.get("/:id", ProductController.getById);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.delete);

export default router;
```

### After (Protected)

```javascript
// src/routes/product.routes.js
import express from "express";
import ProductController from "../controllers/product.controller.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public endpoints
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

// Protected endpoints - authenticated users only
router.post("/", authenticate, ProductController.create);
router.put("/:id", authenticate, ProductController.update);

// Admin only
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  ProductController.delete,
);

export default router;
```

## 2. Creating Protected Admin Routes

### Example: User Management Routes

```javascript
// src/routes/user.routes.js
import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import User from "../models/user.model.js";

const router = express.Router();

// Get all users (admin only)
router.get("/", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update user role (admin only)
router.put(
  "/:id/role",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Must be 'user' or 'admin'",
        });
      }

      const updatedUser = await User.update(id, { role });
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User role updated",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Deactivate user (admin only)
router.post(
  "/:id/deactivate",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const success = await User.deactivate(id);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User deactivated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Activate user (admin only)
router.post(
  "/:id/activate",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const success = await User.activate(id);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User activated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

export default router;
```

### Register in app.js

```javascript
import userRoutes from "./routes/user.routes.js";

// Add to app.js after auth routes
app.use("/api/users", userRoutes);
```

## 3. Adding Role-Based Data Access

### Example: Only Users Can Access Their Own Profile

```javascript
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Users can only access their own profile
    // Admins can access any profile
    if (userRole !== "admin" && parseInt(id) !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own profile.",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
```

## 4. Custom Authorization Middleware

### Role and Resource-Based Authorization

```javascript
// src/middlewares/resourceAuthMiddleware.js
import User from "../models/user.model.js";

export const authorizeOwnerOrAdmin = (resourceGetter) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Get the resource (product, post, etc.)
      const resource = await resourceGetter(req);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // Check if user is owner or admin
      const isOwner = resource.user_id === req.user.id;
      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to access this resource",
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};
```

### Usage in Routes

```javascript
import { authorizeOwnerOrAdmin } from "../middlewares/resourceAuthMiddleware.js";
import Product from "../models/product.model.js";

// Update product - owner or admin only
router.put(
  "/:id",
  authenticate,
  authorizeOwnerOrAdmin(async (req) => {
    const product = await Product.findById(req.params.id);
    return product;
  }),
  async (req, res) => {
    // Update logic here
  },
);
```

## 5. Request Context with User Data

### Automatically Inject User Information

```javascript
// src/middlewares/enrichRequest.js
export const enrichRequestWithUser = (req, res, next) => {
  // Add helper properties to request
  req.userId = req.user?.id;
  req.userRole = req.user?.role;
  req.username = req.user?.username;

  // Helper method to check permissions
  req.hasRole = (role) => {
    return Array.isArray(role)
      ? role.includes(req.user?.role)
      : req.user?.role === role;
  };

  req.isAdmin = () => req.user?.role === "admin";
  req.isOwner = (resourceUserId) => req.user?.id === resourceUserId;

  next();
};

// In app.js - use after auth middleware
app.use(authenticate);
app.use(enrichRequestWithUser);

// Usage in routes
router.delete("/:id", async (req, res) => {
  if (!req.isAdmin() && !req.isOwner(resourceOwnerId)) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  // Delete logic here
});
```

## 6. Testing Protected Routes

### Unit Test Example

```javascript
import {
  authenticate,
  authorize,
} from "../../src/middlewares/authMiddleware.js";
import jwt from "jsonwebtoken";

describe("Protected Routes", () => {
  it("should allow admin to delete resource", (done) => {
    const adminToken = jwt.sign(
      {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const req = {
      user: { id: 1, role: "admin" },
    };
    const res = {};
    const next = jest.fn();
    const middleware = authorize(["admin"]);

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    done();
  });

  it("should deny regular user from deleting", (done) => {
    const req = {
      user: { id: 2, role: "user" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const middleware = authorize(["admin"]);

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    done();
  });
});
```

### Integration Test Example

```javascript
import request from "supertest";
import app from "../../src/app.js";

describe("Protected Product Routes", () => {
  it("should create product when authenticated", async () => {
    // Login first
    const loginRes = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });

    const token = extractTokenFromResponse(loginRes);

    // Create product with token
    const response = await request(app)
      .post("/api/products")
      .set("Cookie", `token=${token}`)
      .send({
        name: "Test Product",
        price: 99.99,
      });

    expect(response.status).toBe(201);
  });

  it("should reject product creation without token", async () => {
    const response = await request(app).post("/api/products").send({
      name: "Test Product",
      price: 99.99,
    });

    expect(response.status).toBe(401);
  });

  it("should allow admin to delete product", async () => {
    // Login as admin
    const loginRes = await request(app).post("/api/auth/login").send({
      username: "adminuser",
      password: "password123",
    });

    const token = extractTokenFromResponse(loginRes);

    // Delete product with admin token
    const response = await request(app)
      .delete("/api/products/1")
      .set("Cookie", `token=${token}`);

    expect(response.status).toBe(200);
  });
});
```

## 7. Audit Logging

### Log Protected Operations

```javascript
// src/middlewares/auditLog.js
export const auditLog = (action) => {
  return (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
      // Log after response is prepared
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          action,
          userId: req.user?.id,
          username: req.user?.username,
          path: req.path,
          method: req.method,
          ip: req.ip,
          statusCode: res.statusCode,
          success: data?.success,
        }),
      );

      return originalJson.call(this, data);
    };

    next();
  };
};

// Usage in routes
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  auditLog("DELETE_PRODUCT"),
  async (req, res) => {
    // Delete logic
  },
);
```

## 8. Complete Example: User Management System

See the full example implementation in:

- [User Model](../src/models/user.model.js)
- [Auth Controller](../src/controllers/auth.controller.js)
- [Auth Middleware](../src/middlewares/authMiddleware.js)
- [Integration Tests](../tests/integration/auth.api.test.js)

## Best Practices

1. **Always Authenticate First** - Apply `authenticate` middleware before `authorize`
2. **Log Security Events** - Audit sensitive operations
3. **Use HTTPS** - Set `Secure` cookie flag in production
4. **Validate Input** - Sanitize all user inputs
5. **Set Expiry** - Use appropriate token expiration times
6. **Handle Errors Gracefully** - Don't leak sensitive info in error messages
7. **Test Authorization** - Write tests for access control
8. **Monitor Access** - Track failed authentication attempts

## Common Patterns

### Pattern 1: Public + Authenticated Endpoints

```javascript
router.get("/", publicController); // No auth
router.post("/", authenticate, createController); // Requires auth
```

### Pattern 2: Role-Based Access

```javascript
router.get("/admin", authenticate, authorize(["admin"]), adminController);
router.get("/user", authenticate, authorize(["user", "admin"]), userController);
```

### Pattern 3: Resource Ownership

```javascript
router.put("/:id", authenticate, checkOwnership, updateController);
router.delete("/:id", authenticate, checkOwnership, deleteController);
```

### Pattern 4: Tiered Access

```javascript
router.get("/", publicController); // Public
router.post("/", authenticate, createController); // Authenticated
router.put("/:id", authenticate, checkOwnership); // Owner only
router.delete("/:id", authenticate, authorize(["admin"])); // Admin only
```

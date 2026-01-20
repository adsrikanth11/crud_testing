import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validations/authValidation.js";

const router = express.Router();

// Public routes
router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);

// Protected routes
router.post("/logout", authenticate, AuthController.logout);
router.get("/me", authenticate, AuthController.getCurrentUser);
router.post(
  "/refresh-token",
  authenticate,
  validate(refreshTokenSchema),
  AuthController.refreshToken,
);

export default router;

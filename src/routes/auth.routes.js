import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Protected routes
router.post("/logout", authenticate, AuthController.logout);
router.get("/me", authenticate, AuthController.getCurrentUser);
router.post("/refresh-token", authenticate, AuthController.refreshToken);

export default router;

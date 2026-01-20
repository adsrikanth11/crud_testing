import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Home route
app.get("/", (req, res) => {
  res.json({ message: "API Server is running" });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Product routes
app.use("/api/products", productRoutes);

// 404 handler - must be after all other routes
app.use(notFoundHandler);

// Error handler middleware - must be last
app.use(errorHandler);

export default app;

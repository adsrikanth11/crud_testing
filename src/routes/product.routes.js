import express from "express";
import * as controller from "../controllers/product.controller.js";

const router = express.Router();

// Validation middleware
const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Valid product name is required" });
  }
  if (
    price === undefined ||
    isNaN(parseFloat(price)) ||
    parseFloat(price) <= 0
  ) {
    return res.status(400).json({ error: "Valid product price is required" });
  }
  next();
};

const validateId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Valid product ID is required" });
  }
  next();
};

router.post("/", validateProduct, controller.createProduct);
router.get("/", controller.getProducts);
router.get("/:id", validateId, controller.getProduct);
router.put("/:id", validateId, validateProduct, controller.updateProduct);
router.delete("/:id", validateId, controller.deleteProduct);

export default router;

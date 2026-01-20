import express from "express";
import * as controller from "../controllers/product.controller.js";
import { validate } from "../middlewares/validationMiddleware.js";
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
} from "../validations/productValidation.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(createProductSchema),
  controller.createProduct,
);
router.get("/", controller.getProducts);
router.get("/:id", validate(getProductSchema, "params"), controller.getProduct);
router.put(
  "/:id",
  authenticate,
  validate(getProductSchema, "params"),
  validate(updateProductSchema),
  controller.updateProduct,
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(getProductSchema, "params"),
  controller.deleteProduct,
);

export default router;

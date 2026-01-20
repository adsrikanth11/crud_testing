import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(255).required().messages({
    "string.base": "Product name must be a string",
    "string.min": "Product name must be at least 3 characters long",
    "string.max": "Product name must not exceed 255 characters",
    "any.required": "Product name is required",
    "string.empty": "Product name cannot be empty",
  }),
  price: Joi.number().positive().precision(2).required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(255).messages({
    "string.base": "Product name must be a string",
    "string.min": "Product name must be at least 3 characters long",
    "string.max": "Product name must not exceed 255 characters",
    "string.empty": "Product name cannot be empty",
  }),
  price: Joi.number().positive().precision(2).messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number",
  }),
});

export const getProductSchema = Joi.object({
  id: Joi.number().positive().required().messages({
    "number.base": "Product ID must be a number",
    "number.positive": "Product ID must be positive",
    "any.required": "Product ID is required",
  }),
});

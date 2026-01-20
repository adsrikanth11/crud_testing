import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.alphanum": "Username must contain only alphanumeric characters",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must not exceed 30 characters",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  }),
});

export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.base": "Username must be a string",
    "any.required": "Username is required",
  }),
  password: Joi.string().required().messages({
    "string.base": "Password must be a string",
    "any.required": "Password is required",
  }),
});

export const refreshTokenSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.base": "Token must be a string",
    "any.required": "Token is required",
  }),
});

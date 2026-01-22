const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required()
    .messages({
      'string.empty': 'Product name is required',
      'string.max': 'Product name cannot exceed 100 characters',
    }),
  description: Joi.string().min(1).max(1000).required()
    .messages({
      'string.empty': 'Product description is required',
      'string.max': 'Description cannot exceed 1000 characters',
    }),
  price: Joi.number().min(0).required()
    .messages({
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required',
    }),
  category: Joi.string().trim().required()
    .messages({
      'string.empty': 'Category is required',
    }),
  stock: Joi.number().integer().min(0).required()
    .messages({
      'number.min': 'Stock cannot be negative',
      'any.required': 'Stock is required',
    }),
  images: Joi.array().items(Joi.string().uri()).optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).optional(),
  description: Joi.string().min(1).max(1000).optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string().trim().optional(),
  stock: Joi.number().integer().min(0).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
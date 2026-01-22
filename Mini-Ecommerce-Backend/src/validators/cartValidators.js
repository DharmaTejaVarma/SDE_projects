const Joi = require('joi');

const addToCartSchema = Joi.object({
  productId: Joi.string().hex().length(24).required()
    .messages({
      'string.hex': 'Invalid product ID',
      'string.length': 'Invalid product ID',
      'any.required': 'Product ID is required',
    }),
  quantity: Joi.number().integer().min(1).required()
    .messages({
      'number.min': 'Quantity must be at least 1',
      'any.required': 'Quantity is required',
    }),
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required()
    .messages({
      'number.min': 'Quantity must be at least 1',
      'any.required': 'Quantity is required',
    }),
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
};
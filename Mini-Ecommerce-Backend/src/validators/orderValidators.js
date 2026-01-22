const Joi = require('joi');

const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    street: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    zipCode: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
  }).required(),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED').required()
    .messages({
      'any.only': 'Invalid status value',
      'any.required': 'Status is required',
    }),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};
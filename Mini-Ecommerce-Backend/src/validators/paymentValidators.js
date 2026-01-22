const Joi = require('joi');

const processPaymentSchema = Joi.object({
  paymentMethod: Joi.string().valid('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER').required()
    .messages({
      'any.only': 'Invalid payment method',
      'any.required': 'Payment method is required',
    }),
  // In a real app, you'd have card details, but since it's mocked, we keep it simple
});

module.exports = {
  processPaymentSchema,
};
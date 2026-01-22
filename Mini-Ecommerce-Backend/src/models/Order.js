const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING',
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for user, status, and soft delete
orderSchema.index({ user: 1, isDeleted: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
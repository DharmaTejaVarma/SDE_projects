const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
    min: [0, 'Total amount cannot be negative'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for user and soft delete
cartSchema.index({ user: 1, isDeleted: 1 });

// Calculate total amount before saving
cartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
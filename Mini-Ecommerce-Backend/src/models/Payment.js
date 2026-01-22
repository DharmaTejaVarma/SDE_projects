const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING',
  },
  paymentMethod: {
    type: String,
    enum: ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER'],
    default: 'CREDIT_CARD',
  },
  transactionId: {
    type: String,
    unique: true,
  },
  paymentDate: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for order, user, and soft delete
paymentSchema.index({ order: 1, isDeleted: 1 });
paymentSchema.index({ user: 1 });

// Generate transaction ID before saving
paymentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
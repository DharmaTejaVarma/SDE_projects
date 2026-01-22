const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  images: [{
    type: String, // URLs to images
  }],
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for soft delete and category
productSchema.index({ isDeleted: 1 });
productSchema.index({ category: 1 });

// Virtual for availability
productSchema.virtual('isAvailable').get(function() {
  return this.stock > 0 && !this.isDeleted;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../config/logger');

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    // Add search and category filters
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    if (req.query.category) {
      filter.category = { $regex: req.query.category, $options: 'i' };
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    const meta = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };

    sendSuccess(res, 'Products retrieved successfully', products, meta);
  } catch (error) {
    logger.error('Get products error:', error);
    sendError(res, 'Server error retrieving products', 500);
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return sendError(res, 'Product not found', 404);
    }

    sendSuccess(res, 'Product retrieved successfully', product);
  } catch (error) {
    logger.error('Get product error:', error);
    sendError(res, 'Server error retrieving product', 500);
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    logger.info(`Product created: ${product.name} by ${req.user.email}`);

    sendSuccess(res, 'Product created successfully', product, null, 201);
  } catch (error) {
    logger.error('Create product error:', error);
    sendError(res, 'Server error creating product', 500);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product || product.isDeleted) {
      return sendError(res, 'Product not found', 404);
    }

    logger.info(`Product updated: ${product.name} by ${req.user.email}`);

    sendSuccess(res, 'Product updated successfully', product);
  } catch (error) {
    logger.error('Update product error:', error);
    sendError(res, 'Server error updating product', 500);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    logger.info(`Product deleted: ${product.name} by ${req.user.email}`);

    sendSuccess(res, 'Product deleted successfully');
  } catch (error) {
    logger.error('Delete product error:', error);
    sendError(res, 'Server error deleting product', 500);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../config/logger');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id, isDeleted: false })
      .populate('items.product', 'name price images');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    sendSuccess(res, 'Cart retrieved successfully', cart);
  } catch (error) {
    logger.error('Get cart error:', error);
    sendError(res, 'Server error retrieving cart', 500);
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || product.isDeleted || product.stock < quantity) {
      return sendError(res, 'Product not available or insufficient stock', 400);
    }

    let cart = await Cart.findOne({ user: req.user._id, isDeleted: false });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images');

    logger.info(`Item added to cart: ${product.name} by ${req.user.email}`);

    sendSuccess(res, 'Item added to cart successfully', cart);
  } catch (error) {
    logger.error('Add to cart error:', error);
    sendError(res, 'Server error adding item to cart', 500);
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ user: req.user._id, isDeleted: false });
    if (!cart) {
      return sendError(res, 'Cart not found', 404);
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return sendError(res, 'Cart item not found', 404);
    }

    const product = await Product.findById(item.product);
    if (!product || product.isDeleted || product.stock < quantity) {
      return sendError(res, 'Product not available or insufficient stock', 400);
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name price images');

    logger.info(`Cart item updated by ${req.user.email}`);

    sendSuccess(res, 'Cart item updated successfully', cart);
  } catch (error) {
    logger.error('Update cart item error:', error);
    sendError(res, 'Server error updating cart item', 500);
  }
};

const removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ user: req.user._id, isDeleted: false });
    if (!cart) {
      return sendError(res, 'Cart not found', 404);
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return sendError(res, 'Cart item not found', 404);
    }

    cart.items.pull(itemId);
    await cart.save();
    await cart.populate('items.product', 'name price images');

    logger.info(`Item removed from cart by ${req.user.email}`);

    sendSuccess(res, 'Item removed from cart successfully', cart);
  } catch (error) {
    logger.error('Remove from cart error:', error);
    sendError(res, 'Server error removing item from cart', 500);
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id, isDeleted: false });
    if (!cart) {
      return sendError(res, 'Cart not found', 404);
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    logger.info(`Cart cleared by ${req.user.email}`);

    sendSuccess(res, 'Cart cleared successfully', cart);
  } catch (error) {
    logger.error('Clear cart error:', error);
    sendError(res, 'Server error clearing cart', 500);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
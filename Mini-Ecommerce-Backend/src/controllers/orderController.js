const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../config/logger');

const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id, isDeleted: false };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    const meta = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };

    sendSuccess(res, 'Orders retrieved successfully', orders, meta);
  } catch (error) {
    logger.error('Get orders error:', error);
    sendError(res, 'Server error retrieving orders', 500);
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false,
    }).populate('items.product', 'name images');

    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    sendSuccess(res, 'Order retrieved successfully', order);
  } catch (error) {
    logger.error('Get order error:', error);
    sendError(res, 'Server error retrieving order', 500);
  }
};

const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id, isDeleted: false })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return sendError(res, 'Cart is empty', 400);
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return sendError(res, `Insufficient stock for ${item.product.name}`, 400);
      }
    }

    // Create order items snapshot
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    }));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    await order.populate('items.product', 'name images');

    logger.info(`Order created: ${order._id} by ${req.user.email}`);

    sendSuccess(res, 'Order created successfully', order, null, 201);
  } catch (error) {
    logger.error('Create order error:', error);
    sendError(res, 'Server error creating order', 500);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.product', 'name images');

    if (!order || order.isDeleted) {
      return sendError(res, 'Order not found', 404);
    }

    logger.info(`Order status updated: ${order._id} to ${status} by ${req.user.email}`);

    sendSuccess(res, 'Order status updated successfully', order);
  } catch (error) {
    logger.error('Update order status error:', error);
    sendError(res, 'Server error updating order status', 500);
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
};
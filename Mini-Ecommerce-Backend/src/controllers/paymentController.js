const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../config/logger');

const processPayment = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const orderId = req.params.orderId;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      isDeleted: false,
    });

    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    if (order.status !== 'PENDING') {
      return sendError(res, 'Order is not in pending status', 400);
    }

    // Mock payment processing - simulate success/failure randomly
    const isSuccess = Math.random() > 0.1; // 90% success rate

    const payment = await Payment.create({
      order: orderId,
      user: req.user._id,
      amount: order.totalAmount,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      paymentMethod,
      paymentDate: isSuccess ? new Date() : null,
    });

    if (isSuccess) {
      order.status = 'PAID';
      order.payment = payment._id;
      await order.save();

      logger.info(`Payment successful: ${payment.transactionId} for order ${orderId}`);
      sendSuccess(res, 'Payment processed successfully', payment);
    } else {
      logger.warn(`Payment failed: ${payment.transactionId} for order ${orderId}`);
      sendError(res, 'Payment failed. Please try again.', 400);
    }
  } catch (error) {
    logger.error('Process payment error:', error);
    sendError(res, 'Server error processing payment', 500);
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false,
    }).populate('order', 'totalAmount status');

    if (!payment) {
      return sendError(res, 'Payment not found', 404);
    }

    sendSuccess(res, 'Payment retrieved successfully', payment);
  } catch (error) {
    logger.error('Get payment error:', error);
    sendError(res, 'Server error retrieving payment', 500);
  }
};

const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id, isDeleted: false };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const payments = await Payment.find(filter)
      .populate('order', 'totalAmount status')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(filter);

    const meta = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPayments: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };

    sendSuccess(res, 'Payments retrieved successfully', payments, meta);
  } catch (error) {
    logger.error('Get payments error:', error);
    sendError(res, 'Server error retrieving payments', 500);
  }
};

module.exports = {
  processPayment,
  getPayment,
  getPayments,
};
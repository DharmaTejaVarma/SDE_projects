const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orderController');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/orderValidators');

const router = express.Router();

// All order routes require authentication
router.use(auth);

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', validate(createOrderSchema), createOrder);

// Admin can update order status
router.put('/:id/status', authorize('ADMIN'), validate(updateOrderStatusSchema), updateOrderStatus);

module.exports = router;
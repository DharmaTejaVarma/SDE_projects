const express = require('express');
const {
  processPayment,
  getPayment,
  getPayments,
} = require('../controllers/paymentController');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { processPaymentSchema } = require('../validators/paymentValidators');

const router = express.Router();

// All payment routes require authentication
router.use(auth);

router.get('/', getPayments);
router.get('/:id', getPayment);
router.post('/orders/:orderId', validate(processPaymentSchema), processPayment);

module.exports = router;
const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { addToCartSchema, updateCartItemSchema } = require('../validators/cartValidators');

const router = express.Router();

// All cart routes require authentication
router.use(auth);

router.get('/', getCart);
router.post('/items', validate(addToCartSchema), addToCart);
router.put('/items/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/items/:itemId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { createProductSchema, updateProductSchema } = require('../validators/productValidators');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin only routes
router.post('/', auth, authorize('ADMIN'), validate(createProductSchema), createProduct);
router.put('/:id', auth, authorize('ADMIN'), validate(updateProductSchema), updateProduct);
router.delete('/:id', auth, authorize('ADMIN'), deleteProduct);

module.exports = router;
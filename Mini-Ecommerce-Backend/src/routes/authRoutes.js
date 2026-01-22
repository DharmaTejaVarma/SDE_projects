const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { registerSchema, loginSchema } = require('../validators/authValidators');

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.get('/profile', auth, getProfile);

module.exports = router;
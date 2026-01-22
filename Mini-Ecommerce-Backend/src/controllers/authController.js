const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../config/logger');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
      return sendError(res, 'User already exists with this email', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    logger.info(`User registered: ${user.email}`);

    sendSuccess(res, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }, null, 201);
  } catch (error) {
    logger.error('Register error:', error);
    sendError(res, 'Server error during registration', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email, isDeleted: false }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const token = generateToken(user._id);

    logger.info(`User logged in: ${user.email}`);

    sendSuccess(res, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    logger.error('Login error:', error);
    sendError(res, 'Server error during login', 500);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.isDeleted) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, 'Profile retrieved successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    sendError(res, 'Server error retrieving profile', 500);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
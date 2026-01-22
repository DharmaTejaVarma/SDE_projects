const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+password');

    if (!user || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid.',
    });
  }
};

module.exports = auth;
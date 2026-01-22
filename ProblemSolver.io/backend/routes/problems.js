const express = require('express');
const Problem = require('../models/Problem');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/problems
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;
    console.log('API Request Params:', { category, difficulty, search });

    const where = { isActive: true, isImportant: true };

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (search) {
      where.title = { [Op.like]: `%${search}%` }; // Simple LIKE search
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    console.log('Query WHERE clause:', where);

    const { count, rows: problems } = await Problem.findAndCountAll({
      where,
      attributes: { exclude: ['solution', 'testCases'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      count: problems.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      data: problems
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/problems/:id
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findByPk(req.params.id);

    if (!problem || !problem.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.json({
      success: true,
      data: problem
    });
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/problems/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const problems = await Problem.findAll({
      where: {
        category,
        isActive: true
      },
      attributes: { exclude: ['solution', 'testCases'] },
      order: [['difficulty', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: problems.length,
      data: problems
    });
  } catch (error) {
    console.error('Get problems by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

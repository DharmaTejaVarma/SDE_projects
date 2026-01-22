const express = require('express');
const { body, validationResult } = require('express-validator');
const Problem = require('../models/Problem');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// @route   POST /api/admin/problems
// @desc    Create a new problem
// @access  Admin
router.post('/problems', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['arrays', 'stacks', 'queues', 'linkedLists', 'trees']).withMessage('Invalid category'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('constraints').notEmpty().withMessage('Constraints are required'),
  body('sampleInput').notEmpty().withMessage('Sample input is required'),
  body('sampleOutput').notEmpty().withMessage('Sample output is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      title, description, category, difficulty,
      constraints, sampleInput, sampleOutput,
      explanation, solution, testCases, isImportant
    } = req.body;

    const problem = await Problem.create({
      title, description, category, difficulty,
      constraints, sampleInput, sampleOutput,
      explanation, solution, testCases,
      isImportant: isImportant || false,
      isActive: true,
      // createdBy: req.user.id // Optional if we add userId column
    });

    res.status(201).json({
      success: true,
      data: problem
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// @route   PUT /api/admin/problems/:id
// @desc    Update a problem
// @access  Admin
router.put('/problems/:id', async (req, res) => {
  try {
    const problem = await Problem.findByPk(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    await problem.update(req.body);

    res.json({
      success: true,
      data: problem
    });
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// @route   DELETE /api/admin/problems/:id
// @desc    Delete a problem (Soft delete)
// @access  Admin
router.delete('/problems/:id', async (req, res) => {
  try {
    const problem = await Problem.findByPk(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    await problem.update({ isActive: false });

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

module.exports = router;

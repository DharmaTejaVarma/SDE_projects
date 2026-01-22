const express = require('express');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const { protect } = require('../middleware/auth');
const codeExecutor = require('../services/CodeExecutor');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

const router = express.Router();

// @route   POST /api/submissions
router.post('/', protect, async (req, res) => {
  try {
    const { problemId, code, language, functionName } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Please provide problemId, code, and language'
      });
    }

    const problem = await Problem.findByPk(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem with ID ${problemId} not found`
      });
    }

    const testCases = problem.testCases || [];
    const totalTestCases = testCases.length;

    if (totalTestCases === 0) {
      return res.status(400).json({
        success: false,
        message: 'No test cases available for this problem'
      });
    }

    // Create submission record
    const submission = await Submission.create({
      userId: req.user.id,
      problemId: problem.id,
      code,
      language,
      status: 'pending',
      totalTestCases,
      functionName: functionName || 'solve'
    });

    // Execute code
    const judgeResult = await codeExecutor.judgeTestCases(code, language, testCases, functionName);

    // Prepare update data
    const updateData = {
      status: judgeResult.verdict,
      executionTime: judgeResult.executionTime,
      memoryUsed: judgeResult.memoryUsed,
      testCasesPassed: judgeResult.testCasesPassed,
      totalTestCases: judgeResult.totalTestCases,
      errorMessage: judgeResult.failedTestCase ? judgeResult.failedTestCase.error : ''
    };

    // Update submission
    await submission.update(updateData);

    // ---------------------------------------------------------
    // GAMIFICATION LOGIC (Update User Stats if Accepted)
    // ---------------------------------------------------------
    if (judgeResult.verdict === 'Accepted') {
      try {
        const User = require('../models/User'); // Lazy load or move to top
        const user = await User.findByPk(req.user.id);

        // 1. Update Solved Problems
        let solved = user.solvedProblems || [];
        if (typeof solved === 'string') solved = JSON.parse(solved); // SQLite safety

        // Check if this problem was already solved
        const alreadySolved = solved.includes(problem.id);

        if (!alreadySolved) {
          // Add to solved list
          solved.push(problem.id);
          user.solvedProblems = solved;

          // 2. Add Points (Only for first solve)
          const pointsMap = { 'Easy': 10, 'Medium': 20, 'Hard': 30 };
          const addedPoints = pointsMap[problem.difficulty] || 10;
          user.points = (user.points || 0) + addedPoints;
        }

        // 3. Update Streak (Daily)
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const lastDate = user.lastSolvedDate;

        if (lastDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastDate === yesterdayStr) {
            user.currentStreak = (user.currentStreak || 0) + 1;
          } else {
            // If last solved was today, do nothing. If older, reset.
            // Actually, if lastDate is null (first time), streak = 1.
            // If lastDate was older than yesterday, streak = 1.
            user.currentStreak = 1;
          }
          user.lastSolvedDate = today;
        }

        // 4. Award Badges (Simple checks)
        let badges = user.badges || [];
        if (typeof badges === 'string') badges = JSON.parse(badges);

        if (!badges.includes('First Code 🐣')) {
          badges.push('First Code 🐣');
        }
        if (user.currentStreak >= 3 && !badges.includes('Streak Master 🔥')) {
          badges.push('Streak Master 🔥');
        }
        if (user.points >= 100 && !badges.includes('Century 💯')) {
          badges.push('Century 💯');
        }

        user.badges = badges;

        await user.save();

      } catch (gamificationErr) {
        console.error('Gamification update failed:', gamificationErr);
        // Don't fail the submission response just because stats failed
      }
    }
    // ---------------------------------------------------------

    // Return the updated submission
    const updatedSubmission = await submission.reload();

    res.status(200).json({
      success: true,
      data: updatedSubmission
    });

  } catch (error) {
    console.error('Submit code error:', error);
    try {
      fs.appendFileSync(path.join(__dirname, '../debug_error.log'), `[${new Date().toISOString()}] SUBMISSION ERROR: ${error.stack}\n`);
    } catch (logErr) { }

    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
});

// @route   GET /api/submissions
// Copied structure, untested logic for list view, but basic impl:
router.get('/', protect, async (req, res) => {
  try {
    const { problemId } = req.query;
    const where = { userId: req.user.id };

    if (problemId) {
      where.problemId = problemId;
    }

    const submissions = await Submission.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/submissions/run (Run without saving)
router.post('/run', protect, async (req, res) => {
  try {
    const { problemId, code, language, functionName } = req.body;

    const problem = await Problem.findByPk(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    // Use CodeExecutor.execute directly for single run or judge for all
    // Usually 'Run' means run sample test cases. For simplicity running all here or just sample.
    // Let's assume judgeTestCases is fine.

    const result = await codeExecutor.judgeTestCases(code, language, problem.testCases, functionName);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

const express = require('express');
const User = require('../models/User');
const Problem = require('../models/Problem');
const { protect } = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/progress
// @desc    Get user's progress statistics (Dynamic Calculation)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const Submission = require('../models/Submission'); // Lazy load to avoid circular deps if any

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 1. Fetch all distinct Accepted submissions for this user
    const acceptedSubmissions = await Submission.findAll({
      where: {
        userId: req.user.id,
        status: 'Accepted'
      },
      attributes: ['problemId', 'createdAt']
    });

    // 2. Extract Unique Problem IDs
    const distinctSolvedIds = [...new Set(acceptedSubmissions.map(s => String(s.problemId)))];

    // 3. Get all Active Problems
    const totalProblems = await Problem.findAll({
      where: { isActive: true },
      attributes: ['id', 'category', 'difficulty']
    });

    // 4. Initialize Stats Containers
    const topicStats = {
      arrays: { total: 0, solved: 0 },
      stacks: { total: 0, solved: 0 },
      queues: { total: 0, solved: 0 },
      linkedLists: { total: 0, solved: 0 },
      trees: { total: 0, solved: 0 }
    };

    const difficultyStats = {
      easy: { total: 0, solved: 0 },
      medium: { total: 0, solved: 0 },
      hard: { total: 0, solved: 0 }
    };

    // 5. Populate Totals
    const problemMap = {};
    totalProblems.forEach(p => {
      problemMap[String(p.id)] = p;
      if (topicStats[p.category]) topicStats[p.category].total++;
      if (difficultyStats[p.difficulty]) difficultyStats[p.difficulty].total++;
    });

    // 6. Populate Solved Counts & Calculate Points
    let calculatedPoints = 0;
    const pointsMap = { 'Easy': 10, 'Medium': 20, 'Hard': 30 };

    distinctSolvedIds.forEach(solvedId => {
      const problem = problemMap[solvedId];
      if (problem) {
        // Stats
        if (topicStats[problem.category]) topicStats[problem.category].solved++;
        if (difficultyStats[problem.difficulty]) difficultyStats[problem.difficulty].solved++;

        // Points (Recalculate based on difficulty)
        calculatedPoints += (pointsMap[problem.difficulty] || 10);
      }
    });

    // 7. Calculate Percentages
    const topicProgress = {};
    Object.keys(topicStats).forEach(topic => {
      const { total, solved } = topicStats[topic];
      topicProgress[topic] = total > 0 ? Math.round((solved / total) * 100) : 0;
    });

    // 8. Streak Calculation (Dynamic)
    // Get unique dates from accepted submissions
    const uniqueDates = [...new Set(acceptedSubmissions.map(s => {
      const d = new Date(s.createdAt);
      return d.toISOString().split('T')[0];
    }))].sort().reverse(); // Descending order: Today, Yesterday...

    let currentStreak = 0;
    if (uniqueDates.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // If solved today, start count from today. 
      // If solved yesterday but not today, start from yesterday.
      // If last solved was before yesterday, streak is 0 (or 1 if we count that day? usually 0 active streak).

      let streakStartDate = null;
      if (uniqueDates.includes(today)) streakStartDate = today;
      else if (uniqueDates.includes(yesterdayStr)) streakStartDate = yesterdayStr;

      if (streakStartDate) {
        currentStreak = 1;
        let checkDate = new Date(streakStartDate);

        // Check previous days
        while (true) {
          checkDate.setDate(checkDate.getDate() - 1);
          const checkStr = checkDate.toISOString().split('T')[0];
          if (uniqueDates.includes(checkStr)) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Badge Calculation Logic
    const newBadges = new Set(user.badges || []);

    if (distinctSolvedIds.length >= 1) newBadges.add('Problem Solver');
    if (distinctSolvedIds.length >= 10) newBadges.add('Rising Star');
    if (distinctSolvedIds.length >= 50) newBadges.add('Algorithmist');
    if (currentStreak >= 3) newBadges.add('Consistent');
    if (currentStreak >= 7) newBadges.add('Streak Master');

    const updatedBadges = [...newBadges];

    // Check if we need to update User model with recalculated stats
    let needsUpdate = false;

    if (user.points !== calculatedPoints) {
      user.points = calculatedPoints;
      needsUpdate = true;
    }

    if (user.currentStreak !== currentStreak) {
      user.currentStreak = currentStreak;
      needsUpdate = true;
    }

    if (JSON.stringify(user.badges) !== JSON.stringify(updatedBadges)) {
      user.badges = updatedBadges;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await user.save();
    }

    // Always return calculated values for consistency
    res.json({
      success: true,
      data: {
        totalSolved: distinctSolvedIds.length,
        points: calculatedPoints, // user.points might be stale
        currentStreak: currentStreak,
        badges: user.badges || [],
        topicProgress,
        topicStats,
        difficultyStats,
        solvedProblems: distinctSolvedIds
      }
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/leaderboard
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['username', 'points', 'currentStreak', 'badges'],
            order: [['points', 'DESC']],
            limit: 10
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

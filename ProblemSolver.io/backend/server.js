const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const app = express();

/* ===============================
   MIDDLEWARE
================================ */

// Allow only frontend domain in production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   ROUTES
================================ */

app.use('/api/auth', require('./routes/auth'));
app.use('/api/problems', require('./routes/problems'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

/* ===============================
   HEALTH CHECK
================================ */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DSA Platform API running',
    environment: process.env.NODE_ENV || 'development'
  });
});

/* ===============================
   DATABASE INIT + SERVER START
================================ */

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync({ alter: false }); 
    console.log('Database synced.');

    // Seed only if empty
    const Problem = require('./models/Problem');
    const rawProblems = require('./data/problems.json');

    const count = await Problem.count();
    if (count === 0) {
      console.log('Seeding database...');

      const problemsToInsert = rawProblems.map(p => ({
        id: parseInt(p._id),
        title: p.title,
        description: p.description,
        category: p.category,
        difficulty: p.difficulty,
        constraints: p.constraints,
        sampleInput: p.sampleInput,
        sampleOutput: p.sampleOutput,
        explanation: p.explanation,
        solution: p.solution,
        testCases: p.testCases,
        isImportant: p.isImportant,
        isActive: p.isActive
      }));

      await Problem.bulkCreate(problemsToInsert);
      console.log('Seeding completed.');
    }

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Crash if DB fails (important for production)
  }
};

startServer();

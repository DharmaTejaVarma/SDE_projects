const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const submissionRoutes = require('./routes/submissions');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');
const leaderboardRoutes = require('./routes/leaderboard'); // New route import

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes); // New route registration

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DSA Platform API is running (SQLite)' });
});

// Database Connection & Seeding
const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected successfully.');

    // Sync models (create tables)
    await sequelize.sync({ alter: true }); // alter: true updates tables if models change
    console.log('Database synced.');

    // Seed Database
    const Problem = require('./models/Problem');
    // Load raw json
    const rawProblems = require('./data/problems.json');

    // Check if seeded
    const count = await Problem.count();
    if (count === 0) {
      console.log('Seeding database with problems...');

      // Transform _id to id if necessary, or just map fields
      const problemsToInsert = rawProblems.map(p => ({
        id: parseInt(p._id), // Convert "1" to 1
        title: p.title,
        description: p.description,
        category: p.category,
        difficulty: p.difficulty,
        constraints: p.constraints,
        sampleInput: p.sampleInput,
        sampleOutput: p.sampleOutput,
        explanation: p.explanation,
        solution: p.solution, // Sequelize handles JSON
        testCases: p.testCases, // Sequelize handles JSON
        isImportant: p.isImportant,
        isActive: p.isActive
      }));

      await Problem.bulkCreate(problemsToInsert);
      console.log('Database seeded successfully');
    }

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

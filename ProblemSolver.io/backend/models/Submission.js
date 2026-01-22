const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  problemId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false
  },
  functionName: {
    type: DataTypes.STRING,
    defaultValue: 'solve'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // accepted, wrong_answer, etc.
  },
  executionTime: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  memoryUsed: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  testCasesPassed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalTestCases: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  errorMessage: {
    type: DataTypes.TEXT
  }
});

module.exports = Submission;

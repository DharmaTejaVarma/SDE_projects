const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Problem = sequelize.define('Problem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  constraints: {
    type: DataTypes.TEXT
  },
  sampleInput: {
    type: DataTypes.TEXT
  },
  sampleOutput: {
    type: DataTypes.TEXT
  },
  explanation: {
    type: DataTypes.TEXT
  },
  solution: {
    type: DataTypes.JSON, // Stores { python: { code... }, java: ... }
    allowNull: false
  },
  testCases: {
    type: DataTypes.JSON, // Stores [{ input, expectedOutput }]
    defaultValue: []
  },
  isImportant: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
  // CreatedBy is omitted or can be just a UserId FK if needed, but for system problems it's null
});

module.exports = Problem;

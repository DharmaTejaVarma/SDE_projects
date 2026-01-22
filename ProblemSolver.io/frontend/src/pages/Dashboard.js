import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [progressRes, submissionsRes] = await Promise.all([
        axios.get('/api/progress'),
        axios.get('/api/submissions?limit=5')
      ]);
      setProgress(progressRes.data.data);
      setSubmissions(submissionsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const topics = [
    { key: 'arrays', name: 'Arrays' },
    { key: 'stacks', name: 'Stacks' },
    { key: 'queues', name: 'Queues' },
    { key: 'linkedLists', name: 'Linked Lists' },
    { key: 'trees', name: 'Trees' }
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="page-title">Welcome back, {user?.username}!</h1>
          <p className="page-subtitle">Track your progress and continue learning</p>
        </div>

        {/* Gamification Stats */}
        <div className="gamification-stats">
          <div className="game-stat-card points-card">
            <span className="game-icon">🏆</span>
            <div className="game-info">
              <h3>{progress?.points || 0}</h3>
              <p>Total Points</p>
            </div>
          </div>
          <div className="game-stat-card streak-card">
            <span className="game-icon">🔥</span>
            <div className="game-info">
              <h3>{progress?.currentStreak || 0} Days</h3>
              <p>Current Streak</p>
            </div>
          </div>
          <Link to="/leaderboard" className="leaderboard-banner">
            View Leaderboard ➔
          </Link>
        </div>

        {/* Recent Badges */}
        {progress?.badges && progress.badges.length > 0 && (
          <div className="badges-section">
            <h3>Your Badges</h3>
            <div className="badges-list">
              {progress.badges.map((badge, index) => (
                <span key={index} className="badge-pill">{badge}</span>
              ))}
            </div>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-value">{progress?.totalSolved || 0}</h3>
              <p className="stat-label">Problems Solved</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🟢</div>
            <div className="stat-content">
              <h3 className="stat-value">{progress?.difficultyStats?.easy?.solved || 0}</h3>
              <p className="stat-label">Easy Solved</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🟡</div>
            <div className="stat-content">
              <h3 className="stat-value">{progress?.difficultyStats?.medium?.solved || 0}</h3>
              <p className="stat-label">Medium Solved</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔴</div>
            <div className="stat-content">
              <h3 className="stat-value">{progress?.difficultyStats?.hard?.solved || 0}</h3>
              <p className="stat-label">Hard Solved</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <h2 className="section-title">Topic Progress</h2>
            <div className="topic-progress-list">
              {topics.map((topic) => {
                const percentage = progress?.topicProgress?.[topic.key] || 0;
                return (
                  <div key={topic.key} className="topic-progress-item">
                    <div className="topic-progress-header">
                      <span className="topic-name">{topic.name}</span>
                      <span className="topic-percentage">{percentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="topic-stats">
                      {progress?.topicStats?.[topic.key]?.solved || 0} / {progress?.topicStats?.[topic.key]?.total || 0} solved
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">Recent Submissions</h2>
            {submissions.length === 0 ? (
              <div className="empty-state">
                <p>No submissions yet. Start solving problems!</p>
                <Link to="/problems" className="btn btn-primary">
                  Browse Problems
                </Link>
              </div>
            ) : (
              <div className="submissions-list">
                {submissions.map((submission) => (
                  <div key={submission.id} className="submission-item">
                    <div className="submission-header">
                      <Link
                        to={`/problems/${submission.problemId?.id}`}
                        className="submission-problem"
                      >
                        {submission.problemId?.title}
                      </Link>
                      <span className={`submission-status ${submission.status.toLowerCase()}`}>
                        {submission.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="submission-meta">
                      <span>{submission.language.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
                <Link to="/problems" className="view-all-link" style={{ marginTop: '1rem', display: 'block', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  View All Submissions →
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <Link to="/problems" className="action-card">
            <div className="action-icon">💪</div>
            <h3>Practice Problems</h3>
            <p>Solve more problems to improve</p>
          </Link>
          <Link to="/learn" className="action-card">
            <div className="action-icon">📚</div>
            <h3>Learn Concepts</h3>
            <p>Explore data structures</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


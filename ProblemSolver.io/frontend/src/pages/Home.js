import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const dataStructures = [
    { name: 'Arrays', id: 'arrays', icon: '📊', color: '#2563eb' },
    { name: 'Stacks', id: 'stacks', icon: '📚', color: '#059669' },
    { name: 'Queues', id: 'queues', icon: '🔄', color: '#dc2626' },
    { name: 'Linked Lists', id: 'linkedLists', icon: '🔗', color: '#7c3aed' },
    { name: 'Trees', id: 'trees', icon: '🌳', color: '#d97706' },
    { name: 'Graphs', id: 'graphs', icon: '🕸️', color: '#0891b2' }
  ];

  const features = [
    {
      title: 'Comprehensive Learning',
      description: 'Master data structures and algorithms with in-depth explanations, visual representations, and practical examples.',
      icon: '🎯'
    },
    {
      title: 'Interactive Practice',
      description: 'Solve coding problems categorized by difficulty and topic. Get instant feedback and detailed solutions.',
      icon: '💻'
    },
    {
      title: 'Visual Learning',
      description: 'Understand complex concepts through interactive animations and step-by-step visualizations.',
      icon: '👁️'
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics, performance metrics, and personalized recommendations.',
      icon: '📈'
    }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            ProblemSolver.io
          </h1>
          <h2 className="hero-subtitle">
            Solve Smarter. Not Harder.
          </h2>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Learning Free
            </Link>
            <Link to="/problems" className="btn btn-outline btn-lg">
              Explore Problems
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="topics-section">
        <div className="container">
          <h2 className="section-title">Data Structures Covered</h2>
          <div className="topics-grid">
            {dataStructures.map((ds, index) => (
              <Link
                key={index}
                to={`/learn/${ds.id}`}
                className="topic-card card"
                style={{ '--topic-color': ds.color }}
              >
                <div className="topic-icon">{ds.icon}</div>
                <h3 className="topic-name">{ds.name}</h3>
                <p className="topic-description">
                  Master {ds.name.toLowerCase()} with interactive examples and comprehensive tutorials
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


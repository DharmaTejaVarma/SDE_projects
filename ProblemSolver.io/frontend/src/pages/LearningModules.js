import React from 'react';
import { Link } from 'react-router-dom';
import './LearningModules.css';

const LearningModules = () => {
  const modules = [
    {
      id: 'arrays',
      name: 'Arrays',
      icon: '📊',
      description: 'Learn about arrays, their operations, and common problems',
      color: '#6366f1'
    },
    {
      id: 'stacks',
      name: 'Stacks',
      icon: '📚',
      description: 'Understand stack data structure and LIFO principle',
      color: '#8b5cf6'
    },
    {
      id: 'queues',
      name: 'Queues',
      icon: '🔄',
      description: 'Master queue operations and FIFO principle',
      color: '#ec4899'
    },
    {
      id: 'linkedLists',
      name: 'Linked Lists',
      icon: '🔗',
      description: 'Learn about linked lists and their variations',
      color: '#10b981'
    },
    {
      id: 'trees',
      name: 'Trees',
      icon: '🌳',
      description: 'Explore tree data structures and traversals',
      color: '#f59e0b'
    },
    {
      id: 'graphs',
      name: 'Graphs',
      icon: '🕸️',
      description: 'Master graph theory and algorithms',
      color: '#0891b2'
    }
  ];

  return (
    <div className="learning-modules-page">
      <div className="container">
        <div className="modules-header">
          <h1 className="page-title">ProblemSolver.io Roadmap</h1>
          <p className="page-subtitle">
            Follow the path to master Data Structures & Algorithms
          </p>
        </div>

        <div className="roadmap-container">
          {modules.map((module, index) => (
            <div key={module.id} className="roadmap-step">
              <div className="step-connector">
                <div className="step-number" style={{ backgroundColor: module.color }}>
                  {index + 1}
                </div>
                {index < modules.length - 1 && <div className="step-line"></div>}
              </div>

              <Link
                to={`/learn/${module.id}`}
                className="module-card roadmap-card"
                style={{ '--module-color': module.color }}
              >
                <div className="module-icon" style={{ color: module.color }}>
                  {module.icon}
                </div>
                <div className="module-content">
                  <h2 className="module-name">{module.name}</h2>
                  <p className="module-description">{module.description}</p>
                  <span className="learn-more">Start Module →</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningModules;


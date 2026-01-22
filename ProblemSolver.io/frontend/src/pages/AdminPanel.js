import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('problems');
  const [problems, setProblems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [problemForm, setProblemForm] = useState({
    title: '',
    description: '',
    category: 'arrays',
    difficulty: 'easy',
    constraints: '',
    sampleInput: '',
    sampleOutput: '',
    explanation: '',
    solution: {
      code: '',
      language: 'python',
      timeComplexity: '',
      spaceComplexity: '',
      explanation: ''
    },
    testCases: [{ input: '', expectedOutput: '', isHidden: false }]
  });

  useEffect(() => {
    if (activeTab === 'problems') {
      fetchProblems();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/problems?limit=100');
      setProblems(response.data.data);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users?limit=100');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/problems', problemForm);
      alert('Problem created successfully!');
      setShowProblemForm(false);
      fetchProblems();
      resetProblemForm();
    } catch (error) {
      alert('Failed to create problem: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteProblem = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await axios.delete(`/api/admin/problems/${id}`);
        fetchProblems();
      } catch (error) {
        alert('Failed to delete problem');
      }
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      alert('Failed to update user role');
    }
  };

  const resetProblemForm = () => {
    setProblemForm({
      title: '',
      description: '',
      category: 'arrays',
      difficulty: 'easy',
      constraints: '',
      sampleInput: '',
      sampleOutput: '',
      explanation: '',
      solution: {
        code: '',
        language: 'python',
        timeComplexity: '',
        spaceComplexity: '',
        explanation: ''
      },
      testCases: [{ input: '', expectedOutput: '', isHidden: false }]
    });
  };

  return (
    <div className="admin-panel-page">
      <div className="container">
        <h1 className="page-title">Admin Panel</h1>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'problems' ? 'active' : ''}`}
            onClick={() => setActiveTab('problems')}
          >
            Problems
          </button>
          <button
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        {activeTab === 'problems' && (
          <div className="admin-section">
            <div className="admin-header">
              <h2>Manage Problems</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowProblemForm(!showProblemForm)}
              >
                {showProblemForm ? 'Cancel' : 'Add New Problem'}
              </button>
            </div>

            {showProblemForm && (
              <form className="problem-form card" onSubmit={handleProblemSubmit}>
                <h3>Create New Problem</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={problemForm.title}
                      onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-input"
                      value={problemForm.category}
                      onChange={(e) => setProblemForm({ ...problemForm, category: e.target.value })}
                      required
                    >
                      <option value="arrays">Arrays</option>
                      <option value="stacks">Stacks</option>
                      <option value="queues">Queues</option>
                      <option value="linkedLists">Linked Lists</option>
                      <option value="trees">Trees</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Difficulty</label>
                    <select
                      className="form-input"
                      value={problemForm.difficulty}
                      onChange={(e) => setProblemForm({ ...problemForm, difficulty: e.target.value })}
                      required
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-input form-textarea"
                    value={problemForm.description}
                    onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Constraints</label>
                  <textarea
                    className="form-input form-textarea"
                    value={problemForm.constraints}
                    onChange={(e) => setProblemForm({ ...problemForm, constraints: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Sample Input</label>
                    <textarea
                      className="form-input form-textarea"
                      value={problemForm.sampleInput}
                      onChange={(e) => setProblemForm({ ...problemForm, sampleInput: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Sample Output</label>
                    <textarea
                      className="form-input form-textarea"
                      value={problemForm.sampleOutput}
                      onChange={(e) => setProblemForm({ ...problemForm, sampleOutput: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Explanation</label>
                  <textarea
                    className="form-input form-textarea"
                    value={problemForm.explanation}
                    onChange={(e) => setProblemForm({ ...problemForm, explanation: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Solution Code</label>
                  <textarea
                    className="form-input form-textarea"
                    value={problemForm.solution.code}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        solution: { ...problemForm.solution, code: e.target.value }
                      })
                    }
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Time Complexity</label>
                    <input
                      type="text"
                      className="form-input"
                      value={problemForm.solution.timeComplexity}
                      onChange={(e) =>
                        setProblemForm({
                          ...problemForm,
                          solution: { ...problemForm.solution, timeComplexity: e.target.value }
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Space Complexity</label>
                    <input
                      type="text"
                      className="form-input"
                      value={problemForm.solution.spaceComplexity}
                      onChange={(e) =>
                        setProblemForm({
                          ...problemForm,
                          solution: { ...problemForm.solution, spaceComplexity: e.target.value }
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Solution Explanation</label>
                  <textarea
                    className="form-input form-textarea"
                    value={problemForm.solution.explanation}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        solution: { ...problemForm.solution, explanation: e.target.value }
                      })
                    }
                    required
                    placeholder="Explain the solution approach"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Create Problem
                </button>
              </form>
            )}

            {loading ? (
              <div className="spinner"></div>
            ) : (
              <div className="problems-table">
                {problems.map((problem) => (
                  <div key={problem._id} className="problem-row card">
                    <div className="problem-info">
                      <h3>{problem.title}</h3>
                      <div className="problem-meta">
                        <span className={`badge badge-${problem.difficulty}`}>
                          {problem.difficulty}
                        </span>
                        <span>{problem.category}</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteProblem(problem._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-section">
            <h2>Manage Users</h2>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <div className="users-table">
                {users.map((user) => (
                  <div key={user._id} className="user-row card">
                    <div className="user-info">
                      <h3>{user.username}</h3>
                      <p>{user.email}</p>
                      <span className={`role-badge ${user.role}`}>{user.role}</span>
                    </div>
                    <select
                      className="form-input"
                      value={user.role}
                      onChange={(e) => handleUserRoleChange(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;


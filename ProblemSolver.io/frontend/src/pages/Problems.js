import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import importantProblemsData from '../data/importantProblems.json'; // Removed unused import
import './Problems.css';

const Problems = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    return {
      category: params.get('category') || '',
      difficulty: params.get('difficulty') || '',
      search: params.get('search') || ''
    };
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Update filters if URL changes (e.g. back button or navigation)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters(prev => ({
      ...prev,
      category: params.get('category') || '',
      difficulty: params.get('difficulty') || '',
      search: params.get('search') || ''
    }));
  }, [location.search]);

  useEffect(() => {
    fetchProblems();
  }, [filters, page]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters.search) queryParams.append('search', filters.search);
      queryParams.append('page', page);
      queryParams.append('limit', 10);

      const response = await fetch(`/api/problems?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProblems(data.data);
        setTotalPages(data.pages);
        setTotalItems(data.total);
      } else {
        console.error('Failed to fetch problems:', data.message);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  const getDifficultyBadgeClass = (difficulty) => {
    return `badge badge-${difficulty}`;
  };

  const getCategoryDisplayName = (category) => {
    const names = {
      arrays: 'Arrays',
      stacks: 'Stacks',
      queues: 'Queues',
      linkedLists: 'Linked Lists',
      trees: 'Trees',
      graphs: 'Graphs'
    };
    return names[category] || category;
  };

  return (
    <div className="problems-page">
      <div className="container">
        <h1 className="page-title">Problem Repository</h1>

        <div className="filters-section">
          <div className="filter-group">
            <label>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="form-input"
            >
              <option value="">All Categories</option>
              <option value="arrays">Arrays</option>
              <option value="stacks">Stacks</option>
              <option value="queues">Queues</option>
              <option value="linkedLists">Linked Lists</option>
              <option value="trees">Trees</option>
              <option value="graphs">Graphs</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty</label>
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="form-input"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search problems..."
              className="form-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : problems.length === 0 ? (
          <div className="empty-state">
            <p>No problems found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="problems-list">
              {problems.map((problem) => {
                const isSolved = user &&
                  (Array.isArray(user.solvedProblems)
                    ? user.solvedProblems.includes(problem.id)
                    : (typeof user.solvedProblems === 'string' && JSON.parse(user.solvedProblems).includes(problem.id)));

                return (
                  <Link
                    key={problem.id}
                    to={`/problems/${problem.id}`}
                    className={`problem-card card ${isSolved ? 'solved' : ''}`}
                  >
                    <div className="problem-header">
                      <h3 className="problem-title">
                        {problem.title}
                        {isSolved && <span className="completed-mark" title="Solved">✅</span>}
                      </h3>
                      <div className="badges-row">
                        <span className={getDifficultyBadgeClass(problem.difficulty)}>
                          {problem.difficulty}
                        </span>
                        {isSolved && <span className="badge badge-success">Accepted</span>}
                      </div>
                    </div>
                    <div className="problem-meta">
                      <span className="problem-category">
                        {getCategoryDisplayName(problem.category)}
                      </span>
                    </div>
                    <p className="problem-description">
                      {problem.description.substring(0, 150)}...
                    </p>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Problems;


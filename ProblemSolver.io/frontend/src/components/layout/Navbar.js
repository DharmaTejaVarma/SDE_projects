import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.svg" alt="Logo" />
        </Link>

        <button
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={isActiveLink('/') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/learn"
              onClick={() => setIsMenuOpen(false)}
              className={isActiveLink('/learn') ? 'active' : ''}
            >
              Learn
            </Link>
          </li>
          <li>
            <Link
              to="/problems"
              onClick={() => setIsMenuOpen(false)}
              className={isActiveLink('/problems') ? 'active' : ''}
            >
              Problems
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={isActiveLink('/dashboard') ? 'active' : ''}
                >
                  Dashboard
                </Link>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={isActiveLink('/admin') ? 'active' : ''}
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li className="navbar-user">
                <span className="user-name">Welcome, {user?.username}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="btn btn-outline btn-sm">Login</button>
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <button className="btn btn-primary btn-sm">Sign Up</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


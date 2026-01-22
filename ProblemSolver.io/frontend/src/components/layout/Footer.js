import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h2 className="footer-logo"><img src="/logo.svg" alt="Logo" /></h2>
                        <p className="footer-description">
                            Master Data Structures and Algorithms with our comprehensive problem set and learning modules.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h3>Platform</h3>
                        <ul>
                            <li><Link to="/problems">Problems</Link></li>
                            <li><Link to="/learn">Learning Modules</Link></li>
                            <li><Link to="/leaderboard">Leaderboard</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h3>Connect</h3>
                        <ul>
                            <li><a href="#">GitHub</a></li>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} ProblemSolver.io. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

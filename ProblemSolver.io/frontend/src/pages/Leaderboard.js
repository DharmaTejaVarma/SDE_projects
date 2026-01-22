import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get('/api/leaderboard');
                setUsers(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div className="container" style={{ padding: '50px', textAlign: 'center' }}>Loading Leaderboard...</div>;

    return (
        <div className="leaderboard-page">
            <div className="container">
                <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '40px' }}>🏆 Global Leaderboard</h1>

                <div className="leaderboard-card">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>User</th>
                                <th>Points</th>
                                <th>Streak</th>
                                <th>Badges</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => {
                                const getBadgeCount = (badgesData) => {
                                    if (!badgesData) return 0;
                                    try {
                                        // If it's already an array (Sequelize JSON handling)
                                        if (Array.isArray(badgesData)) return badgesData.length;
                                        // If it's a string, try parsing
                                        if (typeof badgesData === 'string' && badgesData.trim() !== '') {
                                            const parsed = JSON.parse(badgesData);
                                            return Array.isArray(parsed) ? parsed.length : 0;
                                        }
                                        return 0;
                                    } catch (e) {
                                        return 0;
                                    }
                                };
                                const badgeCount = getBadgeCount(user.badges);

                                return (
                                    <tr key={user.username} className={`rank-${index + 1}`}>
                                        <td className="rank-cell">
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </td>
                                        <td className="user-cell">
                                            <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                                            <span>{user.username}</span>
                                        </td>
                                        <td className="points-cell">{user.points || 0}</td>
                                        <td>{user.currentStreak > 0 ? `${user.currentStreak} 🔥` : '-'}</td>
                                        <td>
                                            {badgeCount > 0 ? (
                                                <span className="badge-count">{badgeCount} 🏅</span>
                                            ) : (
                                                <span style={{ color: '#9ca3af' }}>-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;

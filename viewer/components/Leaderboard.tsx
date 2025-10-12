
import React, { useState, useEffect } from 'react';
import { fetchLeaderboardData, LeaderboardEntry } from '../services/blockchainService';
import './Leaderboard.css';

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData()
      .then(leaderboardData => {
        setData(leaderboardData);
        setIsLoading(false);
      })
      .catch(() => {
        setData(null);
        setIsLoading(false);
        // อาจจะแสดงข้อความ Error ที่นี่
      });
  }, []);

  if (isLoading) {
    return <div className="leaderboard-container"><h2>🏆 Leaderboard</h2><p>กำลังโหลดอันดับ...</p></div>;
  }

  if (!data) {
    return <div className="leaderboard-container"><h2>🏆 Leaderboard</h2><p>ไม่สามารถโหลดข้อมูลได้</p></div>;
  }

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="rank-cell">Rank</th>
            <th>User</th>
            <th className="tier-cell">Tier</th>
            <th className="badges-cell">Badges</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => (
            // Highlight แถวของผู้ใช้คนพิเศษ
            <tr key={user.address} className={user.isSpecialUser ? 'highlight-row' : ''}>
              <td className="rank-cell">{user.rank}</td>
              <td className="address-cell">{user.address}</td>
              <td className="tier-cell">{user.tier}</td>
              <td className="badges-cell">{user.badgeCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

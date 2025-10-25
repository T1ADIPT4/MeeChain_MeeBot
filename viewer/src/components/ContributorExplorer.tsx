import React, { useState, useEffect } from 'react';
import { fetchContributors, type Contributor } from '../services/contributorService';
import './ContributorExplorer.css';

interface ContributorExplorerProps {
  badgeContractAddress?: string;
}

export default function ContributorExplorer({ 
  badgeContractAddress = '0x...' 
}: ContributorExplorerProps) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [minReputation, setMinReputation] = useState<number>(0);
  const [selectedBadge, setSelectedBadge] = useState<string>('');

  useEffect(() => {
    loadContributors();
  }, []);

  const loadContributors = async () => {
    try {
      setLoading(true);
      const data = await fetchContributors();
      setContributors(data);
    } catch (error) {
      console.error('Failed to load contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter contributors based on search and filters
  const filteredContributors = contributors.filter(contributor => {
    const matchesSearch = 
      contributor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contributor.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesReputation = contributor.reputation >= minReputation;
    
    const matchesBadge = !selectedBadge || 
      contributor.badges.some(badge => badge.toLowerCase().includes(selectedBadge.toLowerCase()));

    return matchesSearch && matchesReputation && matchesBadge;
  });

  // Get unique badge types for filter
  const allBadges = Array.from(
    new Set(contributors.flatMap(c => c.badges))
  );

  if (loading) {
    return (
      <div className="explorer-container">
        <h2>🌐 Contributor Explorer</h2>
        <p>Loading contributors...</p>
      </div>
    );
  }

  return (
    <div className="explorer-container">
      <h2>🌐 Contributor Explorer</h2>
      
      {/* Search and Filter Section */}
      <div className="explorer-filters">
        <input
          type="text"
          placeholder="ค้นหาด้วย address หรือชื่อ"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        <div className="filter-group">
          <label>
            Reputation ขั้นต่ำ:
            <input
              type="number"
              min="0"
              value={minReputation}
              onChange={(e) => setMinReputation(Number(e.target.value))}
              className="reputation-filter"
            />
          </label>
          
          <label>
            Badge:
            <select
              value={selectedBadge}
              onChange={(e) => setSelectedBadge(e.target.value)}
              className="badge-filter"
            >
              <option value="">ทั้งหมด</option>
              {allBadges.map(badge => (
                <option key={badge} value={badge}>{badge}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        แสดง {filteredContributors.length} จาก {contributors.length} contributors
      </div>

      {/* Contributors Table */}
      <div className="table-container">
        <table className="contributors-table">
          <thead>
            <tr>
              <th>ชื่อ / Address</th>
              <th>คะแนน</th>
              <th>Badge</th>
              <th>ตรวจสอบ</th>
            </tr>
          </thead>
          <tbody>
            {filteredContributors.length === 0 ? (
              <tr>
                <td colSpan={4} className="no-results">
                  ไม่พบผู้มีส่วนร่วมที่ตรงกับเงื่อนไข
                </td>
              </tr>
            ) : (
              filteredContributors.map((contributor) => (
                <tr key={contributor.address} className="contributor-row">
                  <td className="contributor-identity">
                    <div className="identity-wrapper">
                      <strong>{contributor.name || 'Anonymous'}</strong>
                      <span className="address-short" title={contributor.address}>
                        {contributor.address.slice(0, 6)}...{contributor.address.slice(-4)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="reputation-cell">
                    <span className="reputation-score">
                      ⭐ {contributor.reputation}
                    </span>
                  </td>
                  
                  <td className="badges-cell">
                    <div className="badge-list">
                      {contributor.badges.length === 0 ? (
                        <span className="no-badges">-</span>
                      ) : (
                        contributor.badges.map((badge, index) => (
                          <span 
                            key={index} 
                            className="badge-item"
                            title={badge}
                          >
                            {badge}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <a
                        href={`https://bscscan.com/token/${badgeContractAddress}?a=${contributor.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="verify-link"
                      >
                        ดูบน BscScan
                      </a>
                      <a
                        href={`/contributors/${contributor.address}`}
                        className="profile-link"
                      >
                        โปรไฟล์
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Top Contributors Section */}
      {filteredContributors.length > 0 && (
        <div className="top-contributors">
          <h3>🏆 Top Contributors</h3>
          <div className="top-list">
            {filteredContributors
              .sort((a, b) => b.reputation - a.reputation)
              .slice(0, 5)
              .map((contributor, index) => (
                <div key={contributor.address} className="top-contributor-item">
                  <span className="rank">#{index + 1}</span>
                  <span className="name">{contributor.name || 'Anonymous'}</span>
                  <span className="score">⭐ {contributor.reputation}</span>
                  <span className="badge-count">
                    🏅 {contributor.badges.length} badges
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

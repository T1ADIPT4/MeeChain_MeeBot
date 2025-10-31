import { useState, useEffect } from 'react';
import { getAllContributors, initMockData } from '../services/contributorReputationService';
import type { ContributorData } from '../services/contributorReputationService';

export default function ContributorLeaderboard() {
  const [contributors, setContributors] = useState<ContributorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      initMockData();
      const data = getAllContributors();
      setContributors(data);
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <div className="leaderboard" style={{
      background: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginTop: '2rem',
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#1a202c',
      }}>
        🏆 Contributor Leaderboard
      </h2>

      {loading ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[...Array(5)].map((_, i) => (
            <li key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem', marginBottom: '0.5rem', background: '#f7fafc', borderRadius: '0.5rem',
              opacity: 0.7, minHeight: '56px',
              animation: 'pulse 1.2s infinite ease-in-out',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ background: '#e2e8f0', borderRadius: '50%', width: 32, height: 32, display: 'inline-block' }} />
                <div>
                  <div style={{ background: '#e2e8f0', height: 16, width: 100, borderRadius: 8, marginBottom: 6 }} />
                  <div style={{ background: '#e2e8f0', height: 12, width: 60, borderRadius: 6 }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ background: '#e2e8f0', height: 20, width: 40, borderRadius: 8 }} />
                <span style={{ background: '#e2e8f0', height: 20, width: 32, borderRadius: 8 }} />
              </div>
            </li>
          ))}
        </ul>
      ) : contributors.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#718096', padding: '2rem 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🤖</div>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>
            ยังไม่มีผู้มีส่วนร่วมในระบบ
          </div>
          <div style={{ fontSize: '0.95rem', color: '#a0aec0' }}>
            เมื่อมีผู้ร่วมกิจกรรมหรือรีวิว ระบบจะแสดงอันดับที่นี่<br />
            ชวนเพื่อนมาร่วมสร้างสรรค์ MeeChain ด้วยกันนะ!
          </div>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {contributors.map((contributor, index) => (
            <li
              key={contributor.address}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                marginBottom: '0.5rem',
                background: index < 3 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f7fafc',
                borderRadius: '0.5rem',
                color: index < 3 ? 'white' : '#1a202c',
                transition: 'transform 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  minWidth: '2rem',
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                </span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                    {contributor.name || `${contributor.address.slice(0, 6)}...${contributor.address.slice(-4)}`}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    opacity: 0.8,
                    marginTop: '0.25rem',
                  }}>
                    {contributor.actions.length} actions
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                }}>
                  ⭐ {contributor.score}
                </span>
                <div style={{
                  display: 'flex',
                  gap: '0.25rem',
                  fontSize: '1.25rem',
                }}>
                  {contributor.badges.length > 0 ? (
                    contributor.badges.map(badge => (
                      <span key={badge} title={badge}>
                        {badge === 'Watchdog' ? '🛡️' :
                          badge === 'Validator' ? '✅' :
                            badge === 'Guardian' ? '🏰' :
                              badge === 'Champion' ? '👑' : '🏅'}
                      </span>
                    ))
                  ) : (
                    <span style={{ opacity: 0.5 }}>-</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#edf2f7',
        borderRadius: '0.5rem',
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          marginBottom: '0.75rem',
          color: '#2d3748',
        }}>
          🏅 Badge Legend
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.5rem',
          fontSize: '0.875rem',
        }}>
          <div>🛡️ Watchdog - 10+ points</div>
          <div>✅ Validator - 50+ points</div>
          <div>🏰 Guardian - 100+ points</div>
          <div>👑 Champion - 200+ points</div>
        </div>
      </div>
    </div>
  );
}

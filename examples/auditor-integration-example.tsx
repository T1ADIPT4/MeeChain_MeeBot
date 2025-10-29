/**
 * Auditor Dashboard Integration Example
 * Shows how to integrate the Auditor Dashboard into an existing React app
 */

import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuditorDashboard } from '../components/AuditorDashboard'
import { initializeMockData } from '../utils/auditorMockData'

/**
 * Example: Main App with Navigation
 */
export function App() {
  const [auditorAddress, setAuditorAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  // Initialize mock data on mount
  useEffect(() => {
    initializeMockData().catch(console.error)
  }, [])

  // Simulate wallet connection
  const connectWallet = async () => {
    // In production, use Web3/ethers.js to connect wallet
    const mockAddress = '0xAuditor123456789012345678901234567890AB'
    setAuditorAddress(mockAddress)
    setIsConnected(true)
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navigation Bar */}
        <nav style={{
          background: '#1e293b',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>
              Home
            </Link>
            <Link to="/auditor" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>
              Auditor Dashboard
            </Link>
            <Link to="/badges" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>
              My Badges
            </Link>
          </div>
          
          {!isConnected ? (
            <button
              onClick={connectWallet}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <div style={{ color: 'white', fontFamily: 'monospace' }}>
              {auditorAddress.slice(0, 6)}...{auditorAddress.slice(-4)}
            </div>
          )}
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/auditor"
            element={
              isConnected ? (
                <AuditorDashboard auditorAddress={auditorAddress} />
              ) : (
                <NotConnectedPage onConnect={connectWallet} />
              )
            }
          />
          <Route path="/badges" element={<BadgesPage auditorAddress={auditorAddress} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

/**
 * Home Page
 */
function HomePage() {
  return (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Welcome to MeeChain Auditor Dashboard
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '2rem' }}>
        Participate in governance by auditing refund transactions and earn reputation points and badges.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <FeatureCard
          icon="🛡️"
          title="Audit Transactions"
          description="Review and flag suspicious refund transactions"
        />
        <FeatureCard
          icon="🏆"
          title="Earn Reputation"
          description="Build your reputation score through quality audits"
        />
        <FeatureCard
          icon="🏅"
          title="Unlock Badges"
          description="Collect badges as you reach milestones"
        />
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', background: '#f8fafc', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>How It Works</h2>
        <ol style={{ lineHeight: '2', color: '#475569' }}>
          <li>Connect your wallet to get started</li>
          <li>Navigate to the Auditor Dashboard</li>
          <li>Review refund transaction logs</li>
          <li>Flag suspicious transactions with detailed reasons</li>
          <li>Complete reviews for verified transactions</li>
          <li>Earn reputation points and unlock badges</li>
        </ol>
      </div>
    </div>
  )
}

/**
 * Feature Card Component
 */
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style={{
      padding: '2rem',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{description}</p>
    </div>
  )
}

/**
 * Not Connected Page
 */
function NotConnectedPage({ onConnect }: { onConnect: () => void }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '3rem'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔌</div>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Connect Your Wallet</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem', textAlign: 'center', maxWidth: '400px' }}>
        Please connect your wallet to access the Auditor Dashboard and start earning reputation.
      </p>
      <button
        onClick={onConnect}
        style={{
          background: '#667eea',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '1rem'
        }}
      >
        Connect Wallet
      </button>
    </div>
  )
}

/**
 * Badges Page
 */
function BadgesPage({ auditorAddress }: { auditorAddress: string }) {
  const [badges, setBadges] = useState<any[]>([])
  const [reputation, setReputation] = useState<any>(null)

  useEffect(() => {
    if (auditorAddress) {
      // Import services dynamically
      import('../src/services/badgeService').then(({ getUserBadges }) => {
        setBadges(getUserBadges(auditorAddress))
      })
      import('../src/services/reputationService').then(({ getReputation }) => {
        setReputation(getReputation(auditorAddress))
      })
    }
  }, [auditorAddress])

  if (!auditorAddress) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p>Please connect your wallet to view your badges</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>My Badges</h1>

      {reputation && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          borderRadius: '12px',
          color: 'white',
          marginBottom: '3rem',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700 }}>{reputation.score}</div>
            <div style={{ opacity: 0.9 }}>Total Score</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700 }}>{reputation.flags}</div>
            <div style={{ opacity: 0.9 }}>Flags</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700 }}>{reputation.reviews}</div>
            <div style={{ opacity: 0.9 }}>Reviews</div>
          </div>
        </div>
      )}

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        Earned Badges ({badges.length})
      </h2>

      {badges.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{badge.icon}</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{badge.name}</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {badge.description}
              </p>
              {badge.unlockedAt && (
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: '#f8fafc',
          padding: '4rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎖️</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No badges yet</h3>
          <p style={{ color: '#64748b' }}>
            Start auditing transactions to earn your first badge!
          </p>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '2rem', background: '#f8fafc', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Available Badges</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <BadgeRequirement icon="🛡️" name="Watchdog" requirement="5 validated flags" />
          <BadgeRequirement icon="🔍" name="Truth Seeker" requirement="10 completed reviews" />
          <BadgeRequirement icon="📜" name="Auditor OG" requirement="100 reputation points" />
          <BadgeRequirement icon="👁️" name="Eagle Eye" requirement="20 validated flags" />
          <BadgeRequirement icon="⭐" name="Master Auditor" requirement="50 completed reviews" />
          <BadgeRequirement icon="🏆" name="Legend" requirement="500 reputation points" />
        </div>
      </div>
    </div>
  )
}

function BadgeRequirement({ icon, name, requirement }: { icon: string; name: string; requirement: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      background: 'white',
      borderRadius: '8px'
    }}>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{requirement}</div>
      </div>
    </div>
  )
}

/**
 * Example: Standalone Auditor Page (without routing)
 */
export function StandaloneAuditorPage() {
  const [auditorAddress] = useState('0xAuditor123456789012345678901234567890AB')

  useEffect(() => {
    initializeMockData().catch(console.error)
  }, [])

  return <AuditorDashboard auditorAddress={auditorAddress} />
}

/**
 * Example: Embedded Auditor Widget (smaller version)
 */
export function AuditorWidget({ auditorAddress }: { auditorAddress: string }) {
  const [reputation, setReputation] = useState<any>(null)
  const [badges, setBadges] = useState<any[]>([])

  useEffect(() => {
    if (auditorAddress) {
      import('../src/services/reputationService').then(({ getReputation }) => {
        setReputation(getReputation(auditorAddress))
      })
      import('../src/services/badgeService').then(({ getUserBadges }) => {
        setBadges(getUserBadges(auditorAddress))
      })
    }
  }, [auditorAddress])

  if (!reputation) return null

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      maxWidth: '400px'
    }}>
      <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
        🛡️ Auditor Stats
      </h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
            {reputation.score}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Score</div>
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
            {reputation.flags}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Flags</div>
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
            {reputation.reviews}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Reviews</div>
        </div>
      </div>

      {badges.length > 0 && (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Badges ({badges.length})
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {badges.map((badge) => (
              <span key={badge.id} title={badge.name} style={{ fontSize: '1.5rem' }}>
                {badge.icon}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => window.location.href = '/auditor'}
        style={{
          marginTop: '1rem',
          width: '100%',
          padding: '0.75rem',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        Open Dashboard
      </button>
    </div>
  )
}

export default App

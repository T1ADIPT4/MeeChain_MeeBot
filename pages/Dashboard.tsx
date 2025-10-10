// pages/Dashboard.tsx

import React, { useState, useEffect } from 'react'
import { MeeBot } from '../components/MeeBot'

// Types for dashboard data
interface BadgeInfo {
  questId: string
  badgeId: string
  timestamp: Date
  network: string
  chain: 'primary' | 'fallback'
  txHash: string
  contractAddress: string
}

interface NetworkInfo {
  name: string
  chainId: number
  badgeContract: string
  questContract: string
  fallbackContract: string
}

interface FallbackLog {
  timestamp: Date
  userId: string
  questId: string
  reason: string
  network: string
  success: boolean
}

export default function DashboardPage() {
  const [badges, setBadges] = useState<BadgeInfo[]>([])
  const [networks, setNetworks] = useState<NetworkInfo[]>([])
  const [fallbackLogs, setFallbackLogs] = useState<FallbackLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all')

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    setLoading(true)
    MeeBot.setSprite('loading')
    
    try {
      // Load registry data
      const registryModule = await import('../src/config/registryLoader')
      const registry = registryModule.loadRegistry()
      
      // Parse networks
      const networkList: NetworkInfo[] = Object.entries(registry.networks).map(([name, config]: [string, any]) => ({
        name,
        chainId: config.chainId,
        badgeContract: config.badgeContract,
        questContract: config.questContract,
        fallbackContract: config.fallbackContract,
      }))
      setNetworks(networkList)
      
      // Load logs to get badge minting history
      const loggerModule = await import('../src/utils/logger')
      const logs = loggerModule.getLogs()
      
      // Extract badge minting logs
      const badgeLogs = logs.filter(log => 
        log.eventType === 'badge-minted' || log.eventType === 'badge-fallback-minted'
      )
      
      const badgeList: BadgeInfo[] = badgeLogs.map(log => ({
        questId: log.context.questId || 'unknown',
        badgeId: log.context.badgeId || 'unknown',
        timestamp: log.timestamp,
        network: log.context.network || 'unknown',
        chain: log.eventType === 'badge-fallback-minted' ? 'fallback' : 'primary',
        txHash: log.context.tx || 'unknown',
        contractAddress: log.context.contractAddress || 'unknown',
      }))
      setBadges(badgeList)
      
      // Extract fallback logs
      const fallbackLogList: FallbackLog[] = logs
        .filter(log => log.eventType === 'badge-fallback-minted' || log.eventType === 'badge-mint-failed')
        .map(log => ({
          timestamp: log.timestamp,
          userId: log.context.userId || 'unknown',
          questId: log.context.questId || 'unknown',
          reason: log.eventType === 'badge-mint-failed' ? 'Primary chain failed' : 'Fallback used',
          network: log.context.network || 'unknown',
          success: log.eventType === 'badge-fallback-minted',
        }))
      setFallbackLogs(fallbackLogList)
      
      MeeBot.setSprite('neutral')
      MeeBot.speak('ยินดีต้อนรับสู่แดชบอร์ด MeeChain! ตรวจสอบ badge และ fallback log ของคุณได้ที่นี่')
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      MeeBot.setSprite('confused')
      MeeBot.speak('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const filteredBadges = selectedNetwork === 'all' 
    ? badges 
    : badges.filter(b => b.network === selectedNetwork)

  if (loading) {
    return (
      <div className="dashboard-container">
        <p>กำลังโหลดข้อมูลแดชบอร์ด...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <h1>📊 MeeChain Dashboard</h1>
      
      {/* Network Information */}
      <section className="network-section">
        <h2>🌐 Networks</h2>
        <div className="network-grid">
          {networks.map(network => (
            <div key={network.name} className="network-card">
              <h3>{network.name.toUpperCase()}</h3>
              <p>Chain ID: {network.chainId}</p>
              <p>Badge: {network.badgeContract}</p>
              <p>Quest: {network.questContract}</p>
              <p>Fallback: {network.fallbackContract}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Badge Information */}
      <section className="badge-section">
        <h2>🏆 Your Badges</h2>
        <div className="filter-controls">
          <label>Filter by network: </label>
          <select 
            value={selectedNetwork} 
            onChange={(e) => setSelectedNetwork(e.target.value)}
          >
            <option value="all">All Networks</option>
            {networks.map(n => (
              <option key={n.name} value={n.name}>{n.name}</option>
            ))}
          </select>
        </div>
        
        {filteredBadges.length === 0 ? (
          <p>No badges found. Complete quests to earn badges!</p>
        ) : (
          <div className="badge-list">
            {filteredBadges.map((badge, idx) => (
              <div key={idx} className="badge-item">
                <h4>{badge.badgeId}</h4>
                <p>Quest: {badge.questId}</p>
                <p>Network: {badge.network}</p>
                <p>Chain: {badge.chain === 'fallback' ? '⚠️ Fallback' : '✅ Primary'}</p>
                <p>TX: {badge.txHash.substring(0, 10)}...</p>
                <p>Time: {new Date(badge.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Fallback Logs */}
      <section className="fallback-section">
        <h2>⚠️ Fallback Log & Provenance</h2>
        {fallbackLogs.length === 0 ? (
          <p>No fallback events recorded.</p>
        ) : (
          <div className="fallback-log">
            {fallbackLogs.map((log, idx) => (
              <div key={idx} className={`log-item ${log.success ? 'success' : 'failed'}`}>
                <p>🕒 {new Date(log.timestamp).toLocaleString()}</p>
                <p>User: {log.userId}</p>
                <p>Quest: {log.questId}</p>
                <p>Reason: {log.reason}</p>
                <p>Network: {log.network}</p>
                <p>Status: {log.success ? '✅ Success' : '❌ Failed'}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

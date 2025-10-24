// pages/Dashboard.tsx

import React, { useState, useEffect } from 'react'
import MeeBotAvatar from '../components/MeeBotAvatar'
import { MeeBot } from '../components/MeeBot'
import meeBotAnimation from '../assets/meeBot.json'


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


  // (Removed duplicate imports; all imports should be at the top level)

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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <MeeBotAvatar />
          <p className="text-xl font-bold text-[#00E0CA]">กำลังโหลดข้อมูลแดชบอร์ด...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 relative">
      {/* MeeBot Avatar in header */}
      <div className="absolute top-6 right-6 z-10">
        <MeeBotAvatar />
      </div>

      <h1 className="text-3xl font-bold mb-8 text-[#00E0CA] flex items-center gap-3">
        <span>📊 MeeChain Dashboard</span>
        <span className="bg-[#3B82F6] text-white px-3 py-1 rounded-full text-base font-semibold shadow">Web3</span>
      </h1>

      {/* Network Information */}
      <section className="network-section mb-8">
        <h2 className="text-xl font-bold mb-2 text-[#3B82F6]">🌐 Networks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {networks.map(network => (
            <div key={network.name} className="bg-gray-800 rounded-xl shadow-lg p-5 text-white space-y-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl border border-[#00E0CA]">
              <h3 className="font-bold text-[#00E0CA] text-lg">{network.name.toUpperCase()}</h3>
              <p>Chain ID: <span className="text-[#3B82F6]">{network.chainId}</span></p>
              <p>Badge: {network.badgeContract}</p>
              <p>Quest: {network.questContract}</p>
              <p>Fallback: <span className="text-yellow-400">{network.fallbackContract}</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* Badge Information */}
      <section className="badge-section mb-8">
        <h2 className="text-xl font-bold mb-2 text-yellow-400">🏆 Your Badges</h2>
        <div className="filter-controls mb-4">
          <label className="mr-2">Filter by network: </label>
          <select
            title="Filter by network"
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="bg-gray-700 text-white rounded px-2 py-1 border border-[#00E0CA]"
          >
            <option value="all">All Networks</option>
            {networks.map(n => (
              <option key={n.name} value={n.name}>{n.name}</option>
            ))}
          </select>
        </div>

        {filteredBadges.length === 0 ? (
          <p className="text-gray-400">No badges found. Complete quests to earn badges!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBadges.map((badge, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl shadow-lg p-5 text-white space-y-1 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl border border-yellow-400">
                <h4 className="font-bold text-yellow-400 text-lg">{badge.badgeId}</h4>
                <p>Quest: {badge.questId}</p>
                <p>Network: <span className="text-[#00E0CA]">{badge.network}</span></p>
                <p>Chain: {badge.chain === 'fallback' ? <span className="text-red-400">⚠️ Fallback</span> : <span className="text-green-400">✅ Primary</span>}</p>
                <p>TX: <span className="text-gray-300">{badge.txHash.substring(0, 10)}...</span></p>
                <p>Time: <span className="text-gray-400">{new Date(badge.timestamp).toLocaleString()}</span></p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fallback Logs */}
      <section className="fallback-section">
        <h2 className="text-xl font-bold mb-2 text-red-400">⚠️ Fallback Log & Provenance</h2>
        {fallbackLogs.length === 0 ? (
          <p className="text-gray-400">No fallback events recorded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fallbackLogs.map((log, idx) => (
              <div key={idx} className={`bg-gray-800 rounded-xl shadow-lg p-5 text-white space-y-1 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl border-l-4 ${log.success ? 'border-green-400' : 'border-red-400'}`}>
                <p>🕒 <span className="text-gray-400">{new Date(log.timestamp).toLocaleString()}</span></p>
                <p>User: <span className="text-[#00E0CA]">{log.userId}</span></p>
                <p>Quest: {log.questId}</p>
                <p>Reason: <span className="text-yellow-400">{log.reason}</span></p>
                <p>Network: <span className="text-[#3B82F6]">{log.network}</span></p>
                <p>Status: {log.success ? <span className="text-green-400">✅ Success</span> : <span className="text-red-400">❌ Failed</span>}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}


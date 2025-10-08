// pages/Admin.tsx

import React, { useState, useEffect } from 'react'
import { MeeBot } from '../components/MeeBot'

// Types for admin panel
interface NetworkConfig {
  name: string
  chainId: number
  badgeContract: string
  questContract: string
  fallbackContract: string
}

interface DeploymentLog {
  timestamp: Date
  network: string
  contractType: string
  address: string
  status: 'success' | 'failed'
}

export default function AdminPage() {
  const [networks, setNetworks] = useState<NetworkConfig[]>([])
  const [selectedNetwork, setSelectedNetwork] = useState<string>('polygon')
  const [deploymentLogs, setDeploymentLogs] = useState<DeploymentLog[]>([])
  const [loading, setLoading] = useState(true)
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json')

  useEffect(() => {
    loadAdminData()
  }, [])

  async function loadAdminData() {
    setLoading(true)
    MeeBot.setSprite('loading')
    
    try {
      const registryModule = await import('../src/config/registryLoader')
      const registry = registryModule.loadRegistry()
      
      // Parse networks
      const networkList: NetworkConfig[] = Object.entries(registry.networks).map(([name, config]: [string, any]) => ({
        name,
        chainId: config.chainId,
        badgeContract: config.badgeContract,
        questContract: config.questContract,
        fallbackContract: config.fallbackContract,
      }))
      setNetworks(networkList)
      
      // Load deployment logs
      const loggerModule = await import('../src/utils/logger')
      const logs = loggerModule.getLogs()
      
      const deployLogs: DeploymentLog[] = logs
        .filter(log => log.eventType.includes('deploy') || log.eventType.includes('badge-mint'))
        .map(log => ({
          timestamp: log.timestamp,
          network: log.context.network || 'unknown',
          contractType: log.context.contractType || 'badge',
          address: log.context.contractAddress || 'unknown',
          status: log.eventType.includes('failed') ? 'failed' : 'success',
        }))
      setDeploymentLogs(deployLogs)
      
      MeeBot.setSprite('neutral')
      MeeBot.speak('ยินดีต้อนรับสู่หน้า Admin! จัดการ quest, badge และ export log ได้ที่นี่')
    } catch (error) {
      console.error('Error loading admin data:', error)
      MeeBot.setSprite('confused')
      MeeBot.speak('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  async function triggerBadgeMinting(network: string) {
    MeeBot.setSprite('happy')
    MeeBot.speak(`กำลัง mint badge บน ${network}...`)
    
    try {
      const minterModule = await import('../src/minting/badgeMinter')
      
      // Mock user and quest IDs for admin testing
      const userId = 'admin-test-user'
      const questId = 'admin-test-quest'
      
      const tx = await minterModule.mintBadge(userId, questId, network as any)
      
      MeeBot.setSprite('happy')
      MeeBot.speak(`✅ Badge minted successfully on ${network}! TX: ${tx.txHash}`)
      
      // Reload logs
      await loadAdminData()
    } catch (error) {
      console.error('Minting error:', error)
      MeeBot.setSprite('confused')
      MeeBot.speak('❌ Failed to mint badge')
    }
  }

  async function handleExportLogs() {
    MeeBot.setSprite('loading')
    MeeBot.speak(`กำลัง export log เป็น ${exportFormat.toUpperCase()}...`)
    
    try {
      // In a real implementation, this would call the export scripts
      // For now, we'll simulate it
      const loggerModule = await import('../src/utils/logger')
      const logs = loggerModule.getLogs()
      
      const exportData = {
        exportedAt: new Date().toISOString(),
        format: exportFormat,
        logs,
        totalLogs: logs.length,
      }
      
      // Create a download link
      const dataStr = exportFormat === 'json' 
        ? JSON.stringify(exportData, null, 2)
        : convertToCSV(logs)
      
      const blob = new Blob([dataStr], { type: exportFormat === 'json' ? 'application/json' : 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `meechain-logs-${Date.now()}.${exportFormat}`
      link.click()
      
      MeeBot.setSprite('happy')
      MeeBot.speak(`✅ Export สำเร็จ! ไฟล์ถูกดาวน์โหลดแล้ว`)
    } catch (error) {
      console.error('Export error:', error)
      MeeBot.setSprite('confused')
      MeeBot.speak('❌ Export ล้มเหลว')
    }
  }

  function convertToCSV(logs: any[]): string {
    const headers = ['timestamp', 'eventType', 'level', 'context']
    const rows = [headers.join(',')]
    
    logs.forEach(log => {
      const row = [
        new Date(log.timestamp).toISOString(),
        log.eventType,
        log.level,
        JSON.stringify(log.context).replace(/"/g, '""'),
      ]
      rows.push(row.map(cell => `"${cell}"`).join(','))
    })
    
    return rows.join('\n')
  }

  async function handleUpdateContractAddress(network: string, contractType: string, newAddress: string) {
    if (!newAddress || !newAddress.startsWith('0x')) {
      alert('Invalid address format')
      return
    }
    
    MeeBot.setSprite('loading')
    MeeBot.speak(`กำลังอัปเดต ${contractType} address สำหรับ ${network}...`)
    
    try {
      // In a real implementation, this would call updateRegistry script
      // For now, we show a simulation
      console.log(`Would update ${network}.${contractType} to ${newAddress}`)
      
      MeeBot.setSprite('happy')
      MeeBot.speak(`✅ Address อัปเดตสำเร็จ!`)
      
      await loadAdminData()
    } catch (error) {
      console.error('Update error:', error)
      MeeBot.setSprite('confused')
      MeeBot.speak('❌ อัปเดตล้มเหลว')
    }
  }

  if (loading) {
    return (
      <div className="admin-container">
        <p>กำลังโหลดข้อมูล Admin...</p>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <h1>⚙️ MeeChain Admin Panel</h1>
      
      {/* Badge Minting Controls */}
      <section className="minting-section">
        <h2>🏆 Badge Minting</h2>
        <div className="minting-controls">
          <label>Select Network: </label>
          <select 
            value={selectedNetwork} 
            onChange={(e) => setSelectedNetwork(e.target.value)}
          >
            {networks.map(n => (
              <option key={n.name} value={n.name}>{n.name.toUpperCase()}</option>
            ))}
          </select>
          <button onClick={() => triggerBadgeMinting(selectedNetwork)}>
            Trigger Badge Mint
          </button>
        </div>
      </section>
      
      {/* Contract Management */}
      <section className="contract-section">
        <h2>📝 Contract Addresses</h2>
        <div className="contract-grid">
          {networks.map(network => (
            <div key={network.name} className="contract-card">
              <h3>{network.name.toUpperCase()}</h3>
              <div className="contract-info">
                <p><strong>Chain ID:</strong> {network.chainId}</p>
                <p><strong>Badge:</strong> {network.badgeContract}</p>
                <p><strong>Quest:</strong> {network.questContract}</p>
                <p><strong>Fallback:</strong> {network.fallbackContract}</p>
              </div>
              <button 
                onClick={() => {
                  const newAddr = prompt(`Enter new badge contract address for ${network.name}:`)
                  if (newAddr) handleUpdateContractAddress(network.name, 'badgeContract', newAddr)
                }}
              >
                Update Badge Address
              </button>
            </div>
          ))}
        </div>
      </section>
      
      {/* Export Controls */}
      <section className="export-section">
        <h2>📤 Export Logs</h2>
        <div className="export-controls">
          <label>Format: </label>
          <select 
            value={exportFormat} 
            onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
          <button onClick={handleExportLogs}>
            Export Logs
          </button>
        </div>
      </section>
      
      {/* Deployment Logs */}
      <section className="deployment-section">
        <h2>📋 Deployment Logs</h2>
        {deploymentLogs.length === 0 ? (
          <p>No deployment logs found.</p>
        ) : (
          <div className="deployment-log">
            {deploymentLogs.map((log, idx) => (
              <div key={idx} className={`log-item ${log.status}`}>
                <p>🕒 {new Date(log.timestamp).toLocaleString()}</p>
                <p>Network: {log.network}</p>
                <p>Contract: {log.contractType}</p>
                <p>Address: {log.address}</p>
                <p>Status: {log.status === 'success' ? '✅' : '❌'}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

/**
 * Log Export Utilities for MeeChain
 * Export logs and registry data to JSON/CSV formats
 */

import fs from 'fs'
import path from 'path'
import { getLogs } from '../src/utils/logger.js'
import { loadRegistry } from '../src/config/registryLoader.js'

export interface ExportOptions {
  format: 'json' | 'csv'
  outputPath?: string
  includeRegistry?: boolean
}

/**
 * Export logs to JSON format
 */
export function exportLogsToJSON(outputPath?: string): string {
  const logs = getLogs()
  const registry = loadRegistry()
  
  const exportData = {
    exportedAt: new Date().toISOString(),
    registry: {
      version: registry.version,
      lastUpdated: registry.lastUpdated,
      networks: registry.networks,
    },
    logs,
    totalLogs: logs.length,
  }
  
  const filename = outputPath || `logs-export-${Date.now()}.json`
  const filepath = path.resolve(process.cwd(), filename)
  
  fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2))
  
  console.log(`📤 Logs exported to JSON: ${filename}`)
  return filepath
}

/**
 * Export logs to CSV format
 */
export function exportLogsToCSV(outputPath?: string): string {
  const logs = getLogs()
  
  // CSV header
  const headers = ['timestamp', 'eventType', 'level', 'context']
  const rows = [headers.join(',')]
  
  // Add data rows
  logs.forEach(log => {
    const row = [
      log.timestamp.toISOString(),
      log.eventType,
      log.level,
      JSON.stringify(log.context).replace(/"/g, '""'), // Escape quotes
    ]
    rows.push(row.map(cell => `"${cell}"`).join(','))
  })
  
  const filename = outputPath || `logs-export-${Date.now()}.csv`
  const filepath = path.resolve(process.cwd(), filename)
  
  fs.writeFileSync(filepath, rows.join('\n'))
  
  console.log(`📤 Logs exported to CSV: ${filename}`)
  return filepath
}

/**
 * Export registry to JSON with provenance data
 */
export function exportRegistryWithProvenance(outputPath?: string): string {
  const registry = loadRegistry()
  const logs = getLogs()
  
  // Find deployment-related logs
  const deploymentLogs = logs.filter(log => 
    log.eventType.includes('deploy') || 
    log.eventType.includes('registry') ||
    log.eventType.includes('badge-mint') ||
    log.eventType.includes('badge-fallback-mint')
  )
  
  const exportData = {
    exportedAt: new Date().toISOString(),
    registry,
    provenance: {
      deploymentLogs,
      totalDeployments: deploymentLogs.length,
    },
    statistics: {
      totalNetworks: Object.keys(registry.networks).length,
      networks: Object.keys(registry.networks),
    },
  }
  
  const filename = outputPath || `registry-provenance-${Date.now()}.json`
  const filepath = path.resolve(process.cwd(), filename)
  
  fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2))
  
  console.log(`📤 Registry with provenance exported: ${filename}`)
  return filepath
}

/**
 * Export function that handles multiple formats
 */
export function exportLogs(options: ExportOptions): string {
  if (options.format === 'csv') {
    return exportLogsToCSV(options.outputPath)
  } else {
    if (options.includeRegistry) {
      return exportRegistryWithProvenance(options.outputPath)
    } else {
      return exportLogsToJSON(options.outputPath)
    }
  }
}

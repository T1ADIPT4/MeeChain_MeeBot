// utils/milestoneReader.ts

/**
 * Milestone Reader Utility
 * Reads milestone.log file and provides milestone tracking functionality
 */

import { readFileSync, existsSync, appendFileSync } from 'fs'
import { join } from 'path'

export interface MilestoneEntry {
  milestoneId: string
  color: string
  message: string
  timestamp?: Date
}

/**
 * Read all entries from milestone.log
 * @param logPath - Optional custom path to milestone.log (defaults to project root)
 * @returns Array of log lines
 */
export function readMilestoneLog(logPath?: string): string[] {
  const path = logPath || join(process.cwd(), 'milestone.log')
  
  try {
    if (!existsSync(path)) {
      return []
    }
    
    const content = readFileSync(path, 'utf-8')
    return content.split('\n').filter(line => line.trim())
  } catch (error) {
    console.warn('Failed to read milestone.log:', error)
    return []
  }
}

/**
 * Get the latest milestone entry
 * @param logPath - Optional custom path to milestone.log
 * @returns Latest milestone entry or null if no entries
 */
export function getLatestMilestone(logPath?: string): string | null {
  const logs = readMilestoneLog(logPath)
  return logs.length > 0 ? logs[logs.length - 1] : null
}

/**
 * Parse milestone entry into structured data
 * @param entry - Milestone log entry (e.g., "🟢 M1 complete: Deploy dashboard online!")
 * @returns Parsed milestone data or null if invalid
 */
export function parseMilestoneEntry(entry: string): MilestoneEntry | null {
  // Expected format: 🟢 M1 complete: Deploy dashboard online!
  // Match any colored circle emoji followed by milestone pattern
  const regex = /^([\u{1F534}-\u{1F53D}\u{1F7E0}-\u{1F7E5}])\s+(M[1-5])\s+complete:\s+(.+)$/u
  const match = entry.match(regex)
  
  if (!match) {
    return null
  }
  
  const [, color, milestoneId, message] = match
  return {
    milestoneId,
    color,
    message: message.trim()
  }
}

/**
 * Get all completed milestones
 * @param logPath - Optional custom path to milestone.log
 * @returns Array of parsed milestone entries
 */
export function getCompletedMilestones(logPath?: string): MilestoneEntry[] {
  const logs = readMilestoneLog(logPath)
  return logs
    .map(parseMilestoneEntry)
    .filter((entry): entry is MilestoneEntry => entry !== null)
}

/**
 * Check if a specific milestone is completed
 * @param milestoneId - Milestone ID to check (M1, M2, M3, M4, M5)
 * @param logPath - Optional custom path to milestone.log
 * @returns true if milestone is completed, false otherwise
 */
export function isMilestoneCompleted(milestoneId: string, logPath?: string): boolean {
  const completed = getCompletedMilestones(logPath)
  return completed.some(m => m.milestoneId === milestoneId)
}

/**
 * Get milestone completion progress
 * @param logPath - Optional custom path to milestone.log
 * @returns Progress object with completed count and percentage
 */
export function getMilestoneProgress(logPath?: string): { completed: number; total: number; percentage: number } {
  const completed = getCompletedMilestones(logPath)
  const uniqueMilestones = new Set(completed.map(m => m.milestoneId))
  const completedCount = uniqueMilestones.size
  const total = 5 // M1 through M5
  
  return {
    completed: completedCount,
    total,
    percentage: Math.round((completedCount / total) * 100)
  }
}

/**
 * Append a new milestone entry to milestone.log
 * @param milestoneId - Milestone ID (M1, M2, M3, M4, M5)
 * @param message - Completion message
 * @param logPath - Optional custom path to milestone.log
 */
export function appendToMilestoneLog(milestoneId: string, message: string, logPath?: string): void {
  const path = logPath || join(process.cwd(), 'milestone.log')
  
  const colorMap: Record<string, string> = {
    'M1': '🟢',
    'M2': '🟣',
    'M3': '🟠',
    'M4': '🔵',
    'M5': '🟡'
  }
  
  const color = colorMap[milestoneId] || '⚪'
  const entry = `${color} ${milestoneId} complete: ${message}\n`
  
  try {
    appendFileSync(path, entry, 'utf-8')
    console.log(`✅ Milestone logged: ${milestoneId}`)
  } catch (error) {
    console.error('Failed to append to milestone.log:', error)
  }
}

/**
 * Parse milestone from git commit message
 * @param commitMessage - Git commit message
 * @returns Milestone ID if found, null otherwise
 */
export function parseMilestoneFromCommit(commitMessage: string): string | null {
  // Match patterns like "M1:", "M2:", etc. at the start of commit message
  const regex = /^(M[1-5]):/
  const match = commitMessage.match(regex)
  return match ? match[1] : null
}

/**
 * Get milestone message from commit
 * @param commitMessage - Git commit message
 * @returns Message after milestone marker
 */
export function getMilestoneMessageFromCommit(commitMessage: string): string | null {
  const regex = /^M[1-5]:\s*(.+)$/
  const match = commitMessage.match(regex)
  return match ? match[1].trim() : null
}

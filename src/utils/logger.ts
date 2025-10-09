/**
 * Logger utility for MeeChain
 * Logs events throughout the quest verification and badge minting process
 * for easy traceability and debugging
 */

import * as fs from 'fs'
import * as path from 'path'

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export interface LogEvent {
  timestamp: Date
  level: LogLevel
  eventType: string
  context: Record<string, any>
}

// In-memory log storage (can be replaced with external logging service)
const logs: LogEvent[] = []

// Path to logs directory
const LOGS_DIR = path.join(process.cwd(), 'tests', 'logs')

/**
 * Ensure logs directory exists
 */
function ensureLogsDir(): void {
  try {
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true })
    }
  } catch (error) {
    // Silently fail if we can't create directory (e.g., in browser environment)
    console.warn('Could not create logs directory:', error)
  }
}

/**
 * Write log to file for error and fallback events
 * @param logEntry - Log entry to write
 */
function writeLogToFile(logEntry: LogEvent): void {
  try {
    // Only write error and fallback events to disk
    const shouldWriteToFile = 
      logEntry.level === 'error' || 
      logEntry.eventType.includes('fallback') ||
      logEntry.eventType.includes('failed')
    
    if (!shouldWriteToFile) {
      return
    }

    ensureLogsDir()

    // Determine file name based on event type
    const dateStr = new Date().toISOString().split('T')[0]
    let fileName: string
    
    if (logEntry.eventType.includes('fallback')) {
      fileName = `fallback-${dateStr}.log`
    } else {
      fileName = `error-${dateStr}.log`
    }

    const logFilePath = path.join(LOGS_DIR, fileName)
    
    // Format log entry
    const logLine = `[${logEntry.timestamp.toISOString()}] [${logEntry.level.toUpperCase()}] ${logEntry.eventType}\n${JSON.stringify(logEntry.context, null, 2)}\n\n`
    
    // Append to file
    fs.appendFileSync(logFilePath, logLine, 'utf-8')
  } catch (error) {
    // Silently fail if we can't write to file
    console.warn('Could not write log to file:', error)
  }
}

/**
 * Log an event with context
 * @param eventType - Type of event being logged
 * @param context - Additional context data
 * @param level - Log level (defaults to 'info')
 */
export function logEvent(
  eventType: string,
  context: Record<string, any> = {},
  level: LogLevel = 'info'
): void {
  const logEntry: LogEvent = {
    timestamp: new Date(),
    level,
    eventType,
    context,
  }

  logs.push(logEntry)

  // Console output for development
  const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅'
  console.log(
    `${emoji} [${logEntry.timestamp.toISOString()}] ${eventType}:`,
    JSON.stringify(context, null, 2)
  )

  // Write error and fallback logs to file
  writeLogToFile(logEntry)
}

/**
 * Get all logged events
 * @returns Array of all log events
 */
export function getLogs(): LogEvent[] {
  return [...logs]
}

/**
 * Get logs filtered by event type
 * @param eventType - Event type to filter by
 * @returns Filtered array of log events
 */
export function getLogsByType(eventType: string): LogEvent[] {
  return logs.filter((log) => log.eventType === eventType)
}

/**
 * Get logs filtered by level
 * @param level - Log level to filter by
 * @returns Filtered array of log events
 */
export function getLogsByLevel(level: LogLevel): LogEvent[] {
  return logs.filter((log) => log.level === level)
}

/**
 * Clear all logs
 */
export function clearLogs(): void {
  logs.length = 0
}

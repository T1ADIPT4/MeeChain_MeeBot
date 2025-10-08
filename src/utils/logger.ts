/**
 * Logger utility for MeeChain
 * Logs events throughout the quest verification and badge minting process
 * for easy traceability and debugging
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export interface LogEvent {
  timestamp: Date
  level: LogLevel
  eventType: string
  context: Record<string, any>
}

// In-memory log storage (can be replaced with external logging service)
const logs: LogEvent[] = []

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

/**
 * Get fallback usage statistics
 * @returns Statistics about fallback usage
 */
export function getFallbackTelemetry(): {
  totalFallbackAttempts: number
  totalFallbackSuccesses: number
  totalFallbackFailures: number
  totalPrimaryFailures: number
  fallbackSuccessRate: number
  questsUsingFallback: string[]
} {
  const fallbackStartLogs = getLogsByType('badge-fallback-mint-start')
  const fallbackSuccessLogs = getLogsByType('badge-fallback-minted')
  const fallbackFailureLogs = logs.filter(
    (log) => log.eventType === 'badge-fallback-mint-failed' || 
             (log.eventType === 'quest-completion-failed' && log.context.reason === 'Both primary and fallback minting failed')
  )
  const primaryFailureLogs = getLogsByType('badge-mint-failed')
  
  const questsUsingFallback = Array.from(
    new Set(fallbackSuccessLogs.map((log) => log.context.questId).filter(Boolean))
  )
  
  const totalFallbackAttempts = fallbackStartLogs.length
  const totalFallbackSuccesses = fallbackSuccessLogs.length
  const totalFallbackFailures = fallbackFailureLogs.length
  const fallbackSuccessRate = totalFallbackAttempts > 0 
    ? (totalFallbackSuccesses / totalFallbackAttempts) * 100 
    : 0
  
  return {
    totalFallbackAttempts,
    totalFallbackSuccesses,
    totalFallbackFailures,
    totalPrimaryFailures: primaryFailureLogs.length,
    fallbackSuccessRate,
    questsUsingFallback,
  }
}

/**
 * Get detailed fallback log entries
 * @returns Array of fallback-related log events with metadata
 */
export function getFallbackLogs(): {
  timestamp: Date
  userId: string
  questId: string
  status: 'attempt' | 'success' | 'failure'
  tx?: string
  error?: string
}[] {
  const fallbackEvents = logs.filter(
    (log) =>
      log.eventType === 'badge-fallback-mint-start' ||
      log.eventType === 'badge-fallback-minted' ||
      log.eventType === 'badge-fallback-mint-failed'
  )
  
  return fallbackEvents.map((log) => ({
    timestamp: log.timestamp,
    userId: log.context.userId,
    questId: log.context.questId,
    status: 
      log.eventType === 'badge-fallback-mint-start' ? 'attempt' :
      log.eventType === 'badge-fallback-minted' ? 'success' : 'failure',
    tx: log.context.tx,
    error: log.context.error,
  }))
}

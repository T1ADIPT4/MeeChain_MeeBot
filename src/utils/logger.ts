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

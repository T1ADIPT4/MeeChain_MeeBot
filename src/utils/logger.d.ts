/**
 * Logger utility for MeeChain
 * Logs events throughout the quest verification and badge minting process
 * for easy traceability and debugging
 */
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
export interface LogEvent {
    timestamp: Date;
    level: LogLevel;
    eventType: string;
    context: Record<string, any>;
}
/**
 * Log an event with context
 * @param eventType - Type of event being logged
 * @param context - Additional context data
 * @param level - Log level (defaults to 'info')
 */
export declare function logEvent(eventType: string, context?: Record<string, any>, level?: LogLevel): void;
/**
 * Get all logged events
 * @returns Array of all log events
 */
export declare function getLogs(): LogEvent[];
/**
 * Get logs filtered by event type
 * @param eventType - Event type to filter by
 * @returns Filtered array of log events
 */
export declare function getLogsByType(eventType: string): LogEvent[];
/**
 * Get logs filtered by level
 * @param level - Log level to filter by
 * @returns Filtered array of log events
 */
export declare function getLogsByLevel(level: LogLevel): LogEvent[];
/**
 * Clear all logs
 */
export declare function clearLogs(): void;
//# sourceMappingURL=logger.d.ts.map
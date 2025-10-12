/**
 * MOCKED Logger for MeeChain (Client-Side)
 * This is a lightweight, browser-safe version of the logger.
 * It uses console.log instead of writing to a file.
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Mocked logEvent function.
 * Logs events to the browser's console.
 * 
 * @param eventName - The name of the event to log.
 * @param details - An object containing details about the event.
 * @param level - The log level (info, warn, error, debug).
 */
export function logEvent(
  eventName: string, 
  details: Record<string, any>, 
  level: LogLevel = 'info'
): void {
  const logMessage = `[${level.toUpperCase()}] ${eventName}:`;

  // Use console methods corresponding to the log level
  switch (level) {
    case 'info':
      console.info(logMessage, details);
      break;
    case 'warn':
      console.warn(logMessage, details);
      break;
    case 'error':
      console.error(logMessage, details);
      break;
    case 'debug':
      console.debug(logMessage, details);
      break;
    default:
      console.log(logMessage, details);
  }
}

/**
 * Transaction Logger
 * Structured logging system for blockchain transactions in JSONL format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface TransactionLog {
  user: string;
  action: 'replay' | 'supply' | 'refund';
  txHash?: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
  amount?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export class TransactionLogger {
  private logFilePath: string;
  private logStream: fs.WriteStream | null = null;

  /**
   * Constructor
   * @param logDir - Directory for log files (default: logs)
   */
  constructor(logDir: string = 'logs') {
    const rootDir = path.resolve(__dirname, '../..');
    const logsPath = path.join(rootDir, logDir);

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsPath)) {
      fs.mkdirSync(logsPath, { recursive: true });
    }

    this.logFilePath = path.join(logsPath, 'tx.log');
    this.initLogStream();
  }

  /**
   * Initialize log stream
   */
  private initLogStream(): void {
    this.logStream = fs.createWriteStream(this.logFilePath, { flags: 'a' });
  }

  /**
   * Log a transaction
   * @param log - Transaction log entry
   */
  log(log: TransactionLog): void {
    const logEntry = {
      ...log,
      timestamp: log.timestamp || Date.now()
    };

    const jsonLine = JSON.stringify(logEntry) + '\n';

    if (this.logStream) {
      this.logStream.write(jsonLine);
    }

    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('[TX]', jsonLine.trim());
    }
  }

  /**
   * Log replay confirmation
   * @param user - User address
   * @param amount - Amount
   * @param txHash - Transaction hash (optional)
   * @param status - Status
   */
  logReplay(
    user: string,
    amount: string,
    status: 'pending' | 'success' | 'failed',
    txHash?: string,
    error?: string
  ): void {
    this.log({
      user,
      action: 'replay',
      amount,
      status,
      txHash,
      error,
      timestamp: Date.now()
    });
  }

  /**
   * Log supply trigger
   * @param user - User address
   * @param amount - Amount
   * @param txHash - Transaction hash (optional)
   * @param status - Status
   */
  logSupply(
    user: string,
    amount: string,
    status: 'pending' | 'success' | 'failed',
    txHash?: string,
    error?: string
  ): void {
    this.log({
      user,
      action: 'supply',
      amount,
      status,
      txHash,
      error,
      timestamp: Date.now()
    });
  }

  /**
   * Log refund
   * @param user - User address
   * @param amount - Amount
   * @param txHash - Transaction hash (optional)
   * @param status - Status
   */
  logRefund(
    user: string,
    amount: string,
    status: 'pending' | 'success' | 'failed',
    txHash?: string,
    error?: string
  ): void {
    this.log({
      user,
      action: 'refund',
      amount,
      status,
      txHash,
      error,
      timestamp: Date.now()
    });
  }

  /**
   * Query logs by user
   * @param user - User address
   * @returns Array of transaction logs
   */
  queryByUser(user: string): TransactionLog[] {
    const logs: TransactionLog[] = [];
    
    if (!fs.existsSync(this.logFilePath)) {
      return logs;
    }

    const content = fs.readFileSync(this.logFilePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    for (const line of lines) {
      try {
        const log = JSON.parse(line);
        if (log.user === user) {
          logs.push(log);
        }
      } catch (error) {
        // Skip invalid lines
      }
    }

    return logs;
  }

  /**
   * Query logs by action
   * @param action - Action type
   * @returns Array of transaction logs
   */
  queryByAction(action: 'replay' | 'supply' | 'refund'): TransactionLog[] {
    const logs: TransactionLog[] = [];
    
    if (!fs.existsSync(this.logFilePath)) {
      return logs;
    }

    const content = fs.readFileSync(this.logFilePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    for (const line of lines) {
      try {
        const log = JSON.parse(line);
        if (log.action === action) {
          logs.push(log);
        }
      } catch (error) {
        // Skip invalid lines
      }
    }

    return logs;
  }

  /**
   * Query logs by status
   * @param status - Status
   * @returns Array of transaction logs
   */
  queryByStatus(status: 'pending' | 'success' | 'failed'): TransactionLog[] {
    const logs: TransactionLog[] = [];
    
    if (!fs.existsSync(this.logFilePath)) {
      return logs;
    }

    const content = fs.readFileSync(this.logFilePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    for (const line of lines) {
      try {
        const log = JSON.parse(line);
        if (log.status === status) {
          logs.push(log);
        }
      } catch (error) {
        // Skip invalid lines
      }
    }

    return logs;
  }

  /**
   * Close log stream
   */
  close(): void {
    if (this.logStream) {
      this.logStream.end();
      this.logStream = null;
    }
  }
}

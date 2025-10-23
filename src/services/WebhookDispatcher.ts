/**
 * Webhook Dispatcher
 * Sends webhook notifications with retry and fallback mechanisms
 */

import { logEvent } from '../utils/logger.js';

export interface WebhookPayload {
  user: string;
  action: 'replay' | 'supply' | 'refund';
  txHash?: string;
  status: 'success' | 'failed';
  amount?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface WebhookConfig {
  url: string;
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
}

export class WebhookDispatcher {
  private webhookUrl: string;
  private retryAttempts: number;
  private retryDelay: number;
  private timeout: number;

  /**
   * Constructor
   * @param config - Webhook configuration
   */
  constructor(config: WebhookConfig) {
    this.webhookUrl = config.url;
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 2000;
    this.timeout = config.timeout || 10000;

    logEvent('webhook-dispatcher-init', {
      url: this.webhookUrl,
      retryAttempts: this.retryAttempts,
      retryDelay: this.retryDelay
    }, 'info');
  }

  /**
   * Send webhook with retry
   * @param payload - Webhook payload
   * @returns Success status
   */
  async send(payload: WebhookPayload): Promise<boolean> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        logEvent('webhook-send-attempt', {
          attempt,
          maxAttempts: this.retryAttempts,
          payload
        }, 'debug');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(this.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MeeBot-Webhook/1.0'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          logEvent('webhook-send-success', {
            attempt,
            status: response.status,
            payload
          }, 'info');
          return true;
        }

        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);

      } catch (error) {
        lastError = error as Error;
        logEvent('webhook-send-error', {
          attempt,
          maxAttempts: this.retryAttempts,
          error: lastError.message,
          payload
        }, 'warn');

        if (attempt < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    logEvent('webhook-send-failed', {
      error: lastError?.message,
      payload
    }, 'error');

    return false;
  }

  /**
   * Send replay confirmation webhook
   * @param user - User address
   * @param amount - Amount
   * @param txHash - Transaction hash
   * @param status - Status
   */
  async sendReplayConfirmation(
    user: string,
    amount: string,
    txHash: string,
    status: 'success' | 'failed'
  ): Promise<boolean> {
    return this.send({
      user,
      action: 'replay',
      amount,
      txHash,
      status,
      timestamp: Date.now()
    });
  }

  /**
   * Send supply trigger webhook
   * @param user - User address
   * @param amount - Amount
   * @param txHash - Transaction hash
   * @param status - Status
   */
  async sendSupplyTrigger(
    user: string,
    amount: string,
    txHash: string,
    status: 'success' | 'failed'
  ): Promise<boolean> {
    return this.send({
      user,
      action: 'supply',
      amount,
      txHash,
      status,
      timestamp: Date.now()
    });
  }

  /**
   * Send refund webhook
   * @param user - User address
   * @param amount - Amount
   * @param txHash - Transaction hash
   * @param status - Status
   */
  async sendRefund(
    user: string,
    amount: string,
    txHash: string,
    status: 'success' | 'failed'
  ): Promise<boolean> {
    return this.send({
      user,
      action: 'refund',
      amount,
      txHash,
      status,
      timestamp: Date.now()
    });
  }

  /**
   * Update webhook URL
   * @param url - New webhook URL
   */
  setWebhookUrl(url: string): void {
    this.webhookUrl = url;
    logEvent('webhook-url-updated', { url }, 'info');
  }

  /**
   * Get webhook URL
   * @returns Webhook URL
   */
  getWebhookUrl(): string {
    return this.webhookUrl;
  }
}

/**
 * Integrated Supply Service
 * Combines MeeChainSupplyService, TransactionLogger, WebhookDispatcher,
 * SignatureRefundService, and BadgeMintingService into a unified interface
 */

import { MeeChainSupplyService } from './MeeChainSupplyService.js';
import { TransactionLogger } from './TransactionLogger.js';
import { WebhookDispatcher } from './WebhookDispatcher.js';
import { SignatureRefundService } from './SignatureRefundService.js';
import { BadgeMintingService } from './BadgeMintingService.js';
import { logEvent } from '../utils/logger.js';

export interface IntegratedServiceConfig {
  rpcUrl: string;
  privateKey: string;
  contractAddress: string;
  chainId: number;
  webhookUrl?: string;
  badgeMintingEnabled?: boolean;
  badgeNetwork?: 'polygon' | 'ethereum';
}

export class IntegratedSupplyService {
  private supplyService: MeeChainSupplyService;
  private txLogger: TransactionLogger;
  private webhookDispatcher: WebhookDispatcher | null;
  private signatureService: SignatureRefundService;
  private badgeService: BadgeMintingService;

  /**
   * Constructor
   * @param config - Service configuration
   */
  constructor(config: IntegratedServiceConfig) {
    // Initialize supply service
    this.supplyService = new MeeChainSupplyService(
      config.rpcUrl,
      config.privateKey,
      config.contractAddress
    );

    // Initialize transaction logger
    this.txLogger = new TransactionLogger();

    // Initialize webhook dispatcher (if URL provided)
    this.webhookDispatcher = config.webhookUrl
      ? new WebhookDispatcher({ url: config.webhookUrl })
      : null;

    // Initialize signature service
    this.signatureService = new SignatureRefundService(
      config.privateKey,
      config.contractAddress,
      config.chainId
    );

    // Initialize badge minting service
    this.badgeService = new BadgeMintingService({
      enabled: config.badgeMintingEnabled || false,
      network: config.badgeNetwork || 'polygon',
      fallbackNetwork: 'ethereum',
      badgeTypes: {
        replay: 'replay-verified',
        supply: 'supply-completed',
        firstSupply: 'first-supply-pioneer'
      }
    });

    // Set up event listeners
    this.setupEventListeners();

    logEvent('integrated-service-init', {
      contractAddress: config.contractAddress,
      webhookEnabled: !!config.webhookUrl,
      badgeMintingEnabled: config.badgeMintingEnabled
    }, 'info');
  }

  /**
   * Set up event listeners for contract events
   */
  private setupEventListeners(): void {
    // Listen to ReplayConfirmed events
    this.supplyService.onEvent('ReplayConfirmed', async (user, amount, event) => {
      this.txLogger.logReplay(user, amount, 'success', event.log.transactionHash);

      // Send webhook
      if (this.webhookDispatcher) {
        await this.webhookDispatcher.sendReplayConfirmation(
          user,
          amount,
          event.log.transactionHash,
          'success'
        );
      }

      // Mint replay badge
      await this.badgeService.mintReplayBadge(user, amount);
    });

    // Listen to SupplyTriggered events
    this.supplyService.onEvent('SupplyTriggered', async (user, amount, event) => {
      this.txLogger.logSupply(user, amount, 'success', event.log.transactionHash);

      // Send webhook
      if (this.webhookDispatcher) {
        await this.webhookDispatcher.sendSupplyTrigger(
          user,
          amount,
          event.log.transactionHash,
          'success'
        );
      }

      // Mint supply badge
      await this.badgeService.mintSupplyBadge(user, amount);
    });

    // Listen to RefundIssued events
    this.supplyService.onEvent('RefundIssued', async (user, amount, event) => {
      this.txLogger.logRefund(user, amount, 'success', event.log.transactionHash);

      // Send webhook
      if (this.webhookDispatcher) {
        await this.webhookDispatcher.sendRefund(
          user,
          amount,
          event.log.transactionHash,
          'success'
        );
      }
    });
  }

  /**
   * Confirm replay verification
   * @param userAddress - User address
   * @param amount - Amount to supply
   * @returns Result
   */
  async confirmReplay(userAddress: string, amount: string) {
    this.txLogger.logReplay(userAddress, amount, 'pending');

    const result = await this.supplyService.confirmReplay(userAddress, amount);

    if (result.success && result.txHash) {
      this.txLogger.logReplay(userAddress, amount, 'success', result.txHash);

      if (this.webhookDispatcher) {
        await this.webhookDispatcher.sendReplayConfirmation(
          userAddress,
          amount,
          result.txHash,
          'success'
        );
      }
    } else {
      this.txLogger.logReplay(userAddress, amount, 'failed', undefined, result.error);

      if (this.webhookDispatcher && result.error) {
        await this.webhookDispatcher.send({
          user: userAddress,
          action: 'replay',
          status: 'failed',
          amount,
          timestamp: Date.now(),
          metadata: { error: result.error }
        });
      }
    }

    return result;
  }

  /**
   * Trigger supply
   * @param userAddress - User address
   * @returns Result
   */
  async triggerSupply(userAddress: string) {
    const state = await this.supplyService.getContractState(userAddress);
    this.txLogger.logSupply(userAddress, state.pendingSupply, 'pending');

    const result = await this.supplyService.triggerSupply(userAddress);

    if (result.success && result.txHash) {
      this.txLogger.logSupply(
        userAddress,
        result.amount!,
        'success',
        result.txHash
      );

      if (this.webhookDispatcher) {
        await this.webhookDispatcher.sendSupplyTrigger(
          userAddress,
          result.amount!,
          result.txHash,
          'success'
        );
      }
    } else {
      this.txLogger.logSupply(
        userAddress,
        state.pendingSupply,
        'failed',
        undefined,
        result.error
      );
    }

    return result;
  }

  /**
   * Issue refund
   * @param userAddress - User address
   * @returns Result
   */
  async refund(userAddress: string) {
    const state = await this.supplyService.getContractState(userAddress);
    this.txLogger.logRefund(userAddress, state.pendingSupply, 'pending');

    const result = await this.supplyService.refund(userAddress);

    if (result.success && result.txHash) {
      this.txLogger.logRefund(
        userAddress,
        result.amount!,
        'success',
        result.txHash
      );

      if (this.webhookDispatcher) {
        await this.webhookDispatcher.sendRefund(
          userAddress,
          result.amount!,
          result.txHash,
          'success'
        );
      }
    } else {
      this.txLogger.logRefund(
        userAddress,
        state.pendingSupply,
        'failed',
        undefined,
        result.error
      );
    }

    return result;
  }

  /**
   * Generate signature for off-chain refund approval
   * @param userAddress - User address
   * @param amount - Refund amount
   * @returns Signature object
   */
  async generateRefundSignature(userAddress: string, amount: string) {
    return this.signatureService.generateRefundSignature(userAddress, amount);
  }

  /**
   * Verify refund signature
   * @param signature - Signature object
   * @returns True if valid
   */
  async verifyRefundSignature(signature: any) {
    return this.signatureService.verifyRefundSignature(signature);
  }

  /**
   * Get contract state for user
   * @param userAddress - User address
   * @returns Contract state
   */
  async getContractState(userAddress: string) {
    return this.supplyService.getContractState(userAddress);
  }

  /**
   * Get transaction logs for user
   * @param userAddress - User address
   * @returns Transaction logs
   */
  getUserLogs(userAddress: string) {
    return this.txLogger.queryByUser(userAddress);
  }

  /**
   * Get transaction logs by status
   * @param status - Status
   * @returns Transaction logs
   */
  getLogsByStatus(status: 'pending' | 'success' | 'failed') {
    return this.txLogger.queryByStatus(status);
  }

  /**
   * Enable or disable badge minting
   * @param enabled - Enable flag
   */
  setBadgeMintingEnabled(enabled: boolean) {
    this.badgeService.setEnabled(enabled);
  }

  /**
   * Get nonce for user (for signature refunds)
   * @param userAddress - User address
   * @returns Nonce
   */
  getNonce(userAddress: string) {
    return this.signatureService.getNonce(userAddress);
  }

  /**
   * Close all services
   */
  close() {
    this.txLogger.close();
    this.supplyService.offEvent('ReplayConfirmed');
    this.supplyService.offEvent('SupplyTriggered');
    this.supplyService.offEvent('RefundIssued');
  }
}

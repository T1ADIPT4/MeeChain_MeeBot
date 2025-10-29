/**
 * MeeChainSupplyService
 * Service for managing replay verification, token supply, and refunds
 * Uses ethers.js for blockchain interactions
 */

import { ethers } from 'ethers';
import { logEvent } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ABI
const abiPath = path.join(__dirname, '../../abi/MeeChainSupply.json');
const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));

export interface ReplayVerificationResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface SupplyResult {
  success: boolean;
  txHash?: string;
  amount?: string;
  error?: string;
}

export interface RefundResult {
  success: boolean;
  txHash?: string;
  amount?: string;
  error?: string;
}

export interface ContractState {
  replayConfirmed: boolean;
  pendingSupply: string;
}

export class MeeChainSupplyService {
  private provider: ethers.Provider;
  private signer: ethers.Signer;
  private contract: ethers.Contract;
  private contractAddress: string;
  private retryAttempts: number;
  private retryDelay: number;

  /**
   * Constructor
   * @param rpcUrl - RPC endpoint URL
   * @param privateKey - Private key for signing transactions
   * @param contractAddress - Deployed MeeChainSupply contract address
   * @param retryAttempts - Number of retry attempts (default: 3)
   * @param retryDelay - Delay between retries in ms (default: 2000)
   */
  constructor(
    rpcUrl: string,
    privateKey: string,
    contractAddress: string,
    retryAttempts: number = 3,
    retryDelay: number = 2000
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
    this.contractAddress = contractAddress;
    this.contract = new ethers.Contract(
      contractAddress,
      contractABI.abi,
      this.signer
    );
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;

    logEvent('supply-service-init', {
      contractAddress,
      rpcUrl,
      signerAddress: this.signer.address
    }, 'info');
  }

  /**
   * Retry wrapper for contract calls
   * @param fn - Function to retry
   * @param operation - Operation name for logging
   * @returns Result of the function
   */
  private async withRetry<T>(
    fn: () => Promise<T>,
    operation: string
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        logEvent('supply-service-retry', {
          operation,
          attempt,
          maxAttempts: this.retryAttempts,
          error: lastError.message
        }, 'warn');

        if (attempt < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Confirm replay verification on-chain
   * @param userAddress - User wallet address
   * @param amount - Amount of tokens to supply
   * @returns Verification result
   */
  async confirmReplay(
    userAddress: string,
    amount: string
  ): Promise<ReplayVerificationResult> {
    try {
      logEvent('replay-confirm-start', {
        user: userAddress,
        amount,
        contract: this.contractAddress
      }, 'info');

      const amountWei = ethers.parseUnits(amount, 18);

      const tx = await this.withRetry(
        () => this.contract.confirmReplay(userAddress, amountWei),
        'confirmReplay'
      );

      const receipt = await tx.wait();

      logEvent('replay-confirm-success', {
        user: userAddress,
        amount,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      }, 'info');

      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      logEvent('replay-confirm-error', {
        user: userAddress,
        amount,
        error: errorMessage
      }, 'error');

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Trigger token supply after replay confirmation
   * @param userAddress - User wallet address
   * @returns Supply result
   */
  async triggerSupply(userAddress: string): Promise<SupplyResult> {
    try {
      logEvent('supply-trigger-start', {
        user: userAddress,
        contract: this.contractAddress
      }, 'info');

      // Check state before triggering
      const state = await this.getContractState(userAddress);
      if (!state.replayConfirmed) {
        throw new Error('Replay not confirmed');
      }
      if (state.pendingSupply === '0') {
        throw new Error('No pending supply');
      }

      const tx = await this.withRetry(
        () => this.contract.triggerSupply(userAddress),
        'triggerSupply'
      );

      const receipt = await tx.wait();

      logEvent('supply-trigger-success', {
        user: userAddress,
        amount: state.pendingSupply,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      }, 'info');

      return {
        success: true,
        txHash: receipt.hash,
        amount: state.pendingSupply
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      logEvent('supply-trigger-error', {
        user: userAddress,
        error: errorMessage
      }, 'error');

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Issue refund if replay verification fails
   * @param userAddress - User wallet address
   * @returns Refund result
   */
  async refund(userAddress: string): Promise<RefundResult> {
    try {
      logEvent('refund-start', {
        user: userAddress,
        contract: this.contractAddress
      }, 'info');

      // Check state before refunding
      const state = await this.getContractState(userAddress);
      if (state.replayConfirmed) {
        throw new Error('Cannot refund: replay already confirmed');
      }
      if (state.pendingSupply === '0') {
        throw new Error('No pending refund');
      }

      const tx = await this.withRetry(
        () => this.contract.refund(userAddress),
        'refund'
      );

      const receipt = await tx.wait();

      logEvent('refund-success', {
        user: userAddress,
        amount: state.pendingSupply,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      }, 'info');

      return {
        success: true,
        txHash: receipt.hash,
        amount: state.pendingSupply
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      logEvent('refund-error', {
        user: userAddress,
        error: errorMessage
      }, 'error');

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Get contract state for a user
   * @param userAddress - User wallet address
   * @returns Contract state
   */
  async getContractState(userAddress: string): Promise<ContractState> {
    const replayConfirmed = await this.contract.replayConfirmed(userAddress);
    const pendingSupply = await this.contract.pendingSupply(userAddress);

    return {
      replayConfirmed,
      pendingSupply: ethers.formatUnits(pendingSupply, 18)
    };
  }

  /**
   * Listen to contract events
   * @param eventName - Event name to listen to
   * @param callback - Callback function
   */
  onEvent(
    eventName: 'ReplayConfirmed' | 'SupplyTriggered' | 'RefundIssued',
    callback: (user: string, amount: string, event: any) => void
  ): void {
    this.contract.on(eventName, (user: string, amount: bigint, event: any) => {
      const amountFormatted = ethers.formatUnits(amount, 18);
      logEvent('contract-event', {
        eventName,
        user,
        amount: amountFormatted,
        txHash: event.log.transactionHash
      }, 'info');

      callback(user, amountFormatted, event);
    });
  }

  /**
   * Remove event listener
   * @param eventName - Event name
   */
  offEvent(
    eventName: 'ReplayConfirmed' | 'SupplyTriggered' | 'RefundIssued'
  ): void {
    this.contract.removeAllListeners(eventName);
  }

  /**
   * Get contract address
   * @returns Contract address
   */
  getContractAddress(): string {
    return this.contractAddress;
  }

  /**
   * Get signer address
   * @returns Signer address
   */
  getSignerAddress(): string {
    return this.signer.address;
  }
}

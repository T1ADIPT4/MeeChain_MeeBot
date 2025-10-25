/**
 * Signature Refund Service
 * Generates and verifies signatures for off-chain refund approvals
 */

import { ethers } from 'ethers';
import { logEvent } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface RefundSignature {
  user: string;
  amount: string;
  nonce: number;
  signature: string;
  expiry: number;
}

export interface NonceRecord {
  user: string;
  nonce: number;
  used: boolean;
  timestamp: number;
}

export class SignatureRefundService {
  private signer: ethers.Wallet;
  private domain: any;
  private types: any;
  private nonces: Map<string, number>;
  private nonceFilePath: string;

  /**
   * Constructor
   * @param privateKey - Private key for signing
   * @param contractAddress - Contract address for domain
   * @param chainId - Chain ID
   */
  constructor(
    privateKey: string,
    contractAddress: string,
    chainId: number
  ) {
    this.signer = new ethers.Wallet(privateKey);
    this.nonces = new Map();

    // EIP-712 domain
    this.domain = {
      name: 'MeeChainSupply',
      version: '1',
      chainId: chainId,
      verifyingContract: contractAddress
    };

    // EIP-712 types
    this.types = {
      Refund: [
        { name: 'user', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'expiry', type: 'uint256' }
      ]
    };

    // Set up nonce storage
    const rootDir = path.resolve(__dirname, '../..');
    const logsPath = path.join(rootDir, 'logs');
    if (!fs.existsSync(logsPath)) {
      fs.mkdirSync(logsPath, { recursive: true });
    }
    this.nonceFilePath = path.join(logsPath, 'nonces.json');
    this.loadNonces();

    logEvent('signature-refund-init', {
      signerAddress: this.signer.address,
      contractAddress,
      chainId
    }, 'info');
  }

  /**
   * Load nonces from file
   */
  private loadNonces(): void {
    if (fs.existsSync(this.nonceFilePath)) {
      try {
        const data = fs.readFileSync(this.nonceFilePath, 'utf-8');
        const noncesObj = JSON.parse(data);
        this.nonces = new Map(Object.entries(noncesObj));
      } catch (error) {
        logEvent('nonce-load-error', {
          error: (error as Error).message
        }, 'warn');
        this.nonces = new Map();
      }
    }
  }

  /**
   * Save nonces to file
   */
  private saveNonces(): void {
    try {
      const noncesObj = Object.fromEntries(this.nonces);
      fs.writeFileSync(
        this.nonceFilePath,
        JSON.stringify(noncesObj, null, 2)
      );
    } catch (error) {
      logEvent('nonce-save-error', {
        error: (error as Error).message
      }, 'error');
    }
  }

  /**
   * Get nonce for user
   * @param user - User address
   * @returns Current nonce
   */
  getNonce(user: string): number {
    const normalizedUser = user.toLowerCase();
    return this.nonces.get(normalizedUser) || 0;
  }

  /**
   * Increment nonce for user
   * @param user - User address
   * @returns New nonce
   */
  private incrementNonce(user: string): number {
    const normalizedUser = user.toLowerCase();
    const currentNonce = this.getNonce(normalizedUser);
    const newNonce = currentNonce + 1;
    this.nonces.set(normalizedUser, newNonce);
    this.saveNonces();
    return newNonce;
  }

  /**
   * Generate refund signature
   * @param user - User address
   * @param amount - Refund amount
   * @param expirySeconds - Expiry time in seconds (default: 1 hour)
   * @returns Refund signature object
   */
  async generateRefundSignature(
    user: string,
    amount: string,
    expirySeconds: number = 3600
  ): Promise<RefundSignature> {
    try {
      const normalizedUser = ethers.getAddress(user);
      const nonce = this.incrementNonce(normalizedUser);
      const expiry = Math.floor(Date.now() / 1000) + expirySeconds;
      const amountWei = ethers.parseUnits(amount, 18);

      const value = {
        user: normalizedUser,
        amount: amountWei,
        nonce: nonce,
        expiry: expiry
      };

      const signature = await this.signer.signTypedData(
        this.domain,
        this.types,
        value
      );

      logEvent('refund-signature-generated', {
        user: normalizedUser,
        amount,
        nonce,
        expiry,
        signature
      }, 'info');

      return {
        user: normalizedUser,
        amount,
        nonce,
        signature,
        expiry
      };
    } catch (error) {
      logEvent('refund-signature-error', {
        user,
        amount,
        error: (error as Error).message
      }, 'error');
      throw error;
    }
  }

  /**
   * Verify refund signature
   * @param refundSig - Refund signature object
   * @returns True if valid
   */
  async verifyRefundSignature(refundSig: RefundSignature): Promise<boolean> {
    try {
      const amountWei = ethers.parseUnits(refundSig.amount, 18);

      const value = {
        user: refundSig.user,
        amount: amountWei,
        nonce: refundSig.nonce,
        expiry: refundSig.expiry
      };

      const recoveredAddress = ethers.verifyTypedData(
        this.domain,
        this.types,
        value,
        refundSig.signature
      );

      const isValid = recoveredAddress.toLowerCase() === this.signer.address.toLowerCase();
      const isNotExpired = Math.floor(Date.now() / 1000) < refundSig.expiry;

      logEvent('refund-signature-verify', {
        user: refundSig.user,
        recoveredAddress,
        expectedAddress: this.signer.address,
        isValid,
        isNotExpired
      }, 'debug');

      return isValid && isNotExpired;
    } catch (error) {
      logEvent('refund-signature-verify-error', {
        error: (error as Error).message
      }, 'error');
      return false;
    }
  }

  /**
   * Get signer address
   * @returns Signer address
   */
  getSignerAddress(): string {
    return this.signer.address;
  }

  /**
   * Export nonce records for audit
   * @returns Array of nonce records
   */
  exportNonces(): NonceRecord[] {
    const records: NonceRecord[] = [];
    for (const [user, nonce] of this.nonces.entries()) {
      records.push({
        user,
        nonce,
        used: true,
        timestamp: Date.now()
      });
    }
    return records;
  }
}

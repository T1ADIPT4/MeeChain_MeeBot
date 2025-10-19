/**
 * MeeChain Trigger Route Handler
 * Handles replay, supply, and refund actions
 */

import { Request, Response } from 'express';
import { TriggerRequest, TriggerResponse, ActionType } from '../types/index.js';
import {
  getWeb3,
  getContract,
  getConfig,
  isValidAddress,
  toWei,
  getTransactionReceipt
} from '../utils/web3Config.js';
import { insertLog, updateLogStatus } from '../utils/logger.js';

/**
 * Validate request body
 */
function validateRequest(body: any): { valid: boolean; error?: string } {
  if (!body.userAddress) {
    return { valid: false, error: 'userAddress is required' };
  }
  
  if (!isValidAddress(body.userAddress)) {
    return { valid: false, error: 'Invalid Ethereum address' };
  }
  
  if (!body.action) {
    return { valid: false, error: 'action is required' };
  }
  
  const validActions: ActionType[] = ['replay', 'supply', 'refund'];
  if (!validActions.includes(body.action)) {
    return { valid: false, error: `action must be one of: ${validActions.join(', ')}` };
  }
  
  if (body.action === 'replay' && !body.amountBNB) {
    return { valid: false, error: 'amountBNB is required for replay action' };
  }
  
  if (body.action === 'replay' && isNaN(parseFloat(body.amountBNB))) {
    return { valid: false, error: 'amountBNB must be a valid number' };
  }
  
  return { valid: true };
}

/**
 * Execute confirmReplay on smart contract
 */
async function executeReplay(
  userAddress: string,
  amountBNB: string
): Promise<{ txHash: string }> {
  const contract = getContract();
  const config = getConfig();
  const amountWei = toWei(amountBNB);
  
  console.log(`🔄 Executing confirmReplay for ${userAddress}, amount: ${amountBNB} BNB`);
  
  const tx = await contract.methods
    .confirmReplay(userAddress, amountWei)
    .send({
      from: config.meeBotWalletAddress,
      gas: 200000
    });
  
  return { txHash: tx.transactionHash };
}

/**
 * Execute triggerSupply on smart contract
 */
async function executeSupply(userAddress: string): Promise<{ txHash: string }> {
  const contract = getContract();
  const config = getConfig();
  
  console.log(`💰 Executing triggerSupply for ${userAddress}`);
  
  const tx = await contract.methods
    .triggerSupply(userAddress)
    .send({
      from: config.meeBotWalletAddress,
      gas: 200000
    });
  
  return { txHash: tx.transactionHash };
}

/**
 * Execute refund on smart contract
 */
async function executeRefund(userAddress: string): Promise<{ txHash: string }> {
  const contract = getContract();
  const config = getConfig();
  
  console.log(`🔙 Executing refund for ${userAddress}`);
  
  const tx = await contract.methods
    .refund(userAddress)
    .send({
      from: config.meeBotWalletAddress,
      gas: 200000
    });
  
  return { txHash: tx.transactionHash };
}

/**
 * Check transaction status and update log
 */
async function checkTransactionStatus(txHash: string): Promise<boolean> {
  // Wait a bit for transaction to be mined
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const receipt = await getTransactionReceipt(txHash);
  
  if (!receipt) {
    return false; // Still pending
  }
  
  const success = receipt.status === true || receipt.status === 1n || receipt.status === '0x1';
  await updateLogStatus(txHash, success ? 'success' : 'failed');
  
  return success;
}

/**
 * Main trigger handler
 */
export async function handleTrigger(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const body: TriggerRequest = req.body;
    
    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: validation.error
      } as TriggerResponse);
      return;
    }
    
    const { userAddress, action, amountBNB } = body;
    let txHash: string;
    
    // Execute action
    try {
      switch (action) {
        case 'replay':
          const replayResult = await executeReplay(userAddress, amountBNB!);
          txHash = replayResult.txHash;
          break;
          
        case 'supply':
          const supplyResult = await executeSupply(userAddress);
          txHash = supplyResult.txHash;
          break;
          
        case 'refund':
          const refundResult = await executeRefund(userAddress);
          txHash = refundResult.txHash;
          break;
          
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error: any) {
      console.error('❌ Transaction execution failed:', error);
      res.status(500).json({
        success: false,
        message: 'Transaction execution failed',
        error: error.message
      } as TriggerResponse);
      return;
    }
    
    // Log transaction
    await insertLog({
      user: userAddress,
      action,
      txHash,
      status: 'pending',
      timestamp: Date.now(),
      amount: amountBNB
    });
    
    // Return immediate response
    res.json({
      success: true,
      message: `✅ Action "${action}" initiated successfully`,
      txHash
    } as TriggerResponse);
    
    // Check status asynchronously (don't await)
    checkTransactionStatus(txHash)
      .then(success => {
        if (success) {
          console.log(`✅ Transaction ${txHash} confirmed successfully`);
        } else {
          console.log(`❌ Transaction ${txHash} failed`);
        }
      })
      .catch(error => {
        console.error(`Error checking transaction status:`, error);
      });
    
  } catch (error: any) {
    console.error('❌ Unexpected error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    } as TriggerResponse);
  }
}

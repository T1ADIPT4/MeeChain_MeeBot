/**
 * Type definitions for MeeBot Web3 Backend
 */

export type ActionType = "replay" | "supply" | "refund";

export interface TriggerRequest {
  userAddress: string;
  action: ActionType;
  amountBNB?: string; // Only for replay action
}

export interface TriggerResponse {
  success: boolean;
  message: string;
  txHash?: string;
  error?: string;
}

export interface TransactionLog {
  user: string;
  action: ActionType;
  txHash: string;
  status: "pending" | "success" | "failed";
  timestamp: number;
  amount?: string;
}

export interface Web3Config {
  rpcUrl: string;
  contractAddress: string;
  meeBotWalletAddress: string;
  privateKey: string;
}

/**
 * Deploy Registry Types for MeeChain
 * Type definitions for multi-chain contract deployment registry
 */

export interface NetworkConfig {
  chainId: number
  badgeContract: string
  questContract: string
  fallbackContract: string
}

export interface DeployRegistry {
  version: string
  networks: {
    [networkName: string]: NetworkConfig
  }
  lastUpdated: string
}

export type SupportedNetwork = 'ethereum' | 'polygon' | 'arbitrum'

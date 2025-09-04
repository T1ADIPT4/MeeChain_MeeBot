import { ethers } from 'ethers';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';

// Web3 provider configuration
export const NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://cloudflare-eth.com',
    symbol: 'ETH',
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    symbol: 'MATIC',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    symbol: 'SepoliaETH',
  }
};

// Generate new wallet
export const generateWallet = () => {
  const mnemonic = generateMnemonic();
  const seed = mnemonicToSeedSync(mnemonic);
  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  
  return {
    address: wallet.address,
    mnemonic,
    privateKey: wallet.privateKey,
  };
};

// Validate Ethereum address
export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

// Format balance with decimals
export const formatBalance = (balance: string, decimals = 18): string => {
  return ethers.formatUnits(balance, decimals);
};

// Parse amount to wei
export const parseAmount = (amount: string, decimals = 18): string => {
  return ethers.parseUnits(amount, decimals).toString();
};

// Truncate address for display
export const truncateAddress = (address: string, start = 6, end = 4): string => {
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

import { Request, Response } from 'express';
import { generateWallet, isValidAddress } from '../../client/src/lib/web3-utils';

interface WalletData {
  address: string;
  balance: string;
  network: string;
}

// Mock wallet storage (ในการใช้งานจริงควรใช้ database)
const walletStorage = new Map<string, WalletData>();

export async function createWallet(req: Request, res: Response) {
  try {
    const wallet = generateWallet();
    
    const walletData: WalletData = {
      address: wallet.address,
      balance: '0',
      network: 'ethereum'
    };
    
    walletStorage.set(wallet.address, walletData);
    
    res.json({
      success: true,
      data: {
        address: wallet.address,
        balance: walletData.balance,
        network: walletData.network
      }
    });
  } catch (error) {
    console.error('Failed to create wallet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create wallet'
    });
  }
}

export async function getWallet(req: Request, res: Response) {
  try {
    const { address } = req.params;
    
    if (!isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address'
      });
    }
    
    const wallet = walletStorage.get(address);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }
    
    res.json({
      success: true,
      data: wallet
    });
  } catch (error) {
    console.error('Failed to get wallet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet'
    });
  }
}

export async function getWalletBalances(req: Request, res: Response) {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address required'
      });
    }
    
    const wallet = walletStorage.get(address);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }
    
    // Mock balances
    const balances = {
      ETH: wallet.balance,
      MATIC: '0',
      USDC: '0'
    };
    
    res.json({
      success: true,
      data: balances
    });
  } catch (error) {
    console.error('Failed to get wallet balances:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet balances'
    });
  }
}

export async function connectWallet(req: Request, res: Response) {
  try {
    const { address, signature } = req.body;
    
    if (!address || !isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Valid wallet address required'
      });
    }
    
    // สร้าง wallet data ใหม่ถ้าไม่มี
    if (!walletStorage.has(address)) {
      const walletData: WalletData = {
        address,
        balance: '0',
        network: 'ethereum'
      };
      walletStorage.set(address, walletData);
    }
    
    const wallet = walletStorage.get(address);
    
    res.json({
      success: true,
      data: {
        connected: true,
        ...wallet
      }
    });
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect wallet'
    });
  }
}

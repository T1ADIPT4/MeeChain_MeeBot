
import { Request, Response } from 'express';
import { generateWallet, isValidAddress } from '../../client/src/lib/web3-utils';

interface WalletData {
  address: string;
  balance: string;
  network: string;
}

// Mock wallet storage (ในการใช้งานจริงควรใช้ database)
const walletStorage = new Map<string, WalletData>();

// Current connected wallet address (for demo mode)
let currentWalletAddress: string | null = null;

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

// Get current connected wallet (for frontend queries)
export async function getMyWallet(req: Request, res: Response) {
  try {
    if (!currentWalletAddress) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    let wallet = walletStorage.get(currentWalletAddress);
    
    if (!wallet) {
      // Create demo wallet data if not exists
      wallet = {
        address: currentWalletAddress,
        balance: '1000000000000000000', // 1 ETH in wei for demo
        network: 'demo'
      };
      walletStorage.set(currentWalletAddress, wallet);
    }
    
    res.json({
      success: true,
      data: {
        ...wallet,
        name: 'Demo User',
        email: 'demo@meechain.app',
        tier: 'Bronze',
        level: 1
      }
    });
  } catch (error) {
    console.error('Failed to get wallet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet'
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


export async function connectWallet(req: Request, res: Response) {
  try {
    const { address, signature, isDemoMode } = req.body;
    
    if (!address || !isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Valid wallet address required'
      });
    }
    
    // Set current connected wallet
    currentWalletAddress = address;
    
    // สร้าง wallet data ใหม่ถ้าไม่มี
    if (!walletStorage.has(address)) {
      const walletData: WalletData = {
        address,
        balance: isDemoMode ? '1000000000000000000' : '0', // 1 ETH for demo
        network: isDemoMode ? 'demo' : 'ethereum'
      };
      walletStorage.set(address, walletData);
    }
    
    const wallet = walletStorage.get(address);
    
    res.json({
      success: true,
      data: {
        connected: true,
        isDemoMode: !!isDemoMode,
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

// Get wallet balances
export async function getWalletBalances(req: Request, res: Response) {
  try {
    const { address } = req.params;
    
    // Use current wallet if no address provided
    const walletAddress = address || currentWalletAddress;
    
    if (!walletAddress) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    let wallet = walletStorage.get(walletAddress);
    
    if (!wallet) {
      // Create demo data
      wallet = {
        address: walletAddress,
        balance: '1000000000000000000',
        network: 'demo'
      };
      walletStorage.set(walletAddress, wallet);
    }
    
    // Mock token balances for demo
    const balances = [
      {
        token: 'ETH',
        balance: wallet.balance,
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18
      },
      {
        token: 'MEE',
        balance: '500000000000000000000', // 500 MEE tokens
        symbol: 'MEE',
        name: 'MeeChain Token',
        decimals: 18
      }
    ];
    
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

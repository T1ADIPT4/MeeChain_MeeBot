
import { ethers } from 'ethers';

export const CUSTOM_TOKEN_ADDRESS = '0xa669b1F45F84368fBe48882bF8d1814aae7a4422';
export const FUSE_CHAIN_ID = 122;

// ERC-20 ABI for basic operations
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)'
];

export class CustomTokenActions {
  private provider: ethers.Provider;
  private contract: ethers.Contract;

  constructor(provider: ethers.Provider) {
    this.provider = provider;
    this.contract = new ethers.Contract(CUSTOM_TOKEN_ADDRESS, ERC20_ABI, provider);
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.contract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting custom token balance:', error);
      return '0';
    }
  }

  async transfer(signer: ethers.Signer, to: string, amount: string): Promise<string> {
    try {
      const contractWithSigner = this.contract.connect(signer);
      const amountWei = ethers.parseEther(amount);
      
      const tx = await contractWithSigner.transfer(to, amountWei);
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error('Error transferring custom token:', error);
      throw error;
    }
  }

  async approve(signer: ethers.Signer, spender: string, amount: string): Promise<string> {
    try {
      const contractWithSigner = this.contract.connect(signer);
      const amountWei = ethers.parseEther(amount);
      
      const tx = await contractWithSigner.approve(spender, amountWei);
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error('Error approving custom token:', error);
      throw error;
    }
  }

  async getAllowance(owner: string, spender: string): Promise<string> {
    try {
      const allowance = await this.contract.allowance(owner, spender);
      return ethers.formatEther(allowance);
    } catch (error) {
      console.error('Error getting allowance:', error);
      return '0';
    }
  }

  async getTokenInfo() {
    try {
      const [symbol, decimals] = await Promise.all([
        this.contract.symbol(),
        this.contract.decimals()
      ]);
      
      return { symbol, decimals: Number(decimals) };
    } catch (error) {
      console.error('Error getting token info:', error);
      return { symbol: 'CUSTOM', decimals: 18 };
    }
  }
}

// Helper function to check if token is valid and has liquidity
export async function validateCustomToken(provider: ethers.Provider): Promise<boolean> {
  try {
    const tokenActions = new CustomTokenActions(provider);
    const info = await tokenActions.getTokenInfo();
    
    // Basic validation
    if (!info.symbol || info.decimals <= 0) {
      return false;
    }
    
    // Additional checks can be added here:
    // - Check if token is not blacklisted
    // - Verify liquidity on DEX
    // - Check for transfer tax
    
    return true;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}

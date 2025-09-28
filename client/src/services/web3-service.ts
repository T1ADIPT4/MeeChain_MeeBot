import { ethers } from 'ethers';

// MeeToken Contract ABI (actual contract functions only)
const MEETOKEN_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function authorizedMinters(address) view returns (bool)",
  "function isMinter(address) view returns (bool)",
  "function owner() view returns (address)",
  
  // Write functions
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(address from, uint256 amount)",
  "function burnFrom(uint256 amount)",
  "function authorizeMinter(address minter)",
  "function revokeMinter(address minter)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event TokensMinted(address indexed to, uint256 amount, address indexed minter)",
  "event TokensBurned(address indexed from, uint256 amount, address indexed burner)",
  "event MinterAuthorized(address indexed minter)",
  "event MinterRevoked(address indexed minter)"
];

// QuestManager Contract ABI (updated to match fixed contract)
const QUESTMANAGER_ABI = [
  // Read functions
  "function quests(uint256) view returns (string name, string description, uint256 rewardAmount, string badgeName, string badgeDescription, string badgeTokenURI, bool isActive, uint256 completions)",
  "function completed(address, uint256) view returns (bool)",
  "function questCounter() view returns (uint256)",
  "function getQuest(uint256 questId) view returns (tuple(string name, string description, uint256 rewardAmount, string badgeName, string badgeDescription, string badgeTokenURI, bool isActive, uint256 completions))",
  "function hasCompletedQuest(address user, uint256 questId) view returns (bool)",
  "function checkAuthorization() view returns (bool isAuthorized, bool tokenAuthorized, bool badgeAuthorized)",
  "function getContractAddresses() view returns (address meeTokenAddress, address badgeNFTAddress, address questManagerAddress)",
  
  // Write functions
  "function createQuest(string name, string description, uint256 rewardAmount, string badgeName, string badgeDescription, string badgeTokenURI) returns (uint256)",
  "function completeQuest(uint256 questId)",
  "function deactivateQuest(uint256 questId)",
  
  // Events
  "event QuestCreated(uint256 indexed questId, string name)",
  "event QuestCompleted(address indexed user, uint256 indexed questId, uint256 rewardAmount)"
];

import { getContractAddress, isDeploymentSuccessful, validateDeployment } from './deploy-registry';

// Contract addresses from deploy registry
const CONTRACT_ADDRESSES = {
  MEETOKEN: getContractAddress("MeeToken"),
  BADGE_NFT: getContractAddress("MeeBadgeNFT"),
  QUEST_MANAGER: getContractAddress("QuestManager"),
  FOOTBALL_NFT: getContractAddress("FootballNFT"),
};

// Production hardening: Detect placeholder addresses
const PLACEHOLDER_PATTERN = /^0x[1-9a-f]+0*$/i; // Matches patterns like 0x1111...000

const isPlaceholderAddress = (address: string): boolean => {
  // Check for common placeholder patterns
  if (address === '0x' + '1'.repeat(40) || 
      address === '0x' + '2'.repeat(40) || 
      address === '0x' + '3'.repeat(40)) {
    return true;
  }
  // Check for other repetitive patterns
  return PLACEHOLDER_PATTERN.test(address) && (
    address.includes('1111') || 
    address.includes('2222') || 
    address.includes('3333')
  );
};

const validateProductionAddresses = (): boolean => {
  const errors: string[] = [];
  
  if (isPlaceholderAddress(CONTRACT_ADDRESSES.MEETOKEN)) {
    errors.push(`MeeToken using placeholder: ${CONTRACT_ADDRESSES.MEETOKEN}`);
  }
  if (isPlaceholderAddress(CONTRACT_ADDRESSES.BADGE_NFT)) {
    errors.push(`BadgeNFT using placeholder: ${CONTRACT_ADDRESSES.BADGE_NFT}`);
  }
  if (isPlaceholderAddress(CONTRACT_ADDRESSES.QUEST_MANAGER)) {
    errors.push(`QuestManager using placeholder: ${CONTRACT_ADDRESSES.QUEST_MANAGER}`);
  }
  
  if (errors.length > 0 && import.meta.env.NODE_ENV === 'production') {
    console.error('❌ PRODUCTION ERROR: Placeholder contract addresses detected:');
    errors.forEach(error => console.error(`   - ${error}`));
    console.error('   Set proper contract addresses in environment variables!');
    throw new Error('Cannot initialize Web3 service with placeholder addresses in production');
  }
  
  return errors.length === 0;
};

// Quest reward amounts (matching contract constants)
export const QUEST_REWARDS = {
  VOICE_COACH: ethers.parseEther("10"), // 10 MEE
  DAILY_QUEST: ethers.parseEther("50"), // 50 MEE  
  BADGE_ACHIEVEMENT: ethers.parseEther("100"), // 100 MEE
  BADGE_EQUIP: ethers.parseEther("5"), // 5 MEE for equipping
  SPECIAL_MISSION: ethers.parseEther("200"), // 200 MEE for special missions
};

// NFT/Badge purchase costs
export const PURCHASE_COSTS = {
  COMMON_BADGE: ethers.parseEther("100"), // 100 MEE
  RARE_BADGE: ethers.parseEther("500"), // 500 MEE
  LEGENDARY_BADGE: ethers.parseEther("2000"), // 2000 MEE
  BADGE_UPGRADE: ethers.parseEther("50"), // 50 MEE to upgrade
};

export interface TokenBalance {
  formatted: string;
  raw: bigint;
  symbol: string;
}

export interface TransactionResult {
  hash: string;
  success: boolean;
  error?: string;
}

export interface Quest {
  name: string;
  description: string;
  rewardAmount: bigint;
  badgeName: string;
  badgeDescription: string;
  badgeTokenURI: string;
  isActive: boolean;
  completions: bigint;
}

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private meeTokenContract: ethers.Contract | null = null;
  private questManagerContract: ethers.Contract | null = null;
  private isConnected = false;

  /**
   * Initialize Web3 connection
   */
  async initialize(): Promise<boolean> {
    try {
      // Validate deployment first
      const validation = validateDeployment();
      if (!validation.canProceed) {
        console.error('❌ Deployment validation failed:', validation.errors);
        console.warn('⚠️ Deployment warnings:', validation.warnings);
        return this.initializeDemoMode();
      }

      if (!isDeploymentSuccessful()) {
        console.warn('⚠️ Deployment not successful, using demo mode');
        return this.initializeDemoMode();
      }

      if (typeof window.ethereum === 'undefined') {
        console.warn('MetaMask not detected - using demo mode');
        return this.initializeDemoMode();
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      await this.provider.send("eth_requestAccounts", []);
      
      this.signer = await this.provider.getSigner();
      this.meeTokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.MEETOKEN,
        MEETOKEN_ABI,
        this.signer
      );
      this.questManagerContract = new ethers.Contract(
        CONTRACT_ADDRESSES.QUEST_MANAGER,
        QUESTMANAGER_ABI,
        this.signer
      );
      
      this.isConnected = true;
      console.log('✅ Web3 initialized successfully with deploy registry');
      console.log('📋 Using contracts:', CONTRACT_ADDRESSES);
      return true;
    } catch (error) {
      console.warn('Web3 initialization failed, using demo mode:', error);
      return this.initializeDemoMode();
    }
  }

  /**
   * Initialize demo mode for development/testing
   */
  private async initializeDemoMode(): Promise<boolean> {
    // Create mock provider and contract for demo purposes
    this.isConnected = false; // Mark as demo mode
    console.log('Running in demo mode - Web3 features simulated');
    return true;
  }

  /**
   * Check if wallet is connected
   */
  isWalletConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get current wallet address
   */
  async getCurrentAddress(): Promise<string | null> {
    try {
      if (!this.signer || !this.isConnected) {
        return 'demo-address-' + Math.random().toString(36).substr(2, 8);
      }
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }

  /**
   * Get MeeToken balance for address
   */
  async getTokenBalance(address?: string): Promise<TokenBalance> {
    try {
      if (!this.meeTokenContract || !this.isConnected) {
        // Demo mode - return mock balance
        const mockBalance = BigInt(Math.floor(Math.random() * 10000));
        return {
          raw: mockBalance * BigInt(10**18),
          formatted: ethers.formatEther(mockBalance * BigInt(10**18)),
          symbol: 'MEE'
        };
      }

      const userAddress = address || await this.getCurrentAddress();
      if (!userAddress) throw new Error('No address available');

      const balance = await this.meeTokenContract.balanceOf(userAddress);
      return {
        raw: balance,
        formatted: ethers.formatEther(balance),
        symbol: 'MEE'
      };
    } catch (error) {
      console.error('Error getting token balance:', error);
      return { raw: BigInt(0), formatted: '0.0', symbol: 'MEE' };
    }
  }

  /**
   * Complete a quest (via QuestManager contract)
   */
  async completeQuest(questId: number): Promise<TransactionResult> {
    try {
      if (!this.questManagerContract || !this.isConnected) {
        // Demo mode - simulate transaction
        console.log(`Demo: Completing quest ${questId}`);
        return {
          hash: 'demo-quest-' + Date.now(),
          success: true
        };
      }

      const tx = await this.questManagerContract.completeQuest(questId);
      const receipt = await tx.wait();
      
      return {
        hash: receipt.hash,
        success: receipt.status === 1
      };
    } catch (error: any) {
      console.error('Error completing quest:', error);
      return {
        hash: '',
        success: false,
        error: error.message || 'Quest completion failed'
      };
    }
  }

  /**
   * Create a new quest (owner only)
   */
  async createQuest(
    name: string,
    description: string,
    rewardAmount: bigint,
    badgeName: string,
    badgeDescription: string,
    badgeTokenURI: string
  ): Promise<TransactionResult> {
    try {
      if (!this.questManagerContract || !this.isConnected) {
        // Demo mode - simulate transaction
        console.log(`Demo: Creating quest ${name}`);
        return {
          hash: 'demo-create-' + Date.now(),
          success: true
        };
      }

      const tx = await this.questManagerContract.createQuest(
        name,
        description,
        rewardAmount,
        badgeName,
        badgeDescription,
        badgeTokenURI
      );
      
      const receipt = await tx.wait();
      return {
        hash: receipt.hash,
        success: receipt.status === 1
      };
    } catch (error: any) {
      console.error('Error creating quest:', error);
      return {
        hash: '',
        success: false,
        error: error.message || 'Quest creation failed'
      };
    }
  }

  /**
   * Burn tokens from user's own balance
   */
  async burnTokens(amount: bigint): Promise<TransactionResult> {
    try {
      if (!this.meeTokenContract || !this.isConnected) {
        // Demo mode - simulate transaction
        console.log(`Demo: Burning ${ethers.formatEther(amount)} MEE`);
        return {
          hash: 'demo-burn-' + Date.now(),
          success: true
        };
      }

      const tx = await this.meeTokenContract.burnFrom(amount);
      const receipt = await tx.wait();
      
      return {
        hash: receipt.hash,
        success: receipt.status === 1
      };
    } catch (error: any) {
      console.error('Error burning tokens:', error);
      return {
        hash: '',
        success: false,
        error: error.message || 'Burn transaction failed'
      };
    }
  }

  /**
   * Get quest details by ID
   */
  async getQuest(questId: number): Promise<Quest | null> {
    try {
      if (!this.questManagerContract || !this.isConnected) {
        // Demo mode - return mock quest
        return {
          name: `Demo Quest ${questId}`,
          description: `This is a demo quest ${questId}`,
          rewardAmount: QUEST_REWARDS.DAILY_QUEST,
          badgeName: `Demo Badge ${questId}`,
          badgeDescription: `Demo badge for quest ${questId}`,
          badgeTokenURI: `https://demo.com/badge${questId}`,
          isActive: true,
          completions: BigInt(0)
        };
      }

      const quest = await this.questManagerContract.getQuest(questId);
      return {
        name: quest.name,
        description: quest.description,
        rewardAmount: quest.rewardAmount,
        badgeName: quest.badgeName,
        badgeDescription: quest.badgeDescription,
        badgeTokenURI: quest.badgeTokenURI,
        isActive: quest.isActive,
        completions: quest.completions
      };
    } catch (error) {
      console.error('Error getting quest:', error);
      return null;
    }
  }

  /**
   * Check if user has completed a specific quest
   */
  async hasCompletedQuest(questId: number, userAddress?: string): Promise<boolean> {
    try {
      if (!this.questManagerContract || !this.isConnected) {
        // Demo mode - return false
        return false;
      }

      const address = userAddress || await this.getCurrentAddress();
      if (!address) return false;

      return await this.questManagerContract.hasCompletedQuest(address, questId);
    } catch (error) {
      console.error('Error checking quest completion:', error);
      return false;
    }
  }

  /**
   * Transfer tokens to another address
   */
  async transferTokens(
    toAddress: string,
    amount: bigint
  ): Promise<TransactionResult> {
    try {
      if (!this.meeTokenContract || !this.isConnected) {
        // Demo mode
        console.log(`Demo: Transferring ${ethers.formatEther(amount)} MEE to ${toAddress}`);
        return {
          hash: 'demo-transfer-' + Date.now(),
          success: true
        };
      }

      const tx = await this.meeTokenContract.transfer(toAddress, amount);
      const receipt = await tx.wait();
      
      return {
        hash: receipt.hash,
        success: receipt.status === 1
      };
    } catch (error: any) {
      console.error('Error transferring tokens:', error);
      return {
        hash: '',
        success: false,
        error: error.message || 'Transfer failed'
      };
    }
  }

  /**
   * Initialize contract authorization (owner only)
   * This must be called after deploying contracts to authorize QuestManager
   */
  async initializeAuthorization(): Promise<TransactionResult> {
    try {
      if (!this.questManagerContract || !this.isConnected) {
        // Demo mode - simulate transaction
        console.log('Demo: Initializing contract authorization');
        return {
          hash: 'demo-init-' + Date.now(),
          success: true
        };
      }

      const tx = await this.questManagerContract.initializeAuthorization();
      const receipt = await tx.wait();
      
      return {
        hash: receipt.hash,
        success: receipt.status === 1
      };
    } catch (error: any) {
      console.error('Error initializing authorization:', error);
      return {
        hash: '',
        success: false,
        error: error.message || 'Authorization initialization failed'
      };
    }
  }

  /**
   * Get token contract info
   */
  async getTokenInfo() {
    try {
      if (!this.meeTokenContract || !this.isConnected) {
        return {
          name: 'MeeToken',
          symbol: 'MEE',
          decimals: 18,
          totalSupply: '10000000.0'
        };
      }

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.meeTokenContract.name(),
        this.meeTokenContract.symbol(),
        this.meeTokenContract.decimals(),
        this.meeTokenContract.totalSupply()
      ]);

      return {
        name,
        symbol,
        decimals,
        totalSupply: ethers.formatEther(totalSupply)
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      return {
        name: 'MeeToken',
        symbol: 'MEE',
        decimals: 18,
        totalSupply: '0.0'
      };
    }
  }
}


// Export singleton instance
export const web3Service = new Web3Service();

// Helper functions
export const formatTokenAmount = (amount: bigint, decimals = 18): string => {
  return ethers.formatUnits(amount, decimals);
};

export const parseTokenAmount = (amount: string, decimals = 18): bigint => {
  return ethers.parseUnits(amount, decimals);
};

export default web3Service;
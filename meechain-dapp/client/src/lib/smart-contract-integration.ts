
import { ethers } from 'ethers';
import { getContractInstances, CONTRACT_ADDRESSES } from './contract-abi-checker';

interface BadgeData {
  tokenId: number;
  name: string;
  description: string;
  power: string;
  level: number;
  maxLevel: number;
  rarity: number;
  category: number;
  mintedAt: number;
  originalOwner: string;
  isQuestReward: boolean;
  questId: string;
  powerBoost: number;
  isUpgradeable: boolean;
}

interface QuestProgress {
  completed: number;
  total: number;
  isCompleted: boolean;
  meeBotQuote: string;
}

export class SmartContractService {
  private provider: ethers.JsonRpcProvider;
  private signer?: ethers.Signer;

  constructor(signer?: ethers.Signer | null) {
    this.signer = signer || undefined;
    this.provider = (signer?.provider as ethers.JsonRpcProvider) || new ethers.JsonRpcProvider(CONTRACT_ADDRESSES.FUSE_RPC);
    this.isDemoMode = !signer;
  }

  private isDemoMode: boolean = false;

  /**
   * Get contract instances
   */
  getContracts() {
    return getContractInstances(this.signer);
  }

  /**
   * Check if user has specific badge
   */
  async userHasBadge(userAddress: string, badgeName: string): Promise<boolean> {
    try {
      const { badgeNFT } = this.getContracts();
      return await badgeNFT.userHasBadge(userAddress, badgeName);
    } catch (error) {
      console.error('Error checking badge:', error);
      return false;
    }
  }

  /**
   * Get user's badges with power information
   */
  async getUserBadges(userAddress: string): Promise<BadgeData[]> {
    try {
      // Return mock data for demo mode
      if (this.isDemoMode) {
        return [
          {
            tokenId: 1,
            name: "Early Adopter",
            description: "Joined MeeChain in its early days",
            power: "Boost XP gain by 10%",
            level: 1,
            maxLevel: 3,
            rarity: 1,
            category: 0,
            mintedAt: Date.now(),
            originalOwner: userAddress,
            isQuestReward: false,
            questId: "",
            powerBoost: 10,
            isUpgradeable: true
          }
        ];
      }

      const { badgeNFT } = this.getContracts();
      const badges = await badgeNFT.getUserBadgesWithPowers(userAddress);
      return badges.map((badge: any) => ({
        tokenId: Number(badge.tokenId),
        name: badge.name,
        description: badge.description,
        power: badge.power,
        level: Number(badge.level),
        maxLevel: Number(badge.maxLevel),
        rarity: Number(badge.rarity),
        category: Number(badge.category),
        mintedAt: Number(badge.mintedAt),
        originalOwner: badge.originalOwner,
        isQuestReward: badge.isQuestReward,
        questId: badge.questId,
        powerBoost: Number(badge.powerBoost),
        isUpgradeable: badge.isUpgradeable
      }));
    } catch (error) {
      console.error('Error getting user badges:', error);
      // Return demo data when contract fails
      return [
        {
          tokenId: 1,
          name: "Demo Badge",
          description: "This is a demo badge for testing",
          power: "Demo power",
          level: 1,
          maxLevel: 3,
          rarity: 1,
          category: 0,
          mintedAt: Date.now(),
          originalOwner: userAddress,
          isQuestReward: false,
          questId: "",
          powerBoost: 0,
          isUpgradeable: false
        }
      ];
    }
  }

  /**
   * Get quest set progress
   */
  async getQuestProgress(userAddress: string, questId: string): Promise<QuestProgress> {
    try {
      const { badgeNFT } = this.getContracts();
      const progress = await badgeNFT.getQuestSetProgress(userAddress, questId);
      return {
        completed: Number(progress.completed),
        total: Number(progress.total),
        isCompleted: progress.isCompleted,
        meeBotQuote: progress.meeBotQuote
      };
    } catch (error) {
      console.error('Error getting quest progress:', error);
      return { completed: 0, total: 0, isCompleted: false, meeBotQuote: '' };
    }
  }

  /**
   * Get user XP and level
   */
  async getUserStats(userAddress: string): Promise<{ xp: number; level: number }> {
    try {
      const { badgeNFT } = this.getContracts();
      const [xp, level] = await Promise.all([
        badgeNFT.userXP(userAddress),
        badgeNFT.userLevel(userAddress)
      ]);
      return {
        xp: Number(xp),
        level: Number(level)
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { xp: 0, level: 0 };
    }
  }

  /**
   * Mint badge (owner only)
   */
  async mintBadge(
    to: string,
    name: string,
    description: string,
    power: string,
    powerBoost: number,
    rarity: number,
    category: number,
    tokenURI: string,
    isQuestReward: boolean = false,
    questId: string = ""
  ): Promise<string | null> {
    try {
      if (!this.signer) throw new Error('Signer required for minting');
      
      const { badgeNFT } = this.getContracts();
      const tx = await badgeNFT.mintBadge(
        to, name, description, power, powerBoost, 
        rarity, category, tokenURI, isQuestReward, questId
      );
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error minting badge:', error);
      return null;
    }
  }

  /**
   * Upgrade badge
   */
  async upgradeBadge(tokenId: number): Promise<string | null> {
    try {
      if (!this.signer) throw new Error('Signer required for upgrading');
      
      const { badgeNFT } = this.getContracts();
      const tx = await badgeNFT.upgradeBadge(tokenId);
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error upgrading badge:', error);
      return null;
    }
  }

  /**
   * Activate badge power
   */
  async activateBadgePower(tokenId: number): Promise<string | null> {
    try {
      if (!this.signer) throw new Error('Signer required for power activation');
      
      const { badgeNFT } = this.getContracts();
      const tx = await badgeNFT.activatePower(tokenId);
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error activating power:', error);
      return null;
    }
  }

  /**
   * Upgrade badge rarity using MeeToken
   */
  async upgradeBadgeRarity(tokenId: number): Promise<string | null> {
    try {
      if (!this.signer) throw new Error('Signer required for badge upgrade');
      
      // Note: This requires BadgeNFTUpgrade contract to be deployed
      const upgradeContractAddress = process.env.VITE_BADGE_UPGRADE_CONTRACT_ADDRESS;
      if (!upgradeContractAddress) {
        throw new Error('Badge upgrade contract address not configured');
      }
      
      const upgradeContract = new ethers.Contract(
        upgradeContractAddress,
        [
          'function upgradeBadge(uint256 tokenId) external',
          'function getUpgradeCost(uint256 tokenId) external view returns (uint256)',
          'function canUpgradeBadge(uint256 tokenId, address user) external view returns (bool, string)',
        ],
        this.signer
      );
      
      const tx = await upgradeContract.upgradeBadge(tokenId);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error upgrading badge:', error);
      return null;
    }
  }

  /**
   * Get badge upgrade cost
   */
  async getBadgeUpgradeCost(tokenId: number): Promise<string | null> {
    try {
      const upgradeContractAddress = process.env.VITE_BADGE_UPGRADE_CONTRACT_ADDRESS;
      if (!upgradeContractAddress) return null;
      
      const upgradeContract = new ethers.Contract(
        upgradeContractAddress,
        ['function getUpgradeCost(uint256 tokenId) external view returns (uint256)'],
        this.provider
      );
      
      const cost = await upgradeContract.getUpgradeCost(tokenId);
      return ethers.formatEther(cost);
    } catch (error) {
      console.error('Error getting upgrade cost:', error);
      return null;
    }
  }

  /**
   * Check if badge can be upgraded
   */
  async canUpgradeBadge(tokenId: number, userAddress: string): Promise<{ canUpgrade: boolean; reason: string }> {
    try {
      const upgradeContractAddress = process.env.VITE_BADGE_UPGRADE_CONTRACT_ADDRESS;
      if (!upgradeContractAddress) {
        return { canUpgrade: false, reason: 'Upgrade contract not configured' };
      }
      
      const upgradeContract = new ethers.Contract(
        upgradeContractAddress,
        ['function canUpgradeBadge(uint256 tokenId, address user) external view returns (bool, string)'],
        this.provider
      );
      
      const [canUpgrade, reason] = await upgradeContract.canUpgradeBadge(tokenId, userAddress);
      return { canUpgrade, reason };
    } catch (error) {
      console.error('Error checking upgrade eligibility:', error);
      return { canUpgrade: false, reason: 'Error checking upgrade status' };
    }
  }

  /**
   * Get MEE token balance
   */
  async getMEEBalance(userAddress: string): Promise<string> {
    try {
      const { meeToken } = this.getContracts();
      const balance = await meeToken.balanceOf(userAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting MEE balance:', error);
      return '0';
    }
  }

  /**
   * Get user tier from MEE token
   */
  async getUserTier(userAddress: string): Promise<number> {
    try {
      const { meeToken } = this.getContracts();
      const tier = await meeToken.getUserTier(userAddress);
      return Number(tier);
    } catch (error) {
      console.error('Error getting user tier:', error);
      return 0;
    }
  }

  /**
   * Check if contracts are deployed and accessible
   */
  async validateContracts(): Promise<{
    tokenContract: boolean;
    membershipNFT: boolean;
    badgeNFT: boolean;
    rpcConnected: boolean;
  }> {
    try {
      // Return mock data for demo mode without making RPC calls
      if (this.isDemoMode) {
        return {
          tokenContract: true,
          membershipNFT: true,
          badgeNFT: true,
          rpcConnected: true
        };
      }

      // Test RPC connection
      await this.provider.getBlockNumber();
      
      // Test contract code existence
      const [tokenCode, membershipCode, badgeCode] = await Promise.all([
        this.provider.getCode(CONTRACT_ADDRESSES.MEE_TOKEN),
        this.provider.getCode(CONTRACT_ADDRESSES.MEMBERSHIP_NFT),
        this.provider.getCode(CONTRACT_ADDRESSES.BADGE_NFT)
      ]);
      
      return {
        tokenContract: tokenCode !== "0x",
        membershipNFT: membershipCode !== "0x",
        badgeNFT: badgeCode !== "0x",
        rpcConnected: true
      };
    } catch (error) {
      if (!this.isDemoMode) {
        console.error('Contract validation failed:', error);
      }
      return {
        tokenContract: this.isDemoMode,
        membershipNFT: this.isDemoMode,
        badgeNFT: this.isDemoMode,
        rpcConnected: this.isDemoMode
      };
    }
  }
}

export default SmartContractService;

import { ethers } from 'ethers';

const QUEST_MANAGER_ABI = [
  "function completeQuest(uint256 questId)",
  "function getQuest(uint256 questId) view returns (string name, string description, uint256 rewardAmount, string rewardType, string badgeName, string badgeDescription, string badgeTokenURI, string playerName, string playerPosition, uint256 playerRating, string playerNationality, bool isLegendary, bool isActive, uint256 completions)",
  "function hasCompletedQuest(address user, uint256 questId) view returns (bool)",
  "function createQuest(string name, string description, uint256 rewardAmount, string rewardType, string badgeName, string badgeDescription, string badgeTokenURI) returns (uint256)",
  "function questCounter() view returns (uint256)",
  "function checkAuthorization() view returns (bool isAuthorized, bool tokenAuthorized, bool badgeAuthorized, bool footballNFTAuthorized)",
  "event QuestCompleted(address indexed user, uint256 indexed questId, uint256 rewardAmount)",
  "event QuestCreated(uint256 indexed questId, string name, string rewardType)"
];

export interface Quest {
  questId: number;
  name: string;
  description: string;
  rewardAmount: string;
  rewardType: string;
  badgeName: string;
  badgeDescription: string;
  badgeTokenURI: string;
  playerName?: string;
  playerPosition?: string;
  playerRating?: number;
  playerNationality?: string;
  isLegendary?: boolean;
  isActive: boolean;
  completions: number;
}

class QuestContractService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private contractAddress: string;

  constructor() {
    const rpcUrl = import.meta.env.VITE_RPC_URL || 'http://localhost:8545';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    this.contractAddress = import.meta.env.VITE_QUEST_MANAGER_ADDRESS || '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';
    this.contract = new ethers.Contract(
      this.contractAddress,
      QUEST_MANAGER_ABI,
      this.provider
    );
  }

  async getQuestCount(): Promise<number> {
    try {
      const count = await this.contract.questCounter();
      return Number(count);
    } catch (error) {
      console.error('Failed to get quest count:', error);
      return 0;
    }
  }

  async getQuest(questId: number): Promise<Quest | null> {
    try {
      const result = await this.contract.getQuest(questId);
      
      return {
        questId,
        name: result.name,
        description: result.description,
        rewardAmount: ethers.formatEther(result.rewardAmount),
        rewardType: result.rewardType,
        badgeName: result.badgeName,
        badgeDescription: result.badgeDescription,
        badgeTokenURI: result.badgeTokenURI,
        playerName: result.playerName || undefined,
        playerPosition: result.playerPosition || undefined,
        playerRating: result.playerRating ? Number(result.playerRating) : undefined,
        playerNationality: result.playerNationality || undefined,
        isLegendary: result.isLegendary,
        isActive: result.isActive,
        completions: Number(result.completions)
      };
    } catch (error) {
      console.error(`Failed to get quest ${questId}:`, error);
      return null;
    }
  }

  async getAllActiveQuests(): Promise<Quest[]> {
    try {
      const count = await this.getQuestCount();
      const quests: Quest[] = [];

      for (let i = 0; i < count; i++) {
        const quest = await this.getQuest(i);
        if (quest && quest.isActive) {
          quests.push(quest);
        }
      }

      return quests;
    } catch (error) {
      console.error('Failed to get all quests:', error);
      return [];
    }
  }

  async hasCompletedQuest(userAddress: string, questId: number): Promise<boolean> {
    try {
      return await this.contract.hasCompletedQuest(userAddress, questId);
    } catch (error) {
      console.error(`Failed to check completion for quest ${questId}:`, error);
      return false;
    }
  }

  async completeQuest(questId: number, signer: ethers.Signer): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const contractWithSigner = this.contract.connect(signer) as ethers.Contract;
      const tx = await contractWithSigner.completeQuest(questId);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt?.hash
      };
    } catch (error: any) {
      console.error(`Failed to complete quest ${questId}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to complete quest'
      };
    }
  }

  async checkAuthorization(): Promise<{
    isAuthorized: boolean;
    tokenAuthorized: boolean;
    badgeAuthorized: boolean;
    footballNFTAuthorized: boolean;
  }> {
    try {
      const result = await this.contract.checkAuthorization();
      return {
        isAuthorized: result.isAuthorized,
        tokenAuthorized: result.tokenAuthorized,
        badgeAuthorized: result.badgeAuthorized,
        footballNFTAuthorized: result.footballNFTAuthorized
      };
    } catch (error) {
      console.error('Failed to check authorization:', error);
      return {
        isAuthorized: false,
        tokenAuthorized: false,
        badgeAuthorized: false,
        footballNFTAuthorized: false
      };
    }
  }

  getContractAddress(): string {
    return this.contractAddress;
  }
}

export const questContractService = new QuestContractService();

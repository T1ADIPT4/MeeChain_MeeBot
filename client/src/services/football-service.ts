
import { ethers } from 'ethers';
import { getContractAddress, isFeatureEnabled } from './deploy-registry';

export interface FootballPlayerData {
  name: string;
  position: string;
  rating: number;
  rarity: number;
  skills: {
    pace: number;
    shooting: number;
    passing: number;
    defending: number;
    dribbling: number;
    physical: number;
  };
  metadata: string; // IPFS URI
}

export class FootballService {
  private provider: ethers.providers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private footballNFTContract: ethers.Contract | null = null;

  constructor(provider?: ethers.providers.Provider, signer?: ethers.Signer) {
    this.provider = provider || null;
    this.signer = signer || null;
    this.initializeContracts();
  }

  private initializeContracts() {
    if (!this.provider) return;

    const footballNFTAddress = getContractAddress('FootballNFT');
    if (footballNFTAddress === '0x0000000000000000000000000000000000000000') {
      console.warn('FootballNFT contract not deployed');
      return;
    }

    // Mock ABI for demonstration - in real app, import from contracts
    const footballNFTABI = [
      "function mintPlayer(address to, string name, string position, uint256 rating, uint256 rarity, string metadata) external",
      "function getPlayerData(uint256 tokenId) external view returns (tuple(string name, string position, uint256 rating, uint256 rarity, string metadata))",
      "function getUserPlayers(address user) external view returns (uint256[])",
      "function transferPlayer(address to, uint256 tokenId) external",
      "event PlayerMinted(address indexed to, uint256 indexed tokenId, string name)"
    ];

    this.footballNFTContract = new ethers.Contract(
      footballNFTAddress,
      footballNFTABI,
      this.signer || this.provider
    );
  }

  /**
   * Check if football features are enabled
   */
  isFootballEnabled(): boolean {
    return isFeatureEnabled('footballPlayers');
  }

  /**
   * Mint a new football player NFT
   */
  async mintPlayer(
    to: string,
    playerData: FootballPlayerData
  ): Promise<string | null> {
    try {
      if (!this.footballNFTContract || !this.signer) {
        throw new Error('Contract not initialized or signer required');
      }

      const tx = await this.footballNFTContract.mintPlayer(
        to,
        playerData.name,
        playerData.position,
        playerData.rating,
        playerData.rarity,
        playerData.metadata
      );

      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error minting football player:', error);
      return null;
    }
  }

  /**
   * Get player data by token ID
   */
  async getPlayerData(tokenId: number): Promise<FootballPlayerData | null> {
    try {
      if (!this.footballNFTContract) {
        throw new Error('Contract not initialized');
      }

      const playerData = await this.footballNFTContract.getPlayerData(tokenId);
      return {
        name: playerData.name,
        position: playerData.position,
        rating: playerData.rating.toNumber(),
        rarity: playerData.rarity.toNumber(),
        skills: {
          pace: 0, // These would come from metadata
          shooting: 0,
          passing: 0,
          defending: 0,
          dribbling: 0,
          physical: 0
        },
        metadata: playerData.metadata
      };
    } catch (error) {
      console.error('Error getting player data:', error);
      return null;
    }
  }

  /**
   * Get all players owned by a user
   */
  async getUserPlayers(userAddress: string): Promise<number[]> {
    try {
      if (!this.footballNFTContract) {
        throw new Error('Contract not initialized');
      }

      const playerIds = await this.footballNFTContract.getUserPlayers(userAddress);
      return playerIds.map((id: ethers.BigNumber) => id.toNumber());
    } catch (error) {
      console.error('Error getting user players:', error);
      return [];
    }
  }

  /**
   * Transfer a player to another address
   */
  async transferPlayer(to: string, tokenId: number): Promise<string | null> {
    try {
      if (!this.footballNFTContract || !this.signer) {
        throw new Error('Contract not initialized or signer required');
      }

      const tx = await this.footballNFTContract.transferPlayer(to, tokenId);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error transferring player:', error);
      return null;
    }
  }

  /**
   * Create a quest for recruiting a specific player
   */
  async createRecruitmentQuest(
    questTitle: string,
    questDescription: string,
    playerName: string,
    playerMetadata: string,
    meeReward: string
  ): Promise<string | null> {
    try {
      // This would call QuestManager.createQuestWithType
      // with rewardType = "player"
      console.log('Creating recruitment quest:', {
        questTitle,
        questDescription,
        playerName,
        playerMetadata,
        meeReward
      });

      // Mock implementation - in real app, call QuestManager
      return "0x1234567890abcdef1234567890abcdef12345678";
    } catch (error) {
      console.error('Error creating recruitment quest:', error);
      return null;
    }
  }

  /**
   * Demo mode functions for fallback
   */
  async mintPlayerDemo(playerData: FootballPlayerData): Promise<boolean> {
    console.log('🎮 Demo: Minting player', playerData.name);
    
    // Simulate contract interaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock success
    return true;
  }

  async getUserPlayersDemo(): Promise<FootballPlayerData[]> {
    console.log('🎮 Demo: Getting user players');
    
    // Return mock player data
    return [
      {
        name: "Demo Player 1",
        position: "FWD",
        rating: 85,
        rarity: 2,
        skills: {
          pace: 88,
          shooting: 82,
          passing: 75,
          defending: 35,
          dribbling: 85,
          physical: 78
        },
        metadata: "ipfs://demo1"
      }
    ];
  }
}

// Export a singleton instance
export const footballService = new FootballService();

// Helper function to initialize with provider/signer
export const initializeFootballService = (
  provider: ethers.providers.Provider,
  signer?: ethers.Signer
) => {
  return new FootballService(provider, signer);
};

export default footballService;

import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { getDeployConfig } from '../utils/deploy-config.js';

const QUEST_MANAGER_ABI = [
  "function getQuest(uint256 questId) view returns (string name, string description, uint256 rewardAmount, string rewardType, string badgeName, string badgeDescription, string badgeTokenURI, string playerName, string playerPosition, uint256 playerRating, string playerNationality, bool isLegendary, bool isActive, uint256 completions)",
  "function questCounter() view returns (uint256)",
  "function hasCompletedQuest(address user, uint256 questId) view returns (bool)"
];

export async function getQuestList(req: Request, res: Response) {
  try {
    const { userAddress } = req.query;
    const deployRegistry = getDeployConfig();

    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: 'Contract configuration missing'
      });
    }

    const rpcUrl = process.env.RPC_URL || 'https://sepolia.optimism.io';
    console.log('[Quest API] Using RPC:', rpcUrl);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(
      deployRegistry.contracts.QuestManager,
      QUEST_MANAGER_ABI,
      provider
    );

    const questCount = await contract.questCounter();
    const quests = [];

    for (let i = 0; i < Number(questCount); i++) {
      try {
        const quest = await contract.getQuest(i);
        
        if (!quest.isActive) continue;

        let status = 'pending';
        if (userAddress && ethers.isAddress(userAddress as string)) {
          const completed = await contract.hasCompletedQuest(userAddress as string, i);
          if (completed) {
            status = 'completed';
          }
        }

        quests.push({
          questId: i,
          title: quest.name,
          description: quest.description,
          status,
          reward: {
            type: quest.rewardType,
            amount: ethers.formatEther(quest.rewardAmount),
            token: 'MEE',
            badgeName: quest.badgeName || null,
            badgeDescription: quest.badgeDescription || null
          },
          completions: Number(quest.completions),
          isActive: quest.isActive
        });
      } catch (error) {
        console.error(`Failed to fetch quest ${i}:`, error);
      }
    }

    res.json({
      success: true,
      data: quests
    });
  } catch (error) {
    console.error('Quest list error:', error);
    
    const mockQuests = [
      {
        questId: 0,
        title: 'Welcome to MeeChain',
        description: 'Complete your first quest to earn MEE tokens',
        status: 'pending',
        reward: {
          type: 'token',
          amount: '100',
          token: 'MEE',
          badgeName: 'First Steps',
          badgeDescription: 'Completed first quest'
        },
        completions: 0,
        isActive: true
      },
      {
        questId: 1,
        title: 'Explorer Badge',
        description: 'Explore all features of the platform',
        status: 'pending',
        reward: {
          type: 'badge',
          amount: '50',
          token: 'MEE',
          badgeName: 'Explorer',
          badgeDescription: 'Platform explorer'
        },
        completions: 0,
        isActive: true
      }
    ];

    res.json({
      success: true,
      data: mockQuests,
      isMockData: true,
      message: 'Using mock data - Hardhat node not running'
    });
  }
}

export async function completeQuestAPI(req: Request, res: Response) {
  try {
    const { questId, userAddress } = req.body;

    if (questId === undefined || !userAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing questId or userAddress'
      });
    }

    if (!ethers.isAddress(userAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address'
      });
    }

    const deployRegistry = getDeployConfig();
    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: 'Contract configuration missing'
      });
    }

    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || 'https://sepolia.optimism.io';
    
    console.log('[Quest Complete] Using RPC:', rpcUrl);

    if (!privateKey) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration missing - no private key'
      });
    }

    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const signer = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(
        deployRegistry.contracts.QuestManager,
        QUEST_MANAGER_ABI,
        signer
      );

      const hasCompleted = await contract.hasCompletedQuest(userAddress, questId);
      if (hasCompleted) {
        return res.status(400).json({
          success: false,
          error: 'Quest already completed'
        });
      }

      console.log(`[Quest Complete] Completing quest ${questId} for ${userAddress}...`);
      const tx = await contract.completeQuest(questId);
      const receipt = await tx.wait();

      console.log(`[Quest Complete] Success! TX: ${receipt.hash}`);

      res.json({
        success: true,
        data: {
          questId,
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          message: 'Quest completed successfully on-chain!'
        }
      });
    } catch (contractError: any) {
      console.error('[Quest Complete] Contract error:', contractError);
      res.status(500).json({
        success: false,
        error: contractError.message || 'Failed to complete quest on-chain'
      });
    }
  } catch (error: any) {
    console.error('[Quest Complete] API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to complete quest'
    });
  }
}

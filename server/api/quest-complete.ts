
import { Request, Response } from 'express';
import { ethers } from 'ethers';

interface CompleteQuestRequest {
  questId: number;
  account: string;
}

export async function completeQuest(req: Request, res: Response) {
  try {
    const { questId, account }: CompleteQuestRequest = req.body;

    // Validate required fields
    if (questId === undefined || !account) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate Ethereum address
    if (!ethers.isAddress(account)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address'
      });
    }

    // Get contract instances
    const questManagerAddress = process.env.QUEST_MANAGER_CONTRACT_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || 'https://rpc.fuse.io';

    if (!questManagerAddress || !privateKey) {
      return res.status(500).json({
        success: false,
        error: 'Contract configuration missing'
      });
    }

    // Setup provider and signer
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    // Quest Manager contract ABI (simplified)
    const questManagerABI = [
      'function completeQuest(uint256 questId) external',
      'function getQuest(uint256 questId) external view returns (tuple(string name, string description, uint256 rewardAmount, string badgeName, string badgeDescription, string badgeTokenURI, bool isActive, uint256 completions))',
      'function hasCompletedQuest(address user, uint256 questId) external view returns (bool)',
      'function checkAuthorization() external view returns (bool isAuthorized, bool tokenAuthorized, bool badgeAuthorized)'
    ];

    const questManagerContract = new ethers.Contract(questManagerAddress, questManagerABI, signer);

    // Check if user has already completed the quest
    const hasCompleted = await questManagerContract.hasCompletedQuest(account, questId);
    if (hasCompleted) {
      return res.status(400).json({
        success: false,
        error: 'Quest already completed by this user'
      });
    }

    // Get quest details
    const quest = await questManagerContract.getQuest(questId);
    if (!quest.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Quest is not active'
      });
    }

    // Check if contract is properly authorized
    const [isAuthorized, tokenAuthorized, badgeAuthorized] = await questManagerContract.checkAuthorization();
    if (!isAuthorized) {
      return res.status(500).json({
        success: false,
        error: `Contract authorization missing - Token: ${tokenAuthorized}, Badge: ${badgeAuthorized}`
      });
    }

    // Complete the quest (this will automatically mint tokens and badge)
    const tx = await questManagerContract.completeQuest(questId);
    const receipt = await tx.wait();

    res.json({
      success: true,
      data: {
        transactionHash: tx.hash,
        questId,
        questName: quest.name,
        rewardAmount: ethers.formatEther(quest.rewardAmount),
        badgeName: quest.badgeName,
        account,
        blockNumber: receipt.blockNumber
      }
    });

  } catch (error) {
    console.error('Error completing quest:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

export async function getQuestList(req: Request, res: Response) {
  try {
    const questManagerAddress = process.env.QUEST_MANAGER_CONTRACT_ADDRESS;
    const rpcUrl = process.env.RPC_URL || 'https://rpc.fuse.io';

    if (!questManagerAddress) {
      return res.status(500).json({
        success: false,
        error: 'Contract configuration missing'
      });
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    const questManagerABI = [
      'function questCounter() external view returns (uint256)',
      'function getQuest(uint256 questId) external view returns (tuple(string name, string description, uint256 rewardAmount, string badgeName, string badgeDescription, string badgeTokenURI, bool isActive, uint256 completions))'
    ];

    const questManagerContract = new ethers.Contract(questManagerAddress, questManagerABI, provider);

    // Get total number of quests
    const questCounter = await questManagerContract.questCounter();
    const questCount = Number(questCounter);

    // Get all quest details
    const quests = await Promise.all(
      Array.from({ length: questCount }, async (_, i) => {
        try {
          const quest = await questManagerContract.getQuest(i);
          return {
            id: i,
            name: quest.name,
            description: quest.description,
            rewardAmount: ethers.formatEther(quest.rewardAmount),
            badgeName: quest.badgeName,
            badgeDescription: quest.badgeDescription,
            badgeTokenURI: quest.badgeTokenURI,
            isActive: quest.isActive,
            completions: Number(quest.completions)
          };
        } catch (error) {
          console.error(`Error fetching quest ${i}:`, error);
          return null;
        }
      })
    );

    // Filter out failed requests
    const validQuests = quests.filter(quest => quest !== null);

    res.json({
      success: true,
      data: {
        quests: validQuests,
        totalQuests: questCount
      }
    });

  } catch (error) {
    console.error('Error fetching quest list:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

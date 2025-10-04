import { Request, Response } from 'express';
import { ethers } from 'ethers';
import QUEST_MANAGER_ABI from '../../artifacts/contracts/QuestManager.sol/QuestManager.json';
import { getDeployConfig } from '../utils/deploy-config.js';

export async function createQuest(req: Request, res: Response) {
  try {
    const deployRegistry = getDeployConfig();
    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: 'Contract configuration missing'
      });
    }

    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || 'https://sepolia.optimism.io';

    if (!privateKey) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration missing - no private key'
      });
    }

    const {
      name,
      description,
      rewardAmount,
      rewardType,
      badgeName,
      badgeDescription,
      badgeTokenURI
    } = req.body;

    if (!name || !description || !rewardAmount || !rewardType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, description, rewardAmount, rewardType'
      });
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(
      deployRegistry.contracts.QuestManager,
      QUEST_MANAGER_ABI.abi,
      wallet
    );

    const tx = await contract.createQuest(
      name,
      description,
      ethers.parseEther(rewardAmount.toString()),
      rewardType,
      badgeName || '',
      badgeDescription || '',
      badgeTokenURI || ''
    );

    const receipt = await tx.wait();
    
    const questId = await contract.questCounter() - BigInt(1);

    return res.json({
      success: true,
      data: {
        questId: Number(questId),
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      }
    });
  } catch (error: any) {
    console.error('Create quest error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create quest'
    });
  }
}

export async function completeQuest(req: Request, res: Response) {
  try {
    const deployRegistry = getDeployConfig();
    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: 'Contract configuration missing'
      });
    }

    const { questId } = req.params;
    const { userAddress, privateKey: userPrivateKey } = req.body;

    if (!userAddress || !userPrivateKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing userAddress or privateKey'
      });
    }

    const rpcUrl = process.env.RPC_URL || 'https://sepolia.optimism.io';
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(userPrivateKey, provider);
    const contract = new ethers.Contract(
      deployRegistry.contracts.QuestManager,
      QUEST_MANAGER_ABI.abi,
      wallet
    );

    const hasCompleted = await contract.hasCompletedQuest(userAddress, questId);
    if (hasCompleted) {
      return res.status(400).json({
        success: false,
        error: 'Quest already completed'
      });
    }

    const tx = await contract.completeQuest(questId);
    const receipt = await tx.wait();

    return res.json({
      success: true,
      data: {
        questId: Number(questId),
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        message: 'Quest completed successfully! Badge and tokens minted.'
      }
    });
  } catch (error: any) {
    console.error('Complete quest error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to complete quest'
    });
  }
}

export async function getQuestStatus(req: Request, res: Response) {
  try {
    const deployRegistry = getDeployConfig();
    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: 'Contract configuration missing'
      });
    }

    const { questId, userAddress } = req.params;

    const rpcUrl = process.env.RPC_URL || 'https://sepolia.optimism.io';
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(
      deployRegistry.contracts.QuestManager,
      QUEST_MANAGER_ABI.abi,
      provider
    );

    const [quest, hasCompleted] = await Promise.all([
      contract.getQuest(questId),
      contract.hasCompletedQuest(userAddress, questId)
    ]);

    return res.json({
      success: true,
      data: {
        questId: Number(questId),
        name: quest.name,
        description: quest.description,
        rewardAmount: ethers.formatEther(quest.rewardAmount),
        rewardType: quest.rewardType,
        isActive: quest.isActive,
        completions: Number(quest.completions),
        userCompleted: hasCompleted,
        userStatus: hasCompleted ? 'completed' : (quest.isActive ? 'available' : 'inactive')
      }
    });
  } catch (error: any) {
    console.error('Get quest status error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get quest status'
    });
  }
}

export async function getAllQuestsWithUserStatus(req: Request, res: Response) {
  try {
    const deployRegistry = getDeployConfig();
    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: 'Contract configuration missing'
      });
    }

    const { userAddress } = req.query;

    const rpcUrl = process.env.RPC_URL || 'https://sepolia.optimism.io';
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(
      deployRegistry.contracts.QuestManager,
      QUEST_MANAGER_ABI.abi,
      provider
    );

    const questCount = await contract.questCounter();
    const quests = [];

    for (let i = 0; i < questCount; i++) {
      const quest = await contract.getQuest(i);
      
      let userCompleted = false;
      if (userAddress && typeof userAddress === 'string') {
        userCompleted = await contract.hasCompletedQuest(userAddress, i);
      }

      quests.push({
        questId: i,
        name: quest.name,
        description: quest.description,
        rewardAmount: ethers.formatEther(quest.rewardAmount),
        rewardType: quest.rewardType,
        badgeName: quest.badgeName,
        badgeDescription: quest.badgeDescription,
        isActive: quest.isActive,
        completions: Number(quest.completions),
        userCompleted,
        userStatus: userCompleted ? 'completed' : (quest.isActive ? 'available' : 'inactive')
      });
    }

    return res.json({
      success: true,
      data: quests
    });
  } catch (error: any) {
    console.error('Get all quests error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get quests'
    });
  }
}

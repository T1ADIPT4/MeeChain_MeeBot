
import { Request, Response } from 'express';
import { ethers } from 'ethers';

interface MintBadgeRequest {
  to: string;
  name: string;
  description: string;
  badgeType: string;
  rarity: string;
  tokenURI: string;
  isQuestReward: boolean;
  questId: string;
}

export async function mintBadge(req: Request, res: Response) {
  try {
    const {
      to,
      name,
      description,
      badgeType,
      rarity,
      tokenURI,
      isQuestReward,
      questId
    }: MintBadgeRequest = req.body;

    // Validate required fields
    if (!to || !name || !description || badgeType === undefined || rarity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate Ethereum address
    if (!ethers.isAddress(to)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address'
      });
    }

    // Get contract instances (you'll need to implement this based on your setup)
    const badgeNFTAddress = process.env.BADGE_NFT_CONTRACT_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || 'https://rpc.fuse.io';

    if (!badgeNFTAddress || !privateKey) {
      return res.status(500).json({
        success: false,
        error: 'Contract configuration missing'
      });
    }

    // Setup provider and signer
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    // Badge contract ABI (simplified)
    const badgeABI = [
      'function mintBadge(address to, string name, string description, uint8 badgeType, uint8 rarity, string tokenURI, bool isQuestReward, string questId) returns (uint256)',
      'function authorizedMinters(address) view returns (bool)',
      'function owner() view returns (address)'
    ];

    const badgeContract = new ethers.Contract(badgeNFTAddress, badgeABI, signer);

    // Check if signer is authorized to mint
    const isAuthorized = await badgeContract.authorizedMinters(signer.address);
    const isOwner = (await badgeContract.owner()).toLowerCase() === signer.address.toLowerCase();

    if (!isAuthorized && !isOwner) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to mint badges'
      });
    }

    // Mint the badge
    const tx = await badgeContract.mintBadge(
      to,
      name,
      description,
      parseInt(badgeType),
      parseInt(rarity),
      tokenURI || '',
      isQuestReward || false,
      questId || ''
    );

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    // Extract token ID from events
    const mintEvent = receipt.logs.find((log: any) => {
      try {
        const parsed = badgeContract.interface.parseLog(log);
        return parsed?.name === 'BadgeMinted';
      } catch {
        return false;
      }
    });

    let tokenId = null;
    if (mintEvent) {
      const parsed = badgeContract.interface.parseLog(mintEvent);
      tokenId = parsed?.args?.tokenId?.toString();
    }

    res.json({
      success: true,
      data: {
        transactionHash: tx.hash,
        tokenId,
        to,
        name,
        description,
        badgeType: parseInt(badgeType),
        rarity: parseInt(rarity)
      }
    });

  } catch (error) {
    console.error('Error minting badge:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

export async function getBadgesByUser(req: Request, res: Response) {
  try {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address'
      });
    }

    const badgeNFTAddress = process.env.BADGE_NFT_CONTRACT_ADDRESS;
    const rpcUrl = process.env.RPC_URL || 'https://rpc.fuse.io';

    if (!badgeNFTAddress) {
      return res.status(500).json({
        success: false,
        error: 'Contract configuration missing'
      });
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    const badgeABI = [
      'function getUserBadges(address user) view returns (uint256[])',
      'function badges(uint256 tokenId) view returns (tuple(uint256 tokenId, string name, string description, uint8 badgeType, uint8 rarity, uint256 mintedAt, address originalMinter, bool isQuestReward, string questId))'
    ];

    const badgeContract = new ethers.Contract(badgeNFTAddress, badgeABI, provider);

    // Get user's badge token IDs
    const tokenIds = await badgeContract.getUserBadges(address);

    // Get badge details for each token ID
    const badges = await Promise.all(
      tokenIds.map(async (tokenId: bigint) => {
        const badge = await badgeContract.badges(tokenId);
        return {
          tokenId: tokenId.toString(),
          name: badge.name,
          description: badge.description,
          badgeType: badge.badgeType,
          rarity: badge.rarity,
          mintedAt: new Date(Number(badge.mintedAt) * 1000).toISOString(),
          originalMinter: badge.originalMinter,
          isQuestReward: badge.isQuestReward,
          questId: badge.questId
        };
      })
    );

    res.json({
      success: true,
      data: {
        address,
        badges,
        count: badges.length
      }
    });

  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

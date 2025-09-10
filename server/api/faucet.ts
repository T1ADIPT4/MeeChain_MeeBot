
import { Request, Response } from 'express';
import { ethers } from 'ethers';

interface FaucetRequest {
  userId: string;
  chain: string;
  walletAddress: string;
  token: string;
}

// In-memory storage (replace with database in production)
const faucetRequests = new Map<string, { lastRequest: Date; count: number }>();

// Rate limiting: 1 request per 24 hours per user
const RATE_LIMIT_HOURS = 24;
const MAX_REQUESTS_PER_DAY = 1;

// Faucet amounts by token
const FAUCET_AMOUNTS = {
  'ETH': '0.01',
  'FUSE': '1.0',
  'MEE': '100',
  'CUSTOM': '5'
};

export const requestFaucet = async (req: Request, res: Response) => {
  try {
    const { userId, chain, walletAddress, token }: FaucetRequest = req.body;

    if (!userId || !walletAddress || !token) {
      return res.status(400).json({
        error: 'MISSING_FIELDS',
        message: 'userId, walletAddress, and token are required'
      });
    }

    // Validate wallet address
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        error: 'INVALID_ADDRESS',
        message: 'Invalid wallet address format'
      });
    }

    // Check rate limiting
    const userKey = `${userId}_${token}`;
    const userRequests = faucetRequests.get(userKey);
    const now = new Date();

    if (userRequests) {
      const hoursSinceLastRequest = (now.getTime() - userRequests.lastRequest.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastRequest < RATE_LIMIT_HOURS) {
        const nextAvailable = new Date(userRequests.lastRequest.getTime() + (RATE_LIMIT_HOURS * 60 * 60 * 1000));
        return res.status(429).json({
          error: 'RATE_LIMITED',
          message: 'Faucet request too frequent. Try again in 24 hours.',
          nextAvailable: nextAvailable.toISOString()
        });
      }
    }

    // Get faucet amount
    const amount = FAUCET_AMOUNTS[token as keyof typeof FAUCET_AMOUNTS];
    if (!amount) {
      return res.status(400).json({
        error: 'UNSUPPORTED_TOKEN',
        message: `Token ${token} is not supported by faucet`
      });
    }

    // Update rate limiting storage
    faucetRequests.set(userKey, {
      lastRequest: now,
      count: (userRequests?.count || 0) + 1
    });

    // Calculate next available time
    const nextAvailable = new Date(now.getTime() + (RATE_LIMIT_HOURS * 60 * 60 * 1000));

    // TODO: Implement actual token transfer logic here
    // This would integrate with your smart contract or faucet service

    res.json({
      status: 'success',
      amount,
      token,
      nextAvailable: nextAvailable.toISOString(),
      message: `${amount} ${token} sent to ${walletAddress}`
    });

  } catch (error) {
    console.error('Faucet request error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to process faucet request'
    });
  }
};

export const getFaucetStatus = async (req: Request, res: Response) => {
  try {
    const { userId, token = 'ETH' } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: 'MISSING_USER_ID',
        message: 'userId parameter is required'
      });
    }

    const userKey = `${userId}_${token}`;
    const userRequests = faucetRequests.get(userKey);
    const now = new Date();

    if (!userRequests) {
      return res.json({
        eligible: true,
        lastRequest: null,
        nextAvailable: now.toISOString()
      });
    }

    const hoursSinceLastRequest = (now.getTime() - userRequests.lastRequest.getTime()) / (1000 * 60 * 60);
    const eligible = hoursSinceLastRequest >= RATE_LIMIT_HOURS;
    const nextAvailable = eligible 
      ? now.toISOString()
      : new Date(userRequests.lastRequest.getTime() + (RATE_LIMIT_HOURS * 60 * 60 * 1000)).toISOString();

    res.json({
      eligible,
      lastRequest: userRequests.lastRequest.toISOString(),
      nextAvailable,
      requestCount: userRequests.count
    });

  } catch (error) {
    console.error('Faucet status error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to get faucet status'
    });
  }
};

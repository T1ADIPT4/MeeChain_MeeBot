import { Request, Response } from 'express';

interface UserTierData {
  tier: string;
  level: number;
  progress: {
    missionsCompleted: number;
    required: number;
    tokensEarned: number;
    referrals: number;
  };
  rewardsUnlocked: string[];
  lastUpdate: string;
}

interface TierBenefit {
  tier: string;
  level: number;
  benefits: string[];
  requirements: {
    missionsCompleted: number;
    tokensEarned: number;
    referrals: number;
  };
}

// Mock user tier data
const userTiers = new Map<string, UserTierData>();

// Tier system configuration
const TIER_BENEFITS: TierBenefit[] = [
  {
    tier: 'Beginner',
    level: 1,
    benefits: ['เหรียญทดลอง', 'ภารกิจพื้นฐาน', 'การเรียนรู้ Web3'],
    requirements: { missionsCompleted: 0, tokensEarned: 0, referrals: 0 }
  },
  {
    tier: 'Explorer',
    level: 2,
    benefits: ['เครดิต gas ฟรี', 'Badge NFT', 'ภารกิจพิเศษ', 'Discord VIP'],
    requirements: { missionsCompleted: 5, tokensEarned: 100, referrals: 1 }
  },
  {
    tier: 'Pro',
    level: 3,
    benefits: ['Swap ข้ามเชนฟรี', 'NFT พิเศษ', 'Early access', 'Governance voting'],
    requirements: { missionsCompleted: 15, tokensEarned: 500, referrals: 3 }
  },
  {
    tier: 'Expert',
    level: 4,
    benefits: ['Premium support', 'Beta features', 'Exclusive events', 'Custom NFT'],
    requirements: { missionsCompleted: 30, tokensEarned: 1000, referrals: 5 }
  },
  {
    tier: 'Legend',
    level: 5,
    benefits: ['All features', 'Partnership opportunities', 'Revenue sharing', 'Advisory role'],
    requirements: { missionsCompleted: 50, tokensEarned: 2500, referrals: 10 }
  }
];

// Initialize mock data
const initializeMockTierData = () => {
  userTiers.set('user_123', {
    tier: 'Explorer',
    level: 2,
    progress: {
      missionsCompleted: 8,
      required: 15,
      tokensEarned: 250,
      referrals: 2
    },
    rewardsUnlocked: ['เครดิต gas ฟรี', 'Badge NFT', 'ภารกิจพิเศษ'],
    lastUpdate: new Date().toISOString()
  });
};

initializeMockTierData();

const calculateTier = (missionsCompleted: number, tokensEarned: number, referrals: number): TierBenefit => {
  let currentTier = TIER_BENEFITS[0]; // Default to Beginner

  for (const tier of TIER_BENEFITS) {
    const meetsRequirements = (
      missionsCompleted >= tier.requirements.missionsCompleted &&
      tokensEarned >= tier.requirements.tokensEarned &&
      referrals >= tier.requirements.referrals
    );

    if (meetsRequirements) {
      currentTier = tier;
    } else {
      break;
    }
  }

  return currentTier;
};

const getNextTier = (currentLevel: number): TierBenefit | null => {
  return TIER_BENEFITS.find(tier => tier.level === currentLevel + 1) || null;
};

export const getUserTierStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: 'MISSING_USER_ID',
        message: 'userId parameter is required'
      });
    }

    let userData = userTiers.get(userId as string);

    if (!userData) {
      // Initialize new user with Beginner tier
      userData = {
        tier: 'Beginner',
        level: 1,
        progress: {
          missionsCompleted: 0,
          required: 5,
          tokensEarned: 0,
          referrals: 0
        },
        rewardsUnlocked: ['เหรียญทดลอง', 'ภารกิจพื้นฐาน'],
        lastUpdate: new Date().toISOString()
      };
      userTiers.set(userId as string, userData);
    }

    const nextTier = getNextTier(userData.level);
    const progressToNext = nextTier ? {
      missionsCompleted: userData.progress.missionsCompleted,
      required: nextTier.requirements.missionsCompleted,
      tokensEarned: userData.progress.tokensEarned,
      tokensRequired: nextTier.requirements.tokensEarned,
      referrals: userData.progress.referrals,
      referralsRequired: nextTier.requirements.referrals
    } : null;

    res.json({
      tier: userData.tier,
      level: userData.level,
      nextTier: nextTier?.tier || null,
      progress: progressToNext || userData.progress,
      rewardsUnlocked: userData.rewardsUnlocked,
      progressPercentage: nextTier ? Math.min(
        100,
        Math.max(
          (userData.progress.missionsCompleted / nextTier.requirements.missionsCompleted) * 100,
          (userData.progress.tokensEarned / nextTier.requirements.tokensEarned) * 100,
          (userData.progress.referrals / nextTier.requirements.referrals) * 100
        )
      ) : 100
    });

  } catch (error) {
    console.error('User tier status error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to get user tier status'
    });
  }
};

export const getTierBenefits = async (req: Request, res: Response) => {
  try {
    res.json(TIER_BENEFITS.map(tier => ({
      tier: tier.tier,
      level: tier.level,
      benefits: tier.benefits,
      requirements: tier.requirements
    })));
  } catch (error) {
    console.error('Tier benefits error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to get tier benefits'
    });
  }
};

export const updateUserTier = async (req: Request, res: Response) => {
  try {
    const { userId, missionsCompleted, tokensEarned, referrals, newTier } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'MISSING_USER_ID',
        message: 'userId is required'
      });
    }

    let userData = userTiers.get(userId) || {
      tier: 'Beginner',
      level: 1,
      progress: {
        missionsCompleted: 0,
        required: 5,
        tokensEarned: 0,
        referrals: 0
      },
      rewardsUnlocked: ['เหรียญทดลอง', 'ภารกิจพื้นฐาน'],
      lastUpdate: new Date().toISOString()
    };

    // Update progress if provided
    if (typeof missionsCompleted === 'number') {
      userData.progress.missionsCompleted = missionsCompleted;
    }
    if (typeof tokensEarned === 'number') {
      userData.progress.tokensEarned = tokensEarned;
    }
    if (typeof referrals === 'number') {
      userData.progress.referrals = referrals;
    }

    // Calculate new tier based on progress
    const calculatedTier = calculateTier(
      userData.progress.missionsCompleted,
      userData.progress.tokensEarned,
      userData.progress.referrals
    );

    // Use provided tier if it's valid, otherwise use calculated tier
    const targetTierData = newTier 
      ? TIER_BENEFITS.find(t => t.tier === newTier) 
      : calculatedTier;

    if (!targetTierData) {
      return res.status(400).json({
        error: 'INVALID_TIER',
        message: 'Invalid tier specified'
      });
    }

    const oldTier = userData.tier;
    const tierUpgraded = targetTierData.level > userData.level;

    // Update user tier data
    userData.tier = targetTierData.tier;
    userData.level = targetTierData.level;
    userData.rewardsUnlocked = targetTierData.benefits;
    userData.lastUpdate = new Date().toISOString();

    // Update next tier requirements
    const nextTier = getNextTier(userData.level);
    if (nextTier) {
      userData.progress.required = nextTier.requirements.missionsCompleted;
    }

    userTiers.set(userId, userData);

    const response: any = {
      status: tierUpgraded ? 'upgraded' : 'updated',
      tier: userData.tier,
      level: userData.level,
      oldTier,
      rewardsGranted: tierUpgraded ? targetTierData.benefits : [],
      progress: userData.progress
    };

    if (tierUpgraded) {
      response.message = `🎉 ยินดีด้วย! คุณได้เลื่อนขึ้นเป็น ${userData.tier} แล้ว!`;
    }

    res.json(response);

  } catch (error) {
    console.error('Update user tier error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to update user tier'
    });
  }
};
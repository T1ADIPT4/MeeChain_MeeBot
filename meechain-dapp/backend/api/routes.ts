import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertWalletSchema, insertOnboardingProgressSchema,
  insertTokenSchema, insertUserMissionSchema 
} from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/social", async (req, res) => {
    try {
      const { provider, socialId, email, firstName, lastName, profileImageUrl } = req.body;

      if (!provider || !socialId) {
        return res.status(400).json({ message: "Provider and social ID are required" });
      }

      // Check if user exists
      let user = await storage.getUserBySocialId(socialId, provider);

      if (!user) {
        // Create new user
        const userData = insertUserSchema.parse({
          socialId,
          provider,
          email,
          firstName,
          lastName,
          profileImageUrl,
        });
        user = await storage.createUser(userData);

        // Create initial onboarding progress
        await storage.createOnboardingProgress({
          userId: user.id,
          currentStep: "1",
          completedSteps: [],
          isCompleted: false,
          firstMissionCompleted: false,
        });
      }

      res.json({ user });
    } catch (error) {
      console.error("Social auth error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Onboarding endpoints
  app.get("/api/onboarding/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getOnboardingProgress(userId);

      if (!progress) {
        return res.status(404).json({ message: "Onboarding progress not found" });
      }

      res.json(progress);
    } catch (error) {
      console.error("Get onboarding progress error:", error);
      res.status(500).json({ message: "Failed to get onboarding progress" });
    }
  });

  app.put("/api/onboarding/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;

      const progress = await storage.updateOnboardingProgress(userId, updates);

      if (!progress) {
        return res.status(404).json({ message: "Onboarding progress not found" });
      }

      res.json(progress);
    } catch (error) {
      console.error("Update onboarding progress error:", error);
      res.status(500).json({ message: "Failed to update onboarding progress" });
    }
  });

  // Wallet endpoints
  app.post("/api/wallet/create", async (req, res) => {
    try {
      const { userId, biometricEnabled, pinHash } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Check if wallet already exists
      const existingWallet = await storage.getWalletByUserId(userId);
      if (existingWallet) {
        return res.json({ wallet: existingWallet });
      }

      // Get security settings from onboarding progress
      const progress = await storage.getOnboardingProgress(userId);
      const completedSteps = (progress?.completedSteps as string[]) || [];
      const hasPinStep = completedSteps.includes("pin");
      const hasBiometricStep = completedSteps.includes("biometric");

      // Generate a mock wallet address (in real implementation, this would call smart contract)
      const address = `0x${crypto.randomBytes(20).toString('hex')}`;

      const walletData = insertWalletSchema.parse({
        userId,
        address,
        type: "smart",
        biometricEnabled: biometricEnabled || hasBiometricStep,
        pinHash: pinHash || (hasPinStep ? "temp_pin_hash" : null),
      });

      const wallet = await storage.createWallet(walletData);
      res.json({ wallet });
    } catch (error) {
      console.error("Create wallet error:", error);
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });

  app.get("/api/wallet/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const wallet = await storage.getWalletByUserId(userId);

      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      res.json({ wallet });
    } catch (error) {
      console.error("Get wallet error:", error);
      res.status(500).json({ message: "Failed to get wallet" });
    }
  });

  // Security endpoints
  app.post("/api/security/pin", async (req, res) => {
    try {
      const { userId, pin } = req.body;

      if (!userId || !pin || pin.length !== 6) {
        return res.status(400).json({ message: "User ID and 6-digit PIN are required" });
      }

      // Hash the PIN (in real implementation, use proper bcrypt)
      const pinHash = crypto.createHash('sha256').update(pin).digest('hex');

      // Try to update existing wallet, or store PIN in onboarding progress
      const wallet = await storage.getWalletByUserId(userId);
      if (wallet) {
        await storage.updateWallet(wallet.id, { pinHash });
      } else {
        // Store PIN hash in onboarding progress for later use
        const progress = await storage.getOnboardingProgress(userId);
        if (progress) {
          await storage.updateOnboardingProgress(userId, { 
            completedSteps: [...(progress.completedSteps as string[] || []), "pin"],
          });
        }
      }

      res.json({ success: true, pinHash });
    } catch (error) {
      console.error("Set PIN error:", error);
      res.status(500).json({ message: "Failed to set PIN" });
    }
  });

  app.post("/api/security/biometric", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Try to update existing wallet, or store biometric setting in onboarding progress
      const wallet = await storage.getWalletByUserId(userId);
      if (wallet) {
        await storage.updateWallet(wallet.id, { biometricEnabled: true });
      } else {
        // Store biometric setting in onboarding progress for later use
        const progress = await storage.getOnboardingProgress(userId);
        if (progress) {
          await storage.updateOnboardingProgress(userId, { 
            completedSteps: [...(progress.completedSteps as string[] || []), "biometric"],
          });
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Enable biometric error:", error);
      res.status(500).json({ message: "Failed to enable biometric" });
    }
  });

  // Mission endpoints (legacy - for onboarding compatibility)
  app.post("/api/mission/complete", async (req, res) => {
    try {
      const { userId, missionId = "create_wallet" } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Mark first mission as completed in onboarding progress
      if (missionId === "first" || missionId === "create_wallet") {
        await storage.updateOnboardingProgress(userId, { 
          firstMissionCompleted: true 
        });

        // Complete the create_wallet mission using new system
        const mission = await storage.getMission("create_wallet");
        if (mission) {
          let userMission = await storage.getUserMission(userId, "create_wallet");

          if (!userMission) {
            userMission = await storage.createUserMission({
              userId,
              missionId: "create_wallet",
              status: "completed",
              completedAt: new Date(),
              proof: { source: "onboarding" },
            });

            // Grant reward automatically
            if (mission.rewardTokenId) {
              const rewardAmount = mission.rewardAmount + "000000000000000000"; // Add 18 decimals
              const currentBalance = await storage.getUserTokenBalance(userId, mission.rewardTokenId);

              await storage.updateUserTokenBalance(userId, mission.rewardTokenId, {
                balance: (BigInt(currentBalance?.balance ?? "0") + BigInt(rewardAmount)).toString(),
                totalEarned: (BigInt(currentBalance?.totalEarned ?? "0") + BigInt(rewardAmount)).toString(),
              });
            }
          }
        }
      }

      res.json({ 
        success: true, 
        reward: { amount: 100, token: "MEE" } 
      });
    } catch (error) {
      console.error("Complete mission error:", error);
      res.status(500).json({ message: "Failed to complete mission" });
    }
  });

  // Token endpoints
  app.get("/api/tokens", async (req, res) => {
    try {
      const tokens = await storage.getTokens();
      res.json(tokens);
    } catch (error) {
      console.error("Get tokens error:", error);
      res.status(500).json({ message: "Failed to get tokens" });
    }
  });

  app.get("/api/tokens/:address/:chainId", async (req, res) => {
    try {
      const { address, chainId } = req.params;
      const token = await storage.getTokenByAddress(address, chainId);

      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }

      res.json(token);
    } catch (error) {
      console.error("Get token by address error:", error);
      res.status(500).json({ message: "Failed to get token" });
    }
  });

  // Faucet endpoints
  app.post("/api/faucet/request", async (req, res) => {
    try {
      const { userId, chain, walletAddress, token } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // For backward compatibility, also accept old format
      const tokenAddress = req.body.tokenAddress;
      const chainId = req.body.chainId || chain;

      // Find token
      const token = await storage.getTokenByAddress(tokenAddress, chainId);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }

      // Check faucet cooldown (24 hours)
      const userBalance = await storage.getUserTokenBalance(userId, token.id);
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      if (userBalance?.lastFaucetClaim && new Date(userBalance.lastFaucetClaim) > oneDayAgo) {
        const timeRemaining = new Date(userBalance.lastFaucetClaim).getTime() + 24 * 60 * 60 * 1000 - now.getTime();
        return res.status(429).json({ 
          message: "Faucet cooldown active", 
          timeRemaining: Math.ceil(timeRemaining / 1000) // seconds
        });
      }

      // Grant faucet tokens (5 tokens for demo)
      const faucetAmount = "5000000000000000000"; // 5 tokens with 18 decimals
      const currentBalance = userBalance?.balance ?? "0";
      const newBalance = (BigInt(currentBalance) + BigInt(faucetAmount)).toString();

      await storage.updateUserTokenBalance(userId, token.id, {
        balance: newBalance,
        lastFaucetClaim: now,
        totalEarned: (BigInt(userBalance?.totalEarned ?? "0") + BigInt(faucetAmount)).toString(),
      });

      res.json({ 
        status: "success",
        amount: "5",
        token: token.symbol,
        nextAvailable: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      console.error("Faucet request error:", error);
      res.status(500).json({ message: "Faucet request failed" });
    }
  });

  app.get("/api/faucet/status", async (req, res) => {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Get user's last faucet claim from any token
      const balances = await storage.getAllUserTokenBalances(userId);
      let lastRequest = null;
      let nextAvailable = new Date().toISOString();
      let eligible = true;

      for (const balance of balances) {
        if (balance.lastFaucetClaim) {
          const claimTime = new Date(balance.lastFaucetClaim);
          const oneDayLater = new Date(claimTime.getTime() + 24 * 60 * 60 * 1000);

          if (!lastRequest || claimTime > new Date(lastRequest)) {
            lastRequest = claimTime.toISOString();
            nextAvailable = oneDayLater.toISOString();
            eligible = new Date() >= oneDayLater;
          }
        }
      }

      res.json({
        eligible,
        lastRequest,
        nextAvailable
      });
    } catch (error) {
      console.error("Get faucet status error:", error);
      res.status(500).json({ message: "Failed to get faucet status" });
    }
  });

  // User balance endpoints
  app.get("/api/balances/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const balances = await storage.getUserTokenBalances(userId);

      // Include token details
      const balancesWithTokens = await Promise.all(
        balances.map(async (balance) => {
          const tokens = await storage.getTokens();
          const token = tokens.find(t => t.id === balance.tokenId);
          return {
            ...balance,
            token,
          };
        })
      );

      res.json(balancesWithTokens);
    } catch (error) {
      console.error("Get user balances error:", error);
      res.status(500).json({ message: "Failed to get user balances" });
    }
  });

  // Enhanced Mission endpoints
  app.get("/api/missions/list", async (req, res) => {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const missions = await storage.getMissions();
      const userMissions = await storage.getUserMissions(userId as string);

      // Combine mission data with user progress
      const missionList = await Promise.all(
        missions.map(async (mission) => {
          const userMission = userMissions.find(um => um.missionId === mission.id);
          let rewardToken = null;

          if (mission.rewardTokenId) {
            const tokens = await storage.getTokens();
            rewardToken = tokens.find(t => t.id === mission.rewardTokenId);
          }

          return {
            missionId: mission.id,
            title: mission.title,
            description: mission.description,
            status: userMission?.status ?? "pending",
            reward: {
              type: mission.rewardType,
              amount: mission.rewardAmount,
              token: rewardToken?.symbol ?? null,
            },
            completedAt: userMission?.completedAt,
            claimedAt: userMission?.claimedAt,
          };
        })
      );

      res.json(missionList);
    } catch (error) {
      console.error("Get missions list error:", error);
      res.status(500).json({ message: "Failed to get missions list" });
    }
  });

  app.post("/api/missions/complete", async (req, res) => {
    try {
      const { userId, missionId, proof } = req.body;

      if (!userId || !missionId) {
        return res.status(400).json({ message: "User ID and mission ID are required" });
      }

      // Check if mission exists
      const mission = await storage.getMission(missionId);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }

      // Check if user already has this mission
      let userMission = await storage.getUserMission(userId, missionId);

      if (!userMission) {
        // Create new user mission
        userMission = await storage.createUserMission({
          userId,
          missionId,
          status: "completed",
          completedAt: new Date(),
          proof,
        });
      } else {
        // Update existing mission
        userMission = await storage.updateUserMission(userMission.id, {
          status: "completed",
          completedAt: new Date(),
          proof,
        });
      }

      // Grant reward
      let rewardGranted = null;
      if (mission.rewardType === "token" && mission.rewardTokenId) {
        const rewardAmount = mission.rewardAmount + "000000000000000000"; // Add 18 decimals
        const currentBalance = await storage.getUserTokenBalance(userId, mission.rewardTokenId);

        await storage.updateUserTokenBalance(userId, mission.rewardTokenId, {
          balance: (BigInt(currentBalance?.balance ?? "0") + BigInt(rewardAmount)).toString(),
          totalEarned: (BigInt(currentBalance?.totalEarned ?? "0") + BigInt(rewardAmount)).toString(),
        });

        const tokens = await storage.getTokens();
        const rewardToken = tokens.find(t => t.id === mission.rewardTokenId);

        rewardGranted = {
          type: mission.rewardType,
          amount: mission.rewardAmount,
          token: rewardToken?.symbol ?? "TOKEN",
        };
      }

      res.json({ 
        status: "success", 
        rewardGranted,
        userMission 
      });
    } catch (error) {
      console.error("Complete mission error:", error);
      res.status(500).json({ message: "Failed to complete mission" });
    }
  });

  app.post("/api/missions/claim", async (req, res) => {
    try {
      const { userId, missionId } = req.body;

      if (!userId || !missionId) {
        return res.status(400).json({ message: "User ID and mission ID are required" });
      }

      const userMission = await storage.getUserMission(userId, missionId);
      if (!userMission) {
        return res.status(404).json({ message: "User mission not found" });
      }

      if (userMission.status !== "completed") {
        return res.status(400).json({ message: "Mission not completed yet" });
      }

      if (userMission.claimedAt) {
        return res.status(400).json({ message: "Reward already claimed" });
      }

      // Mark as claimed
      const updatedMission = await storage.updateUserMission(userMission.id, {
        status: "claimed",
        claimedAt: new Date(),
      });

      const mission = await storage.getMission(missionId);
      let reward = null;

      if (mission?.rewardTokenId) {
        const tokens = await storage.getTokens();
        const rewardToken = tokens.find(t => t.id === mission.rewardTokenId);
        reward = {
          type: mission.rewardType,
          amount: mission.rewardAmount,
          token: rewardToken?.symbol ?? "TOKEN",
        };
      }

      res.json({ 
        status: "claimed", 
        reward,
        userMission: updatedMission 
      });
    } catch (error) {
      console.error("Claim mission reward error:", error);
      res.status(500).json({ message: "Failed to claim mission reward" });
    }
  });

  // Wallet API endpoints
  app.get("/api/wallet/me", async (req, res) => {
    try {
      const userId = req.session?.userId || req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const wallet = await storage.getWalletByUserId(userId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      res.json(wallet);
    } catch (error) {
      console.error("Get wallet error:", error);
      res.status(500).json({ message: "Failed to get wallet" });
    }
  });

  app.get("/api/wallet/balances", async (req, res) => {
    try {
      const userId = req.session?.userId || req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get all user token balances
      const balances = await storage.getAllUserTokenBalances(userId);

      // Get token details and combine with balances
      const tokens = await Promise.all(
        balances.map(async (balance) => {
          const token = await storage.getTokenById(balance.tokenId);
          return {
            ...token,
            balance: balance.balance,
            totalEarned: balance.totalEarned || "0",
            lastFaucetClaim: balance.lastFaucetClaim
          };
        })
      );

      res.json({ tokens });
    } catch (error) {
      console.error("Get balances error:", error);
      res.status(500).json({ message: "Failed to get balances" });
    }
  });

  // Transaction history endpoint
  app.get("/api/wallet/transactions", async (req, res) => {
    try {
      const userId = req.session?.userId || req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // For now, return mock transaction history
      const transactions = [
        {
          id: "tx_1",
          type: "receive",
          amount: "5.0",
          token: "MEE",
          from: "Faucet",
          to: "You",
          status: "completed",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          hash: "0x123...abc"
        },
        {
          id: "tx_2", 
          type: "receive",
          amount: "100.0",
          token: "MEE",
          from: "Mission Reward",
          to: "You",
          status: "completed",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          hash: "0x456...def"
        }
      ];

      res.json({ transactions });
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  // Earnings API endpoints
  app.get("/api/earnings/summary", async (req, res) => {
    try {
      const userId = req.session?.userId || req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get user's total token balances as earnings
      const balances = await storage.getAllUserTokenBalances(userId);
      const tokens = await storage.getTokens();

      const total: Record<string, string> = {};
      const today: Record<string, string> = {};

      for (const balance of balances) {
        const token = tokens.find(t => t.id === balance.tokenId);
        if (token) {
          const totalEarned = parseFloat(balance.totalEarned || "0") / Math.pow(10, parseInt(token.decimals));
          total[token.symbol] = totalEarned.toFixed(4);

          // Mock today's earnings (20% of total for demo)
          const todayEarned = totalEarned * 0.2;
          today[token.symbol] = todayEarned.toFixed(4);
        }
      }

      res.json({ total, today });
    } catch (error) {
      console.error("Get earnings summary error:", error);
      res.status(500).json({ message: "Failed to get earnings summary" });
    }
  });

  app.get("/api/earnings/history", async (req, res) => {
    try {
      const userId = req.session?.userId || req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get user missions as earning activities
      const userMissions = await storage.getUserMissions(userId);
      const missions = await storage.getMissions();
      const tokens = await storage.getTokens();

      const history = await Promise.all(
        userMissions
          .filter(um => um.status === "completed" || um.status === "claimed")
          .map(async (userMission) => {
            const mission = missions.find(m => m.id === userMission.missionId);
            let token = null;

            if (mission?.rewardTokenId) {
              token = tokens.find(t => t.id === mission.rewardTokenId);
            }

            return {
              date: userMission.completedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
              activity: mission?.title || "ภารกิจ",
              amount: mission?.rewardAmount || "0",
              token: token?.symbol || "MEE",
              status: userMission.status
            };
          })
      );

      // Add mock faucet activities
      const mockFaucetHistory = [
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          activity: "รับเหรียญจาก Faucet",
          amount: "5",
          token: "MEE",
          status: "completed"
        }
      ];

      res.json([...history, ...mockFaucetHistory]);
    } catch (error) {
      console.error("Get earnings history error:", error);
      res.status(500).json({ message: "Failed to get earnings history" });
    }
  });

  app.post("/api/earnings/transfer", async (req, res) => {
    try {
      const { userId, walletAddress, token, amount } = req.body;

      if (!userId || !walletAddress || !token || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Mock transfer (in real implementation, this would call smart contract)
      const mockTxHash = `0x${crypto.randomBytes(32).toString('hex')}`;

      res.json({
        status: "success",
        txHash: mockTxHash
      });
    } catch (error) {
      console.error("Transfer earnings error:", error);
      res.status(500).json({ message: "Failed to transfer earnings" });
    }
  });

  // Registry status endpoint
  app.get("/api/registry-status", async (req, res) => {
    try {
      const { getRegistryStatus } = await import("../../server/api/registry-status");
      return await getRegistryStatus(req, res);
    } catch (error) {
      console.error("Registry status error:", error);
      res.status(500).json({ message: "Failed to get registry status" });
    }
  });

  // User Tier API endpoints
  app.get("/api/user-tier/status", async (req, res) => {
    try {
      const userId = req.session?.userId || req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get user's completed missions to calculate tier
      const userMissions = await storage.getUserMissions(userId);
      const completedMissions = userMissions.filter(um => um.status === "completed" || um.status === "claimed").length;

      let tier = "Beginner";
      let nextTier = "Explorer";
      let required = 3;
      let rewardsUnlocked = ["เหรียญทดลอง", "ภารกิจพื้นฐาน"];

      if (completedMissions >= 3) {
        tier = "Explorer";
        nextTier = "Pro";
        required = 5;
        rewardsUnlocked = ["เครดิต gas ฟรี", "Badge NFT"];
      }

      if (completedMissions >= 5) {
        tier = "Pro";
        nextTier = "Master";
        required = 10;
        rewardsUnlocked = ["Swap ข้ามเชนฟรี", "NFT พิเศษ"];
      }

      res.json({
        tier,
        nextTier,
        progress: {
          missionsCompleted: completedMissions,
          required
        },
        rewardsUnlocked
      });
    } catch (error) {
      console.error("Get user tier status error:", error);
      res.status(500).json({ message: "Failed to get user tier status" });
    }
  });

  app.get("/api/user-tier/benefits", async (req, res) => {
    try {
      const benefits = [
        { tier: "Beginner", benefits: ["เหรียญทดลอง", "ภารกิจพื้นฐาน"] },
        { tier: "Explorer", benefits: ["เครดิต gas ฟรี", "Badge NFT"] },
        { tier: "Pro", benefits: ["Swap ข้ามเชนฟรี", "NFT พิเศษ"] },
        { tier: "Master", benefits: ["รางวัลพิเศษ", "เข้าถึงฟีเจอร์ VIP"] }
      ];

      res.json(benefits);
    } catch (error) {
      console.error("Get tier benefits error:", error);
      res.status(500).json({ message: "Failed to get tier benefits" });
    }
  });

  app.post("/api/user-tier/update", async (req, res) => {
    try {
      const { userId, newTier } = req.body;

      if (!userId || !newTier) {
        return res.status(400).json({ message: "User ID and new tier are required" });
      }

      // Get rewards for the new tier
      const tierRewards: Record<string, string[]> = {
        "Explorer": ["เครดิต gas ฟรี", "Badge NFT"],
        "Pro": ["Swap ข้ามเชนฟรี", "NFT พิเศษ"],
        "Master": ["รางวัลพิเศษ", "เข้าถึงฟีเจอร์ VIP"]
      };

      const rewardsGranted = tierRewards[newTier] || [];

      res.json({
        status: "updated",
        tier: newTier,
        rewardsGranted
      });
    } catch (error) {
      console.error("Update user tier error:", error);
      res.status(500).json({ message: "Failed to update user tier" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
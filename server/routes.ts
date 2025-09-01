import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWalletSchema, insertOnboardingProgressSchema } from "@shared/schema";
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

  // Mission endpoints
  app.post("/api/mission/complete", async (req, res) => {
    try {
      const { userId, missionId } = req.body;
      
      if (!userId || !missionId) {
        return res.status(400).json({ message: "User ID and mission ID are required" });
      }

      // For now, just mark first mission as completed
      if (missionId === "first") {
        await storage.updateOnboardingProgress(userId, { 
          firstMissionCompleted: true 
        });
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

  const httpServer = createServer(app);
  return httpServer;
}

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/utils/secrets-checker.ts
var secrets_checker_exports = {};
__export(secrets_checker_exports, {
  OPTIONAL_SECRETS: () => OPTIONAL_SECRETS,
  REQUIRED_SECRETS: () => REQUIRED_SECRETS,
  checkSecrets: () => checkSecrets,
  getSecretsStatusMessage: () => getSecretsStatusMessage
});
function checkSecrets() {
  const missing = REQUIRED_SECRETS.filter((key) => !process.env[key]);
  const warnings = OPTIONAL_SECRETS.filter((key) => !process.env[key]);
  let status = "healthy";
  if (missing.length > 0) {
    status = "critical";
  } else if (warnings.length > 0) {
    status = "warning";
  }
  return {
    ok: missing.length === 0,
    missing,
    warnings,
    status
  };
}
function getSecretsStatusMessage(result) {
  if (result.status === "healthy") {
    return "\u{1F389} \u0E23\u0E30\u0E1A\u0E1A\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E25\u0E38\u0E22! Secrets \u0E04\u0E23\u0E1A\u0E16\u0E49\u0E27\u0E19\u0E17\u0E38\u0E01\u0E15\u0E31\u0E27";
  } else if (result.status === "warning") {
    return `\u26A0\uFE0F \u0E1E\u0E1A ${result.warnings.length} optional secrets \u0E17\u0E35\u0E48\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32`;
  } else {
    return `\u{1F6A8} \u0E1E\u0E1A\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E40\u0E23\u0E48\u0E07\u0E14\u0E48\u0E27\u0E19! \u0E02\u0E32\u0E14 ${result.missing.length} secrets \u0E2A\u0E33\u0E04\u0E31\u0E0D`;
  }
}
var REQUIRED_SECRETS, OPTIONAL_SECRETS;
var init_secrets_checker = __esm({
  "server/utils/secrets-checker.ts"() {
    "use strict";
    REQUIRED_SECRETS = [
      "VITE_TOKEN_CONTRACT_ADDRESS",
      "VITE_NFT_CONTRACT_ADDRESS",
      "VITE_FUSE_RPC_URL",
      "VITE_CHAIN_ID",
      "DATABASE_URL",
      "NODE_ENV"
    ];
    OPTIONAL_SECRETS = [
      "VITE_CUSTOM_TOKEN_ADDRESS",
      "PINATA_API_KEY",
      "PINATA_SECRET_KEY",
      "SESSION_SECRET"
    ];
  }
});

// server/api/badge-mint.ts
var badge_mint_exports = {};
__export(badge_mint_exports, {
  getBadgesByUser: () => getBadgesByUser,
  mintBadge: () => mintBadge
});
import { ethers as ethers2 } from "ethers";
async function mintBadge(req, res) {
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
    } = req.body;
    if (!to || !name || !description || badgeType === void 0 || rarity === void 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    if (!ethers2.isAddress(to)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Ethereum address"
      });
    }
    const badgeNFTAddress = process.env.BADGE_NFT_CONTRACT_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || "https://rpc.fuse.io";
    if (!badgeNFTAddress || !privateKey) {
      return res.status(500).json({
        success: false,
        error: "Contract configuration missing"
      });
    }
    const provider = new ethers2.JsonRpcProvider(rpcUrl);
    const signer = new ethers2.Wallet(privateKey, provider);
    const badgeABI = [
      "function mintBadge(address to, string name, string description, uint8 badgeType, uint8 rarity, string tokenURI, bool isQuestReward, string questId) returns (uint256)",
      "function authorizedMinters(address) view returns (bool)",
      "function owner() view returns (address)"
    ];
    const badgeContract = new ethers2.Contract(badgeNFTAddress, badgeABI, signer);
    const isAuthorized = await badgeContract.authorizedMinters(signer.address);
    const isOwner = (await badgeContract.owner()).toLowerCase() === signer.address.toLowerCase();
    if (!isAuthorized && !isOwner) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to mint badges"
      });
    }
    const tx = await badgeContract.mintBadge(
      to,
      name,
      description,
      parseInt(badgeType),
      parseInt(rarity),
      tokenURI || "",
      isQuestReward || false,
      questId || ""
    );
    const receipt = await tx.wait();
    const mintEvent = receipt.logs.find((log2) => {
      try {
        const parsed = badgeContract.interface.parseLog(log2);
        return parsed?.name === "BadgeMinted";
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
    console.error("Error minting badge:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}
async function getBadgesByUser(req, res) {
  try {
    const { address } = req.params;
    if (!ethers2.isAddress(address)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Ethereum address"
      });
    }
    const badgeNFTAddress = process.env.BADGE_NFT_CONTRACT_ADDRESS;
    const rpcUrl = process.env.RPC_URL || "https://rpc.fuse.io";
    if (!badgeNFTAddress) {
      return res.status(500).json({
        success: false,
        error: "Contract configuration missing"
      });
    }
    const provider = new ethers2.JsonRpcProvider(rpcUrl);
    const badgeABI = [
      "function getUserBadges(address user) view returns (uint256[])",
      "function badges(uint256 tokenId) view returns (tuple(uint256 tokenId, string name, string description, uint8 badgeType, uint8 rarity, uint256 mintedAt, address originalMinter, bool isQuestReward, string questId))"
    ];
    const badgeContract = new ethers2.Contract(badgeNFTAddress, badgeABI, provider);
    const tokenIds = await badgeContract.getUserBadges(address);
    const badges2 = await Promise.all(
      tokenIds.map(async (tokenId) => {
        const badge = await badgeContract.badges(tokenId);
        return {
          tokenId: tokenId.toString(),
          name: badge.name,
          description: badge.description,
          badgeType: badge.badgeType,
          rarity: badge.rarity,
          mintedAt: new Date(Number(badge.mintedAt) * 1e3).toISOString(),
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
        badges: badges2,
        count: badges2.length
      }
    });
  } catch (error) {
    console.error("Error fetching user badges:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}
var init_badge_mint = __esm({
  "server/api/badge-mint.ts"() {
    "use strict";
  }
});

// server/api/quest-complete.ts
var quest_complete_exports = {};
__export(quest_complete_exports, {
  completeQuest: () => completeQuest,
  getQuestList: () => getQuestList
});
import { ethers as ethers3 } from "ethers";
async function completeQuest(req, res) {
  try {
    const { questId, account } = req.body;
    if (questId === void 0 || !account) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    if (!ethers3.isAddress(account)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Ethereum address"
      });
    }
    const questManagerAddress = process.env.QUEST_MANAGER_CONTRACT_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || "https://rpc.fuse.io";
    if (!questManagerAddress || !privateKey) {
      return res.status(500).json({
        success: false,
        error: "Contract configuration missing"
      });
    }
    const provider = new ethers3.JsonRpcProvider(rpcUrl);
    const signer = new ethers3.Wallet(privateKey, provider);
    const questManagerABI = [
      "function completeQuest(uint256 questId) external",
      "function getQuest(uint256 questId) external view returns (tuple(string name, string description, uint256 rewardAmount, string badgeName, string badgeDescription, string badgeTokenURI, bool isActive, uint256 completions))",
      "function hasCompletedQuest(address user, uint256 questId) external view returns (bool)",
      "function checkAuthorization() external view returns (bool isAuthorized, bool tokenAuthorized, bool badgeAuthorized)"
    ];
    const questManagerContract = new ethers3.Contract(questManagerAddress, questManagerABI, signer);
    const hasCompleted = await questManagerContract.hasCompletedQuest(account, questId);
    if (hasCompleted) {
      return res.status(400).json({
        success: false,
        error: "Quest already completed by this user"
      });
    }
    const quest = await questManagerContract.getQuest(questId);
    if (!quest.isActive) {
      return res.status(400).json({
        success: false,
        error: "Quest is not active"
      });
    }
    const [isAuthorized, tokenAuthorized, badgeAuthorized] = await questManagerContract.checkAuthorization();
    if (!isAuthorized) {
      return res.status(500).json({
        success: false,
        error: `Contract authorization missing - Token: ${tokenAuthorized}, Badge: ${badgeAuthorized}`
      });
    }
    const tx = await questManagerContract.completeQuest(questId);
    const receipt = await tx.wait();
    res.json({
      success: true,
      data: {
        transactionHash: tx.hash,
        questId,
        questName: quest.name,
        rewardAmount: ethers3.formatEther(quest.rewardAmount),
        badgeName: quest.badgeName,
        account,
        blockNumber: receipt.blockNumber
      }
    });
  } catch (error) {
    console.error("Error completing quest:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}
async function getQuestList(req, res) {
  try {
    const questManagerAddress = process.env.QUEST_MANAGER_CONTRACT_ADDRESS;
    const rpcUrl = process.env.RPC_URL || "https://rpc.fuse.io";
    if (!questManagerAddress) {
      return res.status(500).json({
        success: false,
        error: "Contract configuration missing"
      });
    }
    const provider = new ethers3.JsonRpcProvider(rpcUrl);
    const questManagerABI = [
      "function questCounter() external view returns (uint256)",
      "function getQuest(uint256 questId) external view returns (tuple(string name, string description, uint256 rewardAmount, string badgeName, string badgeDescription, string badgeTokenURI, bool isActive, uint256 completions))"
    ];
    const questManagerContract = new ethers3.Contract(questManagerAddress, questManagerABI, provider);
    const questCounter = await questManagerContract.questCounter();
    const questCount = Number(questCounter);
    const quests = await Promise.all(
      Array.from({ length: questCount }, async (_, i) => {
        try {
          const quest = await questManagerContract.getQuest(i);
          return {
            id: i,
            name: quest.name,
            description: quest.description,
            rewardAmount: ethers3.formatEther(quest.rewardAmount),
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
    const validQuests = quests.filter((quest) => quest !== null);
    res.json({
      success: true,
      data: {
        quests: validQuests,
        totalQuests: questCount
      }
    });
  } catch (error) {
    console.error("Error fetching quest list:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}
var init_quest_complete = __esm({
  "server/api/quest-complete.ts"() {
    "use strict";
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  wallets;
  onboardingProgress;
  tokens;
  userTokenBalances;
  missions;
  userMissions;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.wallets = /* @__PURE__ */ new Map();
    this.onboardingProgress = /* @__PURE__ */ new Map();
    this.tokens = /* @__PURE__ */ new Map();
    this.userTokenBalances = /* @__PURE__ */ new Map();
    this.missions = /* @__PURE__ */ new Map();
    this.userMissions = /* @__PURE__ */ new Map();
    this.initializeDefaultData();
  }
  async initializeDefaultData() {
    const fuseToken = await this.createToken({
      address: "0xa669b1F45F84368fBe48882bF8d1814aae7a4422",
      chainId: "122",
      symbol: "FUSE",
      name: "Fuse Token",
      decimals: "18",
      logoUri: "https://cryptologos.cc/logos/fuse-fuse-logo.png",
      isTestToken: false,
      isRewardEligible: true
    });
    const demoToken = await this.createToken({
      address: "0x0000000000000000000000000000000000000001",
      chainId: "122",
      symbol: "MEE",
      name: "MeeChain Token",
      decimals: "18",
      logoUri: null,
      isTestToken: true,
      isRewardEligible: true
    });
    await this.createMission({
      id: "create_wallet",
      title: "\u0E2A\u0E23\u0E49\u0E32\u0E07 Smart Wallet",
      description: "\u0E2A\u0E23\u0E49\u0E32\u0E07 Smart Wallet \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E04\u0E23\u0E31\u0E49\u0E07\u0E41\u0E23\u0E01",
      rewardType: "token",
      rewardAmount: "100",
      rewardTokenId: demoToken.id,
      isActive: true
    });
    await this.createMission({
      id: "connect_dapp",
      title: "\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D DApp \u0E04\u0E23\u0E31\u0E49\u0E07\u0E41\u0E23\u0E01",
      description: "\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E01\u0E31\u0E1A DApp \u0E20\u0E32\u0E22\u0E19\u0E2D\u0E01\u0E1C\u0E48\u0E32\u0E19 WalletConnect",
      rewardType: "token",
      rewardAmount: "10",
      rewardTokenId: fuseToken.id,
      isActive: true
    });
    await this.createMission({
      id: "enable_biometric",
      title: "\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 Biometric",
      description: "\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E15\u0E31\u0E27\u0E15\u0E19\u0E14\u0E49\u0E27\u0E22\u0E25\u0E32\u0E22\u0E19\u0E34\u0E49\u0E27\u0E21\u0E37\u0E2D",
      rewardType: "token",
      rewardAmount: "50",
      rewardTokenId: demoToken.id,
      isActive: true
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserBySocialId(socialId, provider) {
    return Array.from(this.users.values()).find(
      (user) => user.socialId === socialId && user.provider === provider
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      email: insertUser.email ?? null,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      profileImageUrl: insertUser.profileImageUrl ?? null,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async getWalletByUserId(userId) {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.userId === userId
    );
  }
  async createWallet(insertWallet) {
    const id = randomUUID();
    const wallet = {
      ...insertWallet,
      type: insertWallet.type ?? "smart",
      biometricEnabled: insertWallet.biometricEnabled ?? false,
      pinHash: insertWallet.pinHash ?? null,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.wallets.set(id, wallet);
    return wallet;
  }
  async updateWallet(id, updates) {
    const wallet = this.wallets.get(id);
    if (!wallet) return void 0;
    const updatedWallet = { ...wallet, ...updates };
    this.wallets.set(id, updatedWallet);
    return updatedWallet;
  }
  async getOnboardingProgress(userId) {
    return Array.from(this.onboardingProgress.values()).find(
      (progress) => progress.userId === userId
    );
  }
  async createOnboardingProgress(insertProgress) {
    const id = randomUUID();
    const progress = {
      ...insertProgress,
      mode: insertProgress.mode ?? null,
      currentStep: insertProgress.currentStep ?? "1",
      completedSteps: insertProgress.completedSteps ?? [],
      isCompleted: insertProgress.isCompleted ?? false,
      firstMissionCompleted: insertProgress.firstMissionCompleted ?? false,
      id,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.onboardingProgress.set(id, progress);
    return progress;
  }
  async updateOnboardingProgress(userId, updates) {
    const existing = await this.getOnboardingProgress(userId);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.onboardingProgress.set(existing.id, updated);
    return updated;
  }
  // Token operations
  async getTokens() {
    return Array.from(this.tokens.values());
  }
  async getTokenByAddress(address, chainId) {
    return Array.from(this.tokens.values()).find(
      (token) => token.address.toLowerCase() === address.toLowerCase() && token.chainId === chainId
    );
  }
  async createToken(insertToken) {
    const id = randomUUID();
    const token = {
      ...insertToken,
      decimals: insertToken.decimals ?? "18",
      logoUri: insertToken.logoUri ?? null,
      isTestToken: insertToken.isTestToken ?? true,
      isRewardEligible: insertToken.isRewardEligible ?? true,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.tokens.set(id, token);
    return token;
  }
  // User token balance operations
  async getUserTokenBalance(userId, tokenId) {
    return Array.from(this.userTokenBalances.values()).find(
      (balance) => balance.userId === userId && balance.tokenId === tokenId
    );
  }
  async getUserTokenBalances(userId) {
    return Array.from(this.userTokenBalances.values()).filter(
      (balance) => balance.userId === userId
    );
  }
  async updateUserTokenBalance(userId, tokenId, updates) {
    const existing = await this.getUserTokenBalance(userId, tokenId);
    if (existing) {
      const updated = {
        ...existing,
        ...updates,
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.userTokenBalances.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newBalance = {
        id,
        userId,
        tokenId,
        balance: updates.balance ?? "0",
        lastFaucetClaim: updates.lastFaucetClaim ?? null,
        totalEarned: updates.totalEarned ?? "0",
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.userTokenBalances.set(id, newBalance);
      return newBalance;
    }
  }
  // Mission operations
  async getMissions() {
    return Array.from(this.missions.values()).filter((mission) => mission.isActive);
  }
  async getMission(id) {
    return this.missions.get(id);
  }
  async createMission(insertMission) {
    const mission = {
      ...insertMission,
      description: insertMission.description ?? null,
      rewardTokenId: insertMission.rewardTokenId ?? null,
      isActive: insertMission.isActive ?? true,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.missions.set(mission.id, mission);
    return mission;
  }
  // User mission operations
  async getUserMissions(userId) {
    return Array.from(this.userMissions.values()).filter(
      (userMission) => userMission.userId === userId
    );
  }
  async getUserMission(userId, missionId) {
    return Array.from(this.userMissions.values()).find(
      (userMission) => userMission.userId === userId && userMission.missionId === missionId
    );
  }
  async createUserMission(insertUserMission) {
    const id = randomUUID();
    const userMission = {
      ...insertUserMission,
      status: insertUserMission.status ?? "pending",
      completedAt: insertUserMission.completedAt ?? null,
      claimedAt: insertUserMission.claimedAt ?? null,
      proof: insertUserMission.proof ?? null,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.userMissions.set(id, userMission);
    return userMission;
  }
  async updateUserMission(id, updates) {
    const userMission = this.userMissions.get(id);
    if (!userMission) return void 0;
    const updated = { ...userMission, ...updates };
    this.userMissions.set(id, updated);
    return updated;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  socialId: text("social_id").notNull().unique(),
  provider: text("provider").notNull(),
  // google, facebook, line
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  address: text("address").notNull(),
  type: text("type").notNull().default("smart"),
  // smart, eoa
  biometricEnabled: boolean("biometric_enabled").default(false),
  pinHash: text("pin_hash"),
  createdAt: timestamp("created_at").defaultNow()
});
var onboardingProgress = pgTable("onboarding_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  currentStep: text("current_step").notNull().default("1"),
  completedSteps: jsonb("completed_steps").default("[]"),
  isCompleted: boolean("is_completed").default(false),
  mode: text("mode"),
  // demo, live
  firstMissionCompleted: boolean("first_mission_completed").default(false),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true
});
var insertOnboardingProgressSchema = createInsertSchema(onboardingProgress).omit({
  id: true,
  updatedAt: true
});
var tokens = pgTable("tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull(),
  chainId: text("chain_id").notNull(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  decimals: text("decimals").notNull().default("18"),
  logoUri: text("logo_uri"),
  isTestToken: boolean("is_test_token").default(true),
  isRewardEligible: boolean("is_reward_eligible").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var userTokenBalances = pgTable("user_token_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  tokenId: varchar("token_id").notNull().references(() => tokens.id),
  balance: text("balance").notNull().default("0"),
  lastFaucetClaim: timestamp("last_faucet_claim"),
  totalEarned: text("total_earned").notNull().default("0"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var missions = pgTable("missions", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  rewardType: text("reward_type").notNull(),
  // token, gas_credit, badge_nft, tier_unlock
  rewardAmount: text("reward_amount").notNull(),
  rewardTokenId: varchar("reward_token_id").references(() => tokens.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var userMissions = pgTable("user_missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  missionId: varchar("mission_id").notNull().references(() => missions.id),
  status: text("status").notNull().default("pending"),
  // pending, completed, claimed
  completedAt: timestamp("completed_at"),
  claimedAt: timestamp("claimed_at"),
  proof: jsonb("proof"),
  // txHash, etc.
  createdAt: timestamp("created_at").defaultNow()
});
var insertTokenSchema = createInsertSchema(tokens).omit({
  id: true,
  createdAt: true
});
var insertUserTokenBalanceSchema = createInsertSchema(userTokenBalances).omit({
  id: true,
  updatedAt: true
});
var insertMissionSchema = createInsertSchema(missions).omit({
  createdAt: true
});
var insertUserMissionSchema = createInsertSchema(userMissions).omit({
  id: true,
  createdAt: true
});
var badges = pgTable("badges", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  rarity: text("rarity").notNull(),
  // Common, Rare, Legendary
  category: text("category").notNull(),
  // achievement, quest, special, season
  isNFT: boolean("is_nft").default(false),
  contractAddress: text("contract_address"),
  tokenId: text("token_id"),
  powers: jsonb("powers"),
  // {type: "xp_boost", value: 10, condition: "night_quest"}
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  badgeId: varchar("badge_id").notNull().references(() => badges.id),
  mintedAt: timestamp("minted_at").defaultNow(),
  isEquipped: boolean("is_equipped").default(false),
  earnedFrom: text("earned_from"),
  // mission_id, quest_type, special_event
  metadata: jsonb("metadata")
  // additional data like mint transaction hash
});
var insertBadgeSchema = createInsertSchema(badges).omit({
  createdAt: true
});
var insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  mintedAt: true
});

// server/routes.ts
import crypto from "crypto";

// server/api/faucet.ts
import { ethers } from "ethers";
var faucetRequests = /* @__PURE__ */ new Map();
var RATE_LIMIT_HOURS = 24;
var FAUCET_AMOUNTS = {
  "ETH": "0.01",
  "FUSE": "1.0",
  "MEE": "100",
  "CUSTOM": "5"
};
var requestFaucet = async (req, res) => {
  try {
    const { userId, chain, walletAddress, token } = req.body;
    if (!userId || !walletAddress || !token) {
      return res.status(400).json({
        error: "MISSING_FIELDS",
        message: "userId, walletAddress, and token are required"
      });
    }
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        error: "INVALID_ADDRESS",
        message: "Invalid wallet address format"
      });
    }
    const userKey = `${userId}_${token}`;
    const userRequests = faucetRequests.get(userKey);
    const now = /* @__PURE__ */ new Date();
    if (userRequests) {
      const hoursSinceLastRequest = (now.getTime() - userRequests.lastRequest.getTime()) / (1e3 * 60 * 60);
      if (hoursSinceLastRequest < RATE_LIMIT_HOURS) {
        const nextAvailable2 = new Date(userRequests.lastRequest.getTime() + RATE_LIMIT_HOURS * 60 * 60 * 1e3);
        return res.status(429).json({
          error: "RATE_LIMITED",
          message: "Faucet request too frequent. Try again in 24 hours.",
          nextAvailable: nextAvailable2.toISOString()
        });
      }
    }
    const amount = FAUCET_AMOUNTS[token];
    if (!amount) {
      return res.status(400).json({
        error: "UNSUPPORTED_TOKEN",
        message: `Token ${token} is not supported by faucet`
      });
    }
    faucetRequests.set(userKey, {
      lastRequest: now,
      count: (userRequests?.count || 0) + 1
    });
    const nextAvailable = new Date(now.getTime() + RATE_LIMIT_HOURS * 60 * 60 * 1e3);
    res.json({
      status: "success",
      amount,
      token,
      nextAvailable: nextAvailable.toISOString(),
      message: `${amount} ${token} sent to ${walletAddress}`
    });
  } catch (error) {
    console.error("Faucet request error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to process faucet request"
    });
  }
};
var getFaucetStatus = async (req, res) => {
  try {
    const { userId, token = "ETH" } = req.query;
    if (!userId) {
      return res.status(400).json({
        error: "MISSING_USER_ID",
        message: "userId parameter is required"
      });
    }
    const userKey = `${userId}_${token}`;
    const userRequests = faucetRequests.get(userKey);
    const now = /* @__PURE__ */ new Date();
    if (!userRequests) {
      return res.json({
        eligible: true,
        lastRequest: null,
        nextAvailable: now.toISOString()
      });
    }
    const hoursSinceLastRequest = (now.getTime() - userRequests.lastRequest.getTime()) / (1e3 * 60 * 60);
    const eligible = hoursSinceLastRequest >= RATE_LIMIT_HOURS;
    const nextAvailable = eligible ? now.toISOString() : new Date(userRequests.lastRequest.getTime() + RATE_LIMIT_HOURS * 60 * 60 * 1e3).toISOString();
    res.json({
      eligible,
      lastRequest: userRequests.lastRequest.toISOString(),
      nextAvailable,
      requestCount: userRequests.count
    });
  } catch (error) {
    console.error("Faucet status error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to get faucet status"
    });
  }
};

// server/api/earnings.ts
var userEarnings = /* @__PURE__ */ new Map();
var earningsHistory = /* @__PURE__ */ new Map();
var initializeMockData = () => {
  userEarnings.set("user_123", {
    "USDC": "0.15",
    "MeeToken": "5.0",
    "ETH": "0.002"
  });
  earningsHistory.set("user_123", [
    {
      id: "1",
      userId: "user_123",
      date: "2025-01-07",
      activity: "\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21 DApp \u0E04\u0E23\u0E31\u0E49\u0E07\u0E41\u0E23\u0E01",
      amount: "0.05",
      token: "USDC",
      status: "completed",
      txHash: "0x123..."
    },
    {
      id: "2",
      userId: "user_123",
      date: "2025-01-06",
      activity: "\u0E40\u0E0A\u0E34\u0E0D\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E19",
      amount: "0.10",
      token: "USDC",
      status: "completed",
      txHash: "0x456..."
    },
    {
      id: "3",
      userId: "user_123",
      date: "2025-01-07",
      activity: "\u0E17\u0E33\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19",
      amount: "2.0",
      token: "MeeToken",
      status: "completed"
    },
    {
      id: "4",
      userId: "user_123",
      date: "2025-01-05",
      activity: "Swap tokens",
      amount: "0.001",
      token: "ETH",
      status: "completed",
      txHash: "0x789..."
    }
  ]);
};
initializeMockData();
var getEarningsSummary = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        error: "MISSING_USER_ID",
        message: "userId parameter is required"
      });
    }
    const totalEarnings = userEarnings.get(userId) || {};
    const history = earningsHistory.get(userId) || [];
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const todayEarnings = {};
    history.filter((record) => record.date === today && record.status === "completed").forEach((record) => {
      const current = parseFloat(todayEarnings[record.token] || "0");
      todayEarnings[record.token] = (current + parseFloat(record.amount)).toString();
    });
    res.json({
      total: totalEarnings,
      today: todayEarnings,
      summary: {
        totalActivities: history.length,
        completedToday: history.filter((r) => r.date === today && r.status === "completed").length
      }
    });
  } catch (error) {
    console.error("Earnings summary error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to get earnings summary"
    });
  }
};
var getEarningsHistory = async (req, res) => {
  try {
    const { userId, limit = "20", offset = "0" } = req.query;
    if (!userId) {
      return res.status(400).json({
        error: "MISSING_USER_ID",
        message: "userId parameter is required"
      });
    }
    const history = earningsHistory.get(userId) || [];
    const startIndex = parseInt(offset);
    const limitNum = parseInt(limit);
    const sortedHistory = history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const paginatedHistory = sortedHistory.slice(startIndex, startIndex + limitNum);
    res.json({
      data: paginatedHistory,
      pagination: {
        total: history.length,
        offset: startIndex,
        limit: limitNum,
        hasMore: startIndex + limitNum < history.length
      }
    });
  } catch (error) {
    console.error("Earnings history error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to get earnings history"
    });
  }
};
var transferEarnings = async (req, res) => {
  try {
    const { userId, walletAddress, token, amount } = req.body;
    if (!userId || !walletAddress || !token || !amount) {
      return res.status(400).json({
        error: "MISSING_FIELDS",
        message: "userId, walletAddress, token, and amount are required"
      });
    }
    const userBalance = userEarnings.get(userId) || {};
    const availableBalance = parseFloat(userBalance[token] || "0");
    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0) {
      return res.status(400).json({
        error: "INVALID_AMOUNT",
        message: "Transfer amount must be greater than 0"
      });
    }
    if (availableBalance < transferAmount) {
      return res.status(400).json({
        error: "INSUFFICIENT_BALANCE",
        message: `Insufficient ${token} balance. Available: ${availableBalance}`
      });
    }
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    userBalance[token] = (availableBalance - transferAmount).toString();
    userEarnings.set(userId, userBalance);
    const history = earningsHistory.get(userId) || [];
    history.unshift({
      id: Date.now().toString(),
      userId,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      activity: `\u0E42\u0E2D\u0E19\u0E40\u0E02\u0E49\u0E32\u0E01\u0E23\u0E30\u0E40\u0E1B\u0E4B\u0E32 ${walletAddress.substring(0, 6)}...`,
      amount: amount.toString(),
      token,
      status: "completed",
      txHash
    });
    earningsHistory.set(userId, history);
    res.json({
      status: "success",
      txHash,
      newBalance: userBalance[token],
      message: `${amount} ${token} transferred to ${walletAddress}`
    });
  } catch (error) {
    console.error("Transfer earnings error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to transfer earnings"
    });
  }
};
var getEarnings = async (req, res) => {
  try {
    const userId = req.query.userId || "user_123";
    if (!userId) {
      return res.status(400).json({
        error: "MISSING_USER_ID",
        message: "userId parameter is required"
      });
    }
    const totalEarnings = userEarnings.get(userId) || {};
    const history = earningsHistory.get(userId) || [];
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const todayEarnings = {};
    history.filter((record) => record.date === today && record.status === "completed").forEach((record) => {
      const current = parseFloat(todayEarnings[record.token] || "0");
      todayEarnings[record.token] = (current + parseFloat(record.amount)).toString();
    });
    res.json({
      total: totalEarnings,
      today: todayEarnings,
      history: history.slice(0, 10),
      // Last 10 activities
      summary: {
        totalActivities: history.length,
        completedToday: history.filter((r) => r.date === today && r.status === "completed").length
      }
    });
  } catch (error) {
    console.error("Get earnings error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to get earnings"
    });
  }
};

// server/api/user-tier.ts
var userTiers = /* @__PURE__ */ new Map();
var TIER_BENEFITS = [
  {
    tier: "Beginner",
    level: 1,
    benefits: ["\u0E40\u0E2B\u0E23\u0E35\u0E22\u0E0D\u0E17\u0E14\u0E25\u0E2D\u0E07", "\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E1E\u0E37\u0E49\u0E19\u0E10\u0E32\u0E19", "\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49 Web3"],
    requirements: { missionsCompleted: 0, tokensEarned: 0, referrals: 0 }
  },
  {
    tier: "Explorer",
    level: 2,
    benefits: ["\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15 gas \u0E1F\u0E23\u0E35", "Badge NFT", "\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E1E\u0E34\u0E40\u0E28\u0E29", "Discord VIP"],
    requirements: { missionsCompleted: 5, tokensEarned: 100, referrals: 1 }
  },
  {
    tier: "Pro",
    level: 3,
    benefits: ["Swap \u0E02\u0E49\u0E32\u0E21\u0E40\u0E0A\u0E19\u0E1F\u0E23\u0E35", "NFT \u0E1E\u0E34\u0E40\u0E28\u0E29", "Early access", "Governance voting"],
    requirements: { missionsCompleted: 15, tokensEarned: 500, referrals: 3 }
  },
  {
    tier: "Expert",
    level: 4,
    benefits: ["Premium support", "Beta features", "Exclusive events", "Custom NFT"],
    requirements: { missionsCompleted: 30, tokensEarned: 1e3, referrals: 5 }
  },
  {
    tier: "Legend",
    level: 5,
    benefits: ["All features", "Partnership opportunities", "Revenue sharing", "Advisory role"],
    requirements: { missionsCompleted: 50, tokensEarned: 2500, referrals: 10 }
  }
];
var initializeMockTierData = () => {
  userTiers.set("user_123", {
    tier: "Explorer",
    level: 2,
    progress: {
      missionsCompleted: 8,
      required: 15,
      tokensEarned: 250,
      referrals: 2
    },
    rewardsUnlocked: ["\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15 gas \u0E1F\u0E23\u0E35", "Badge NFT", "\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E1E\u0E34\u0E40\u0E28\u0E29"],
    lastUpdate: (/* @__PURE__ */ new Date()).toISOString()
  });
};
initializeMockTierData();
var calculateTier = (missionsCompleted, tokensEarned, referrals) => {
  let currentTier = TIER_BENEFITS[0];
  for (const tier of TIER_BENEFITS) {
    const meetsRequirements = missionsCompleted >= tier.requirements.missionsCompleted && tokensEarned >= tier.requirements.tokensEarned && referrals >= tier.requirements.referrals;
    if (meetsRequirements) {
      currentTier = tier;
    } else {
      break;
    }
  }
  return currentTier;
};
var getNextTier = (currentLevel) => {
  return TIER_BENEFITS.find((tier) => tier.level === currentLevel + 1) || null;
};
var getUserTierStatus = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        error: "MISSING_USER_ID",
        message: "userId parameter is required"
      });
    }
    let userData = userTiers.get(userId);
    if (!userData) {
      userData = {
        tier: "Beginner",
        level: 1,
        progress: {
          missionsCompleted: 0,
          required: 5,
          tokensEarned: 0,
          referrals: 0
        },
        rewardsUnlocked: ["\u0E40\u0E2B\u0E23\u0E35\u0E22\u0E0D\u0E17\u0E14\u0E25\u0E2D\u0E07", "\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E1E\u0E37\u0E49\u0E19\u0E10\u0E32\u0E19"],
        lastUpdate: (/* @__PURE__ */ new Date()).toISOString()
      };
      userTiers.set(userId, userData);
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
          userData.progress.missionsCompleted / nextTier.requirements.missionsCompleted * 100,
          userData.progress.tokensEarned / nextTier.requirements.tokensEarned * 100,
          userData.progress.referrals / nextTier.requirements.referrals * 100
        )
      ) : 100
    });
  } catch (error) {
    console.error("User tier status error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to get user tier status"
    });
  }
};
var getTierBenefits = async (req, res) => {
  try {
    res.json(TIER_BENEFITS.map((tier) => ({
      tier: tier.tier,
      level: tier.level,
      benefits: tier.benefits,
      requirements: tier.requirements
    })));
  } catch (error) {
    console.error("Tier benefits error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to get tier benefits"
    });
  }
};
var updateUserTier = async (req, res) => {
  try {
    const { userId, missionsCompleted, tokensEarned, referrals, newTier } = req.body;
    if (!userId) {
      return res.status(400).json({
        error: "MISSING_USER_ID",
        message: "userId is required"
      });
    }
    let userData = userTiers.get(userId) || {
      tier: "Beginner",
      level: 1,
      progress: {
        missionsCompleted: 0,
        required: 5,
        tokensEarned: 0,
        referrals: 0
      },
      rewardsUnlocked: ["\u0E40\u0E2B\u0E23\u0E35\u0E22\u0E0D\u0E17\u0E14\u0E25\u0E2D\u0E07", "\u0E20\u0E32\u0E23\u0E01\u0E34\u0E08\u0E1E\u0E37\u0E49\u0E19\u0E10\u0E32\u0E19"],
      lastUpdate: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (typeof missionsCompleted === "number") {
      userData.progress.missionsCompleted = missionsCompleted;
    }
    if (typeof tokensEarned === "number") {
      userData.progress.tokensEarned = tokensEarned;
    }
    if (typeof referrals === "number") {
      userData.progress.referrals = referrals;
    }
    const calculatedTier = calculateTier(
      userData.progress.missionsCompleted,
      userData.progress.tokensEarned,
      userData.progress.referrals
    );
    const targetTierData = newTier ? TIER_BENEFITS.find((t) => t.tier === newTier) : calculatedTier;
    if (!targetTierData) {
      return res.status(400).json({
        error: "INVALID_TIER",
        message: "Invalid tier specified"
      });
    }
    const oldTier = userData.tier;
    const tierUpgraded = targetTierData.level > userData.level;
    userData.tier = targetTierData.tier;
    userData.level = targetTierData.level;
    userData.rewardsUnlocked = targetTierData.benefits;
    userData.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
    const nextTier = getNextTier(userData.level);
    if (nextTier) {
      userData.progress.required = nextTier.requirements.missionsCompleted;
    }
    userTiers.set(userId, userData);
    const response = {
      status: tierUpgraded ? "upgraded" : "updated",
      tier: userData.tier,
      level: userData.level,
      oldTier,
      rewardsGranted: tierUpgraded ? targetTierData.benefits : [],
      progress: userData.progress
    };
    if (tierUpgraded) {
      response.message = `\u{1F389} \u0E22\u0E34\u0E19\u0E14\u0E35\u0E14\u0E49\u0E27\u0E22! \u0E04\u0E38\u0E13\u0E44\u0E14\u0E49\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E02\u0E36\u0E49\u0E19\u0E40\u0E1B\u0E47\u0E19 ${userData.tier} \u0E41\u0E25\u0E49\u0E27!`;
    }
    res.json(response);
  } catch (error) {
    console.error("Update user tier error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to update user tier"
    });
  }
};

// server/api/secrets-health.ts
init_secrets_checker();
async function getSecretsHealth(req, res) {
  try {
    const result = checkSecrets();
    const message = getSecretsStatusMessage(result);
    res.json({
      success: true,
      data: {
        ...result,
        message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        environment: process.env.NODE_ENV || "development"
      }
    });
  } catch (error) {
    console.error("Secrets health check failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check secrets health"
    });
  }
}
async function getDetailedSecretsReport(req, res) {
  try {
    const result = checkSecrets();
    const secretsReport = {
      required: result.missing.length === 0 ? "All set \u2705" : `Missing ${result.missing.length} keys`,
      optional: result.warnings.length === 0 ? "All set \u2705" : `Missing ${result.warnings.length} keys`,
      missingRequired: result.missing.map((key) => ({ key, status: "missing" })),
      missingOptional: result.warnings.map((key) => ({ key, status: "missing" }))
    };
    res.json({
      success: true,
      data: {
        status: result.status,
        message: getSecretsStatusMessage(result),
        report: secretsReport,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  } catch (error) {
    console.error("Detailed secrets report failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate secrets report"
    });
  }
}

// server/api/wallet.ts
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
function generateWallet() {
  const randomBytes = Array.from({ length: 20 }, () => Math.floor(Math.random() * 256));
  const address = "0x" + randomBytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  return { address };
}
var walletStorage = /* @__PURE__ */ new Map();
var currentWalletAddress = null;
async function createWallet(req, res) {
  try {
    const wallet = generateWallet();
    const walletData = {
      address: wallet.address,
      balance: "0",
      network: "ethereum"
    };
    walletStorage.set(wallet.address, walletData);
    res.json({
      success: true,
      data: {
        address: wallet.address,
        balance: walletData.balance,
        network: walletData.network
      }
    });
  } catch (error) {
    console.error("Failed to create wallet:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create wallet"
    });
  }
}
async function getMyWallet(req, res) {
  try {
    let wallet;
    if (!currentWalletAddress) {
      const demoAddress = "0x" + Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      wallet = {
        address: demoAddress,
        balance: "1000000000000000000",
        // 1 ETH in wei for demo
        network: "demo"
      };
    } else {
      wallet = walletStorage.get(currentWalletAddress);
      if (!wallet) {
        wallet = {
          address: currentWalletAddress,
          balance: "1000000000000000000",
          // 1 ETH in wei for demo
          network: "demo"
        };
        walletStorage.set(currentWalletAddress, wallet);
      }
    }
    res.json({
      success: true,
      data: {
        ...wallet,
        name: "Demo User",
        email: "demo@meechain.app",
        tier: "Bronze",
        level: 1
      }
    });
  } catch (error) {
    console.error("Failed to get wallet:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get wallet"
    });
  }
}
async function getWallet(req, res) {
  try {
    const { address } = req.params;
    if (!isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        error: "Invalid wallet address"
      });
    }
    const wallet = walletStorage.get(address);
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found"
      });
    }
    res.json({
      success: true,
      data: wallet
    });
  } catch (error) {
    console.error("Failed to get wallet:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get wallet"
    });
  }
}
async function connectWallet(req, res) {
  try {
    const { address, signature, isDemoMode } = req.body;
    if (!address || !isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        error: "Valid wallet address required"
      });
    }
    currentWalletAddress = address;
    if (!walletStorage.has(address)) {
      const walletData = {
        address,
        balance: isDemoMode ? "1000000000000000000" : "0",
        // 1 ETH for demo
        network: isDemoMode ? "demo" : "ethereum"
      };
      walletStorage.set(address, walletData);
    }
    const wallet = walletStorage.get(address);
    res.json({
      success: true,
      data: {
        connected: true,
        isDemoMode: !!isDemoMode,
        ...wallet
      }
    });
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    res.status(500).json({
      success: false,
      error: "Failed to connect wallet"
    });
  }
}
async function getWalletBalances(req, res) {
  try {
    const { address } = req.params;
    const walletAddress = address || currentWalletAddress || "0x" + Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    let wallet = walletStorage.get(walletAddress);
    if (!wallet) {
      wallet = {
        address: walletAddress,
        balance: "1000000000000000000",
        // 1 ETH
        network: "demo"
      };
      if (currentWalletAddress) {
        walletStorage.set(walletAddress, wallet);
      }
    }
    const balances = [
      {
        token: "ETH",
        balance: wallet.balance,
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        value: "1.00",
        price: "$2,400.00"
      },
      {
        token: "MEE",
        balance: "500000000000000000000",
        // 500 MEE tokens
        symbol: "MEE",
        name: "MeeChain Token",
        decimals: 18,
        value: "500.00",
        price: "$0.12"
      },
      {
        token: "USDC",
        balance: "1000000000",
        // 1000 USDC (6 decimals)
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        value: "1,000.00",
        price: "$1.00"
      }
    ];
    res.json({
      success: true,
      data: balances
    });
  } catch (error) {
    console.error("Failed to get wallet balances:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get wallet balances"
    });
  }
}

// server/api/swap-bridge.ts
var SWAP_BRIDGE_CONFIG = {
  address: process.env.SWAP_BRIDGE_CONTRACT_ADDRESS || "0xYourSwapBridgeContractAddress",
  configured: !!process.env.SWAP_BRIDGE_CONTRACT_ADDRESS
};
var getSwapBridgeConfig = async (req, res) => {
  try {
    res.json({
      configured: true,
      // Set to true for demo mode
      address: "0x1234567890123456789012345678901234567890",
      demoMode: true,
      supportedTokens: ["ETH", "MEE", "USDT", "FUSE"],
      supportedChains: [1, 122, 56, 137],
      minimumAmount: "0.001",
      maximumAmount: "1000",
      bridgeFee: "0.003",
      // 0.3%
      networks: {
        ethereum: { chainId: 1, rpcUrl: "https://eth.llamarpc.com" },
        polygon: { chainId: 137, rpcUrl: "https://polygon.llamarpc.com" },
        bsc: { chainId: 56, rpcUrl: "https://binance.llamarpc.com" },
        fuse: { chainId: 122, rpcUrl: "https://rpc.fuse.io" }
      }
    });
  } catch (error) {
    console.error("Error getting swap bridge config:", error);
    res.status(500).json({
      error: "Failed to get configuration",
      configured: false
    });
  }
};
var executeSwap = async (req, res) => {
  try {
    const { fromToken, toToken, amount, fromNetwork, toNetwork } = req.body;
    if (!fromToken || !toToken || !amount) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    const mockTxHash = "0x" + Math.random().toString(16).substring(2, 66);
    res.json({
      success: true,
      txHash: mockTxHash,
      fromToken,
      toToken,
      amount,
      estimatedGas: "21000",
      gasPrice: "20000000000"
    });
  } catch (error) {
    console.error("Error executing swap:", error);
    res.status(500).json({ error: "Failed to execute swap" });
  }
};
var getQuote = async (req, res) => {
  try {
    const { fromToken, toToken, amount } = req.query;
    if (!fromToken || !toToken || !amount) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    const rate = Math.random() * 0.1 + 0.95;
    const outputAmount = (parseFloat(amount) * rate).toFixed(6);
    res.json({
      inputAmount: amount,
      outputAmount,
      rate: rate.toFixed(6),
      minimumReceived: (parseFloat(outputAmount) * 0.99).toFixed(6),
      priceImpact: ((1 - rate) * 100).toFixed(2) + "%",
      fee: "0.3%",
      estimatedGas: "150000"
    });
  } catch (error) {
    console.error("Error getting quote:", error);
    res.status(500).json({ error: "Failed to get quote" });
  }
};

// server/api/deployment-check.ts
init_secrets_checker();
async function checkDeploymentReadiness(req, res) {
  try {
    const secretsCheck = checkSecrets();
    const hasContractAddresses = !!(process.env.VITE_TOKEN_CONTRACT_ADDRESS && process.env.VITE_NFT_CONTRACT_ADDRESS && process.env.VITE_BADGE_CONTRACT_ADDRESS);
    const hasBlockchainConfig = !!(process.env.VITE_FUSE_RPC_URL && process.env.VITE_CHAIN_ID);
    const deploymentReadiness = {
      secrets: secretsCheck,
      smartContracts: {
        hasAddresses: hasContractAddresses,
        tokenContract: !!process.env.VITE_TOKEN_CONTRACT_ADDRESS,
        nftContract: !!process.env.VITE_NFT_CONTRACT_ADDRESS,
        badgeContract: !!process.env.VITE_BADGE_CONTRACT_ADDRESS
      },
      blockchain: {
        configured: hasBlockchainConfig,
        rpcUrl: !!process.env.VITE_FUSE_RPC_URL,
        chainId: !!process.env.VITE_CHAIN_ID
      },
      database: {
        configured: !!process.env.DATABASE_URL
      },
      overall: secretsCheck.ok && hasContractAddresses && hasBlockchainConfig
    };
    const status = deploymentReadiness.overall ? "ready" : "not_ready";
    const message = getSecretsStatusMessage(secretsCheck);
    res.json({
      status,
      message,
      readiness: deploymentReadiness,
      recommendations: generateRecommendations(deploymentReadiness)
    });
  } catch (error) {
    console.error("Deployment check error:", error);
    res.status(500).json({
      status: "error",
      message: "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23 deploy \u0E44\u0E14\u0E49",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
function generateRecommendations(readiness) {
  const recommendations = [];
  if (!readiness.secrets.ok) {
    recommendations.push("\u{1F511} \u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32 Secrets \u0E17\u0E35\u0E48\u0E02\u0E32\u0E14\u0E2B\u0E32\u0E22\u0E44\u0E1B\u0E43\u0E19 Replit Secrets tool");
  }
  if (!readiness.smartContracts.hasAddresses) {
    recommendations.push("\u{1F4DC} Deploy smart contracts \u0E41\u0E25\u0E30\u0E40\u0E1E\u0E34\u0E48\u0E21 contract addresses \u0E43\u0E19 Secrets");
  }
  if (!readiness.blockchain.configured) {
    recommendations.push("\u{1F310} \u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32 RPC URL \u0E41\u0E25\u0E30 Chain ID \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A Fuse Network");
  }
  if (readiness.overall) {
    recommendations.push("\u{1F680} \u0E23\u0E30\u0E1A\u0E1A\u0E1E\u0E23\u0E49\u0E2D\u0E21 deploy \u0E41\u0E25\u0E49\u0E27! \u0E04\u0E25\u0E34\u0E01 Deploy button \u0E44\u0E14\u0E49\u0E40\u0E25\u0E22");
  }
  return recommendations;
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/auth/social", async (req, res) => {
    try {
      const { provider, socialId, email, firstName, lastName, profileImageUrl } = req.body;
      if (!provider || !socialId) {
        return res.status(400).json({ message: "Provider and social ID are required" });
      }
      let user = await storage.getUserBySocialId(socialId, provider);
      if (!user) {
        const userData = insertUserSchema.parse({
          socialId,
          provider,
          email,
          firstName,
          lastName,
          profileImageUrl
        });
        user = await storage.createUser(userData);
        await storage.createOnboardingProgress({
          userId: user.id,
          currentStep: "1",
          completedSteps: [],
          isCompleted: false,
          firstMissionCompleted: false
        });
      }
      res.json({ user });
    } catch (error) {
      console.error("Social auth error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });
  app2.get("/api/onboarding/:userId", async (req, res) => {
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
  app2.put("/api/onboarding/:userId", async (req, res) => {
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
  app2.post("/api/wallet/create", async (req, res) => {
    try {
      const { userId, biometricEnabled, pinHash } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const existingWallet = await storage.getWalletByUserId(userId);
      if (existingWallet) {
        return res.json({ wallet: existingWallet });
      }
      const progress = await storage.getOnboardingProgress(userId);
      const completedSteps = progress?.completedSteps || [];
      const hasPinStep = completedSteps.includes("pin");
      const hasBiometricStep = completedSteps.includes("biometric");
      const address = `0x${crypto.randomBytes(20).toString("hex")}`;
      const walletData = insertWalletSchema.parse({
        userId,
        address,
        type: "smart",
        biometricEnabled: biometricEnabled || hasBiometricStep,
        pinHash: pinHash || (hasPinStep ? "temp_pin_hash" : null)
      });
      const wallet = await storage.createWallet(walletData);
      res.json({ wallet });
    } catch (error) {
      console.error("Create wallet error:", error);
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });
  app2.get("/api/wallet/by-user/:userId", async (req, res) => {
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
  app2.post("/api/security/pin", async (req, res) => {
    try {
      const { userId, pin } = req.body;
      if (!userId || !pin || pin.length !== 6) {
        return res.status(400).json({ message: "User ID and 6-digit PIN are required" });
      }
      const pinHash = crypto.createHash("sha256").update(pin).digest("hex");
      const wallet = await storage.getWalletByUserId(userId);
      if (wallet) {
        await storage.updateWallet(wallet.id, { pinHash });
      } else {
        const progress = await storage.getOnboardingProgress(userId);
        if (progress) {
          await storage.updateOnboardingProgress(userId, {
            completedSteps: [...progress.completedSteps || [], "pin"]
          });
        }
      }
      res.json({ success: true, pinHash });
    } catch (error) {
      console.error("Set PIN error:", error);
      res.status(500).json({ message: "Failed to set PIN" });
    }
  });
  app2.post("/api/security/biometric", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const wallet = await storage.getWalletByUserId(userId);
      if (wallet) {
        await storage.updateWallet(wallet.id, { biometricEnabled: true });
      } else {
        const progress = await storage.getOnboardingProgress(userId);
        if (progress) {
          await storage.updateOnboardingProgress(userId, {
            completedSteps: [...progress.completedSteps || [], "biometric"]
          });
        }
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Enable biometric error:", error);
      res.status(500).json({ message: "Failed to enable biometric" });
    }
  });
  app2.post("/api/mission/complete", async (req, res) => {
    try {
      const { userId, missionId = "create_wallet" } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      if (missionId === "first" || missionId === "create_wallet") {
        await storage.updateOnboardingProgress(userId, {
          firstMissionCompleted: true
        });
        const mission = await storage.getMission("create_wallet");
        if (mission) {
          let userMission = await storage.getUserMission(userId, "create_wallet");
          if (!userMission) {
            userMission = await storage.createUserMission({
              userId,
              missionId: "create_wallet",
              status: "completed",
              completedAt: /* @__PURE__ */ new Date(),
              proof: { source: "onboarding" }
            });
            if (mission.rewardTokenId) {
              const rewardAmount = mission.rewardAmount + "000000000000000000";
              const currentBalance = await storage.getUserTokenBalance(userId, mission.rewardTokenId);
              await storage.updateUserTokenBalance(userId, mission.rewardTokenId, {
                balance: (BigInt(currentBalance?.balance ?? "0") + BigInt(rewardAmount)).toString(),
                totalEarned: (BigInt(currentBalance?.totalEarned ?? "0") + BigInt(rewardAmount)).toString()
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
  app2.get("/api/tokens", async (req, res) => {
    try {
      const tokens2 = await storage.getTokens();
      res.json(tokens2);
    } catch (error) {
      console.error("Get tokens error:", error);
      res.status(500).json({ message: "Failed to get tokens" });
    }
  });
  app2.get("/api/tokens/:address/:chainId", async (req, res) => {
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
  app2.post("/api/faucet/request", async (req, res) => {
    try {
      const { userId, tokenAddress, chainId } = req.body;
      if (!userId || !tokenAddress || !chainId) {
        return res.status(400).json({ message: "User ID, token address, and chain ID are required" });
      }
      const token = await storage.getTokenByAddress(tokenAddress, chainId);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }
      const userBalance = await storage.getUserTokenBalance(userId, token.id);
      const now = /* @__PURE__ */ new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
      if (userBalance?.lastFaucetClaim && new Date(userBalance.lastFaucetClaim) > oneDayAgo) {
        const timeRemaining = new Date(userBalance.lastFaucetClaim).getTime() + 24 * 60 * 60 * 1e3 - now.getTime();
        return res.status(429).json({
          message: "Faucet cooldown active",
          timeRemaining: Math.ceil(timeRemaining / 1e3)
          // seconds
        });
      }
      const faucetAmount = "5000000000000000000";
      const currentBalance = userBalance?.balance ?? "0";
      const newBalance = (BigInt(currentBalance) + BigInt(faucetAmount)).toString();
      await storage.updateUserTokenBalance(userId, token.id, {
        balance: newBalance,
        lastFaucetClaim: now,
        totalEarned: (BigInt(userBalance?.totalEarned ?? "0") + BigInt(faucetAmount)).toString()
      });
      res.json({
        success: true,
        amount: faucetAmount,
        token: token.symbol,
        nextClaim: new Date(now.getTime() + 24 * 60 * 60 * 1e3)
      });
    } catch (error) {
      console.error("Faucet request error:", error);
      res.status(500).json({ message: "Faucet request failed" });
    }
  });
  app2.get("/api/balances/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const balances = await storage.getUserTokenBalances(userId);
      const balancesWithTokens = await Promise.all(
        balances.map(async (balance) => {
          const tokens2 = await storage.getTokens();
          const token = tokens2.find((t) => t.id === balance.tokenId);
          return {
            ...balance,
            token
          };
        })
      );
      res.json(balancesWithTokens);
    } catch (error) {
      console.error("Get user balances error:", error);
      res.status(500).json({ message: "Failed to get user balances" });
    }
  });
  app2.get("/api/missions/list", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const missions2 = await storage.getMissions();
      const userMissions2 = await storage.getUserMissions(userId);
      const missionList = await Promise.all(
        missions2.map(async (mission) => {
          const userMission = userMissions2.find((um) => um.missionId === mission.id);
          let rewardToken = null;
          if (mission.rewardTokenId) {
            const tokens2 = await storage.getTokens();
            rewardToken = tokens2.find((t) => t.id === mission.rewardTokenId);
          }
          return {
            missionId: mission.id,
            title: mission.title,
            description: mission.description,
            status: userMission?.status ?? "pending",
            reward: {
              type: mission.rewardType,
              amount: mission.rewardAmount,
              token: rewardToken?.symbol ?? null
            },
            completedAt: userMission?.completedAt,
            claimedAt: userMission?.claimedAt
          };
        })
      );
      res.json(missionList);
    } catch (error) {
      console.error("Get missions list error:", error);
      res.status(500).json({ message: "Failed to get missions list" });
    }
  });
  app2.post("/api/missions/complete", async (req, res) => {
    try {
      const { userId, missionId, proof } = req.body;
      if (!userId || !missionId) {
        return res.status(400).json({ message: "User ID and mission ID are required" });
      }
      const mission = await storage.getMission(missionId);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      let userMission = await storage.getUserMission(userId, missionId);
      if (!userMission) {
        userMission = await storage.createUserMission({
          userId,
          missionId,
          status: "completed",
          completedAt: /* @__PURE__ */ new Date(),
          proof
        });
      } else {
        userMission = await storage.updateUserMission(userMission.id, {
          status: "completed",
          completedAt: /* @__PURE__ */ new Date(),
          proof
        });
      }
      let rewardGranted = null;
      if (mission.rewardType === "token" && mission.rewardTokenId) {
        const rewardAmount = mission.rewardAmount + "000000000000000000";
        const currentBalance = await storage.getUserTokenBalance(userId, mission.rewardTokenId);
        await storage.updateUserTokenBalance(userId, mission.rewardTokenId, {
          balance: (BigInt(currentBalance?.balance ?? "0") + BigInt(rewardAmount)).toString(),
          totalEarned: (BigInt(currentBalance?.totalEarned ?? "0") + BigInt(rewardAmount)).toString()
        });
        const tokens2 = await storage.getTokens();
        const rewardToken = tokens2.find((t) => t.id === mission.rewardTokenId);
        rewardGranted = {
          type: mission.rewardType,
          amount: mission.rewardAmount,
          token: rewardToken?.symbol ?? "TOKEN"
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
  app2.post("/api/missions/claim", async (req, res) => {
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
      const updatedMission = await storage.updateUserMission(userMission.id, {
        status: "claimed",
        claimedAt: /* @__PURE__ */ new Date()
      });
      const mission = await storage.getMission(missionId);
      let reward = null;
      if (mission?.rewardTokenId) {
        const tokens2 = await storage.getTokens();
        const rewardToken = tokens2.find((t) => t.id === mission.rewardTokenId);
        reward = {
          type: mission.rewardType,
          amount: mission.rewardAmount,
          token: rewardToken?.symbol ?? "TOKEN"
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
  app2.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: process.env.NODE_ENV || "development",
      contracts: {
        token: process.env.VITE_TOKEN_CONTRACT_ADDRESS,
        nft: process.env.VITE_NFT_CONTRACT_ADDRESS
      }
    });
  });
  app2.get("/api", (req, res) => {
    res.json({
      message: "MeeChain API Server",
      version: "1.0.0",
      endpoints: [
        "GET /health - Health check",
        "GET /api - This endpoint",
        "--- Faucet API ---",
        "POST /faucet/request - Request testnet tokens",
        "GET /faucet/status - Check faucet eligibility",
        "--- Earnings API ---",
        "GET /earnings/summary - Get user earnings summary",
        "GET /earnings/history - Get user activity history",
        "POST /earnings/transfer - Transfer earnings to wallet",
        "--- User Tier API ---",
        "GET /user-tier/status - Get current user tier",
        "GET /user-tier/benefits - List tier benefits",
        "POST /user-tier/update - Update user tier"
      ]
    });
  });
  app2.post("/faucet/request", requestFaucet);
  app2.get("/faucet/status", getFaucetStatus);
  app2.get("/earnings/summary", getEarningsSummary);
  app2.get("/earnings/history", getEarningsHistory);
  app2.post("/earnings/transfer", transferEarnings);
  app2.get("/api/earnings/me", getEarnings);
  app2.get("/api/swap-bridge/config", getSwapBridgeConfig);
  app2.post("/api/swap-bridge/swap", executeSwap);
  app2.get("/api/swap-bridge/quote", getQuote);
  app2.get("/user-tier/status", getUserTierStatus);
  app2.get("/user-tier/benefits", getTierBenefits);
  app2.post("/user-tier/update", updateUserTier);
  app2.get("/api/secrets/health", getSecretsHealth);
  app2.get("/api/secrets/report", getDetailedSecretsReport);
  app2.get("/api/wallet/me", getMyWallet);
  app2.get("/api/wallet/balances", getWalletBalances);
  app2.post("/api/wallet/connect", connectWallet);
  app2.post("/api/wallet/create", createWallet);
  app2.get("/api/wallet/:address", getWallet);
  app2.get("/api/wallet/:address/balances", getWalletBalances);
  app2.get("/api/deployment-check", checkDeploymentReadiness);
  app2.get("/api/secrets/health", getSecretsHealth);
  const { mintBadge: mintBadge2, getBadgesByUser: getBadgesByUser2 } = await Promise.resolve().then(() => (init_badge_mint(), badge_mint_exports));
  app2.post("/api/badge/mint", mintBadge2);
  app2.get("/api/badge/user/:address", getBadgesByUser2);
  const { completeQuest: completeQuest2, getQuestList: getQuestList2 } = await Promise.resolve().then(() => (init_quest_complete(), quest_complete_exports));
  app2.post("/api/quest/complete", completeQuest2);
  app2.get("/api/quest/list", getQuestList2);
  app2.post("/api/badge/mint", mintBadge2);
  app2.get("/api/badge/user/:address", getBadgesByUser2);
  app2.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@assets": path.resolve(__dirname, "assets")
    }
  },
  define: {
    global: "globalThis"
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
app.get("/health", (req, res) => {
  try {
    const { checkSecrets: checkSecrets2 } = (init_secrets_checker(), __toCommonJS(secrets_checker_exports));
    const secretsCheck = checkSecrets2();
    res.json({
      status: secretsCheck.ok ? "healthy" : "warning",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: process.env.NODE_ENV || "development",
      secrets: {
        status: secretsCheck.status,
        missing: secretsCheck.missing.length,
        warnings: secretsCheck.warnings.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      error: "Health check failed"
    });
  }
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

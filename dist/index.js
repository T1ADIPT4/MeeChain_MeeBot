var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
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

// server/utils/deploy-config.ts
import { readFileSync, existsSync } from "fs";
import { join } from "path";
function getDeployConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }
  try {
    const registryPath = join(process.cwd(), "deploy-registry.json");
    if (existsSync(registryPath)) {
      const data = readFileSync(registryPath, "utf-8");
      const parsedConfig = JSON.parse(data);
      cachedConfig = parsedConfig;
      console.log("[Deploy Config] Loaded from deploy-registry.json");
      return parsedConfig;
    }
  } catch (error) {
    console.warn("[Deploy Config] Failed to load deploy-registry.json:", error);
  }
  const envConfig = {
    contracts: {
      QuestManager: process.env.VITE_QUEST_MANAGER_ADDRESS || "0x8EF99743F8e2c4C0f14C3Fc0E2925250D4F7Ad6e",
      MeeBadgeNFT: process.env.VITE_BADGE_NFT_ADDRESS || "0x1266b73564178415f48C1D9736Dc5bf427503AA2"
    },
    metadata: {
      chainId: process.env.VITE_CHAIN_ID || "11155420",
      rpcUrl: process.env.RPC_URL || "https://sepolia.optimism.io",
      environment: process.env.NODE_ENV || "production",
      fallbackEnabled: true
    },
    authorizations: {
      questManagerCanMintTokens: true,
      questManagerCanMintBadges: true,
      questManagerCanMintFootballNFTs: true,
      badgeUpgradeCanBurnTokens: false,
      badgeUpgradeCanUpgradeBadges: false
    }
  };
  console.log("[Deploy Config] Using environment variables fallback");
  cachedConfig = envConfig;
  return cachedConfig;
}
function saveDeployConfig(config) {
  try {
    const registryPath = join(process.cwd(), "deploy-registry.json");
    const data = JSON.stringify(config, null, 2);
    __require("fs").writeFileSync(registryPath, data);
    cachedConfig = config;
    return true;
  } catch (error) {
    console.error("[Deploy Config] Failed to save:", error);
    return false;
  }
}
var cachedConfig;
var init_deploy_config = __esm({
  "server/utils/deploy-config.ts"() {
    "use strict";
    cachedConfig = null;
  }
});

// server/api/rpc-health.ts
var rpc_health_exports = {};
__export(rpc_health_exports, {
  getRPCHealth: () => getRPCHealth,
  switchRPC: () => switchRPC
});
async function checkRPCHealth(rpcUrl) {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5e3);
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || "RPC Error");
    }
    const latency = Date.now() - startTime;
    return {
      isHealthy: true,
      latency,
      blockNumber: data.result
    };
  } catch (error) {
    return {
      isHealthy: false,
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
async function getRPCHealth(req, res) {
  try {
    const healthChecks = await Promise.all(
      RPC_CONFIGS.map(async (rpc) => ({
        ...rpc,
        health: await checkRPCHealth(rpc.url)
      }))
    );
    const healthyRPC = healthChecks.find((rpc) => rpc.health.isHealthy);
    const allHealthy = healthChecks.every((rpc) => rpc.health.isHealthy);
    res.json({
      success: true,
      data: {
        rpcs: healthChecks,
        activeRPC: healthyRPC?.name || "None",
        allHealthy,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  } catch (error) {
    console.error("RPC health check error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check RPC health"
    });
  }
}
async function switchRPC(req, res) {
  try {
    const { targetRPC } = req.body;
    const rpc = RPC_CONFIGS.find((r) => r.name === targetRPC);
    if (!rpc) {
      return res.status(400).json({
        success: false,
        error: "Invalid RPC name"
      });
    }
    const health = await checkRPCHealth(rpc.url);
    if (!health.isHealthy) {
      return res.status(503).json({
        success: false,
        error: `RPC ${rpc.name} is not healthy: ${health.error}`
      });
    }
    res.json({
      success: true,
      data: {
        switched: true,
        activeRPC: rpc.name,
        health
      }
    });
  } catch (error) {
    console.error("RPC switch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to switch RPC"
    });
  }
}
var RPC_CONFIGS;
var init_rpc_health = __esm({
  "server/api/rpc-health.ts"() {
    "use strict";
    RPC_CONFIGS = [
      {
        name: "OP Sepolia",
        url: process.env.RPC_URL || "https://sepolia.optimism.io",
        chainId: process.env.VITE_CHAIN_ID || "11155420",
        priority: 1
      }
    ];
  }
});

// server/api/contract-auth.ts
var contract_auth_exports = {};
__export(contract_auth_exports, {
  checkAuthorizations: () => checkAuthorizations,
  updateAuthorizations: () => updateAuthorizations
});
async function checkAuthorizations(req, res) {
  try {
    const registry = getDeployConfig();
    const { authorizations = {}, contracts } = registry;
    const issues = [];
    const warnings = [];
    if (!authorizations["questManagerCanMintTokens"]) {
      issues.push("QuestManager cannot mint MEE tokens - rewards will fail");
    }
    if (!authorizations["questManagerCanMintBadges"]) {
      issues.push("QuestManager cannot mint badges - quest rewards will fail");
    }
    if (!authorizations["questManagerCanMintFootballNFTs"]) {
      warnings.push("QuestManager cannot mint FootballNFTs - some quest rewards unavailable");
    }
    if (!authorizations["badgeUpgradeCanBurnTokens"]) {
      issues.push("BadgeUpgrade cannot burn tokens - upgrades will fail");
    }
    if (!authorizations["badgeUpgradeCanUpgradeBadges"]) {
      issues.push("BadgeUpgrade cannot upgrade badges - upgrade system non-functional");
    }
    const requiredContracts = [
      "MeeToken",
      "MeeBadgeNFT",
      "QuestManager",
      "BadgeNFTUpgrade",
      "MembershipNFT",
      "FootballNFT"
    ];
    const contractKeys = contracts;
    const missingContracts = requiredContracts.filter((name) => !contractKeys[name]);
    if (missingContracts.length > 0) {
      issues.push(`Missing contract addresses: ${missingContracts.join(", ")}`);
    }
    const isReady = issues.length === 0;
    res.json({
      success: true,
      data: {
        isReady,
        contracts: {
          deployed: Object.keys(contracts).length,
          required: requiredContracts.length,
          missing: missingContracts
        },
        authorizations: {
          ...authorizations,
          total: Object.keys(authorizations || {}).length,
          enabled: Object.values(authorizations || {}).filter((v) => v).length
        },
        issues,
        warnings,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  } catch (error) {
    console.error("Authorization check error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check authorizations"
    });
  }
}
async function updateAuthorizations(req, res) {
  try {
    const { authType, enabled } = req.body;
    if (typeof authType !== "string" || typeof enabled !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "Invalid request: authType (string) and enabled (boolean) required"
      });
    }
    const registry = getDeployConfig();
    if (!registry.authorizations) {
      registry.authorizations = {};
    }
    registry.authorizations[authType] = enabled;
    saveDeployConfig(registry);
    res.json({
      success: true,
      data: {
        updated: authType,
        value: enabled,
        authorizations: registry.authorizations
      }
    });
  } catch (error) {
    console.error("Update authorization error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update authorization"
    });
  }
}
var init_contract_auth = __esm({
  "server/api/contract-auth.ts"() {
    "use strict";
    init_deploy_config();
  }
});

// server/api/badge-mint.ts
var badge_mint_exports = {};
__export(badge_mint_exports, {
  getBadgesByUser: () => getBadgesByUser,
  mintBadge: () => mintBadge
});
import { ethers as ethers3 } from "ethers";
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
    if (!ethers3.isAddress(to)) {
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
    const provider = new ethers3.JsonRpcProvider(rpcUrl);
    const signer = new ethers3.Wallet(privateKey, provider);
    const badgeABI = [
      "function mintBadge(address to, string name, string description, uint8 badgeType, uint8 rarity, string tokenURI, bool isQuestReward, string questId) returns (uint256)",
      "function authorizedMinters(address) view returns (bool)",
      "function owner() view returns (address)"
    ];
    const badgeContract = new ethers3.Contract(badgeNFTAddress, badgeABI, signer);
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
    if (!ethers3.isAddress(address)) {
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
    const provider = new ethers3.JsonRpcProvider(rpcUrl);
    const badgeABI = [
      "function getUserBadges(address user) view returns (uint256[])",
      "function badges(uint256 tokenId) view returns (tuple(uint256 tokenId, string name, string description, uint8 badgeType, uint8 rarity, uint256 mintedAt, address originalMinter, bool isQuestReward, string questId))"
    ];
    const badgeContract = new ethers3.Contract(badgeNFTAddress, badgeABI, provider);
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

// server/api/quest-list.ts
var quest_list_exports = {};
__export(quest_list_exports, {
  completeQuestAPI: () => completeQuestAPI,
  getQuestList: () => getQuestList
});
import { ethers as ethers4 } from "ethers";
async function getQuestList(req, res) {
  try {
    const { userAddress } = req.query;
    const deployRegistry = getDeployConfig();
    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: "Contract configuration missing"
      });
    }
    const rpcUrl = process.env.RPC_URL || "https://sepolia.optimism.io";
    console.log("[Quest API] Using RPC:", rpcUrl);
    const provider = new ethers4.JsonRpcProvider(rpcUrl);
    const contract = new ethers4.Contract(
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
        let status = "pending";
        if (userAddress && ethers4.isAddress(userAddress)) {
          const completed = await contract.hasCompletedQuest(userAddress, i);
          if (completed) {
            status = "completed";
          }
        }
        quests.push({
          questId: i,
          title: quest.name,
          description: quest.description,
          status,
          reward: {
            type: quest.rewardType,
            amount: ethers4.formatEther(quest.rewardAmount),
            token: "MEE",
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
    console.error("Quest list error:", error);
    const mockQuests = [
      {
        questId: 0,
        title: "Welcome to MeeChain",
        description: "Complete your first quest to earn MEE tokens",
        status: "pending",
        reward: {
          type: "token",
          amount: "100",
          token: "MEE",
          badgeName: "First Steps",
          badgeDescription: "Completed first quest"
        },
        completions: 0,
        isActive: true
      },
      {
        questId: 1,
        title: "Explorer Badge",
        description: "Explore all features of the platform",
        status: "pending",
        reward: {
          type: "badge",
          amount: "50",
          token: "MEE",
          badgeName: "Explorer",
          badgeDescription: "Platform explorer"
        },
        completions: 0,
        isActive: true
      }
    ];
    res.json({
      success: true,
      data: mockQuests,
      isMockData: true,
      message: "Using mock data - Hardhat node not running"
    });
  }
}
async function completeQuestAPI(req, res) {
  try {
    const { questId, userAddress } = req.body;
    if (questId === void 0 || !userAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing questId or userAddress"
      });
    }
    if (!ethers4.isAddress(userAddress)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Ethereum address"
      });
    }
    const deployRegistry = getDeployConfig();
    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: "Contract configuration missing"
      });
    }
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || "https://sepolia.optimism.io";
    console.log("[Quest Complete] Using RPC:", rpcUrl);
    if (!privateKey) {
      return res.status(500).json({
        success: false,
        error: "Server configuration missing - no private key"
      });
    }
    try {
      const provider = new ethers4.JsonRpcProvider(rpcUrl);
      const signer = new ethers4.Wallet(privateKey, provider);
      const contract = new ethers4.Contract(
        deployRegistry.contracts.QuestManager,
        QUEST_MANAGER_ABI,
        signer
      );
      const hasCompleted = await contract.hasCompletedQuest(userAddress, questId);
      if (hasCompleted) {
        return res.status(400).json({
          success: false,
          error: "Quest already completed"
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
          message: "Quest completed successfully on-chain!"
        }
      });
    } catch (contractError) {
      console.error("[Quest Complete] Contract error:", contractError);
      res.status(500).json({
        success: false,
        error: contractError.message || "Failed to complete quest on-chain"
      });
    }
  } catch (error) {
    console.error("[Quest Complete] API error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to complete quest"
    });
  }
}
var QUEST_MANAGER_ABI;
var init_quest_list = __esm({
  "server/api/quest-list.ts"() {
    "use strict";
    init_deploy_config();
    QUEST_MANAGER_ABI = [
      "function getQuest(uint256 questId) view returns (string name, string description, uint256 rewardAmount, string rewardType, string badgeName, string badgeDescription, string badgeTokenURI, string playerName, string playerPosition, uint256 playerRating, string playerNationality, bool isLegendary, bool isActive, uint256 completions)",
      "function questCounter() view returns (uint256)",
      "function hasCompletedQuest(address user, uint256 questId) view returns (bool)"
    ];
  }
});

// server/api/token-mint.ts
var token_mint_exports = {};
__export(token_mint_exports, {
  mintToken: () => mintToken
});
async function mintToken(req, res) {
  try {
    const { recipientAddress, amount } = req.body;
    if (!recipientAddress || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid recipient address or amount"
      });
    }
    console.log(`[Token Mint] Minting ${amount} MEE to ${recipientAddress}`);
    res.json({
      success: true,
      data: {
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        recipient: recipientAddress,
        amount,
        tokenSymbol: "MEE",
        message: `Successfully minted ${amount} MEE tokens to ${recipientAddress}`
      }
    });
  } catch (error) {
    console.error("Token mint error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mint tokens"
    });
  }
}
var init_token_mint = __esm({
  "server/api/token-mint.ts"() {
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

// server/api/quest-management.ts
import { ethers as ethers2 } from "ethers";

// artifacts/contracts/QuestManager.sol/QuestManager.json
var QuestManager_default = {
  _format: "hh3-artifact-1",
  contractName: "QuestManager",
  sourceName: "contracts/QuestManager.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_meeToken",
          type: "address"
        },
        {
          internalType: "address",
          name: "_badgeNFT",
          type: "address"
        },
        {
          internalType: "address",
          name: "_footballNFT",
          type: "address"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        }
      ],
      name: "OwnableInvalidOwner",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address"
        }
      ],
      name: "OwnershipTransferred",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address"
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "questId",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "rewardAmount",
          type: "uint256"
        }
      ],
      name: "QuestCompleted",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "questId",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string"
        },
        {
          indexed: false,
          internalType: "string",
          name: "rewardType",
          type: "string"
        }
      ],
      name: "QuestCreated",
      type: "event"
    },
    {
      inputs: [],
      name: "badgeNFT",
      outputs: [
        {
          internalType: "contract MeeBadgeNFT",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "checkAuthorization",
      outputs: [
        {
          internalType: "bool",
          name: "isAuthorized",
          type: "bool"
        },
        {
          internalType: "bool",
          name: "tokenAuthorized",
          type: "bool"
        },
        {
          internalType: "bool",
          name: "badgeAuthorized",
          type: "bool"
        },
        {
          internalType: "bool",
          name: "footballNFTAuthorized",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "questId",
          type: "uint256"
        }
      ],
      name: "completeQuest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      name: "completed",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string"
        },
        {
          internalType: "string",
          name: "description",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "rewardAmount",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "rewardType",
          type: "string"
        },
        {
          internalType: "string",
          name: "badgeName",
          type: "string"
        },
        {
          internalType: "string",
          name: "badgeDescription",
          type: "string"
        },
        {
          internalType: "string",
          name: "badgeTokenURI",
          type: "string"
        }
      ],
      name: "createQuest",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string"
        },
        {
          internalType: "string",
          name: "description",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "rewardAmount",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "playerName",
          type: "string"
        },
        {
          internalType: "string",
          name: "playerPosition",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "playerRating",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "playerNationality",
          type: "string"
        },
        {
          internalType: "bool",
          name: "isLegendary",
          type: "bool"
        },
        {
          internalType: "string",
          name: "playerTokenURI",
          type: "string"
        }
      ],
      name: "createQuestWithPlayerReward",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "questId",
          type: "uint256"
        }
      ],
      name: "deactivateQuest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "footballNFT",
      outputs: [
        {
          internalType: "contract FootballNFT",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getContractAddresses",
      outputs: [
        {
          internalType: "address",
          name: "meeTokenAddress",
          type: "address"
        },
        {
          internalType: "address",
          name: "badgeNFTAddress",
          type: "address"
        },
        {
          internalType: "address",
          name: "footballNFTAddress",
          type: "address"
        },
        {
          internalType: "address",
          name: "questManagerAddress",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "questId",
          type: "uint256"
        }
      ],
      name: "getQuest",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "name",
              type: "string"
            },
            {
              internalType: "string",
              name: "description",
              type: "string"
            },
            {
              internalType: "uint256",
              name: "rewardAmount",
              type: "uint256"
            },
            {
              internalType: "string",
              name: "rewardType",
              type: "string"
            },
            {
              internalType: "string",
              name: "badgeName",
              type: "string"
            },
            {
              internalType: "string",
              name: "badgeDescription",
              type: "string"
            },
            {
              internalType: "string",
              name: "badgeTokenURI",
              type: "string"
            },
            {
              internalType: "string",
              name: "playerName",
              type: "string"
            },
            {
              internalType: "string",
              name: "playerPosition",
              type: "string"
            },
            {
              internalType: "uint256",
              name: "playerRating",
              type: "uint256"
            },
            {
              internalType: "string",
              name: "playerNationality",
              type: "string"
            },
            {
              internalType: "bool",
              name: "isLegendary",
              type: "bool"
            },
            {
              internalType: "bool",
              name: "isActive",
              type: "bool"
            },
            {
              internalType: "uint256",
              name: "completions",
              type: "uint256"
            }
          ],
          internalType: "struct QuestManager.Quest",
          name: "",
          type: "tuple"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "questId",
          type: "uint256"
        }
      ],
      name: "hasCompletedQuest",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "meeToken",
      outputs: [
        {
          internalType: "contract MeeToken",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "questCounter",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      name: "quests",
      outputs: [
        {
          internalType: "string",
          name: "name",
          type: "string"
        },
        {
          internalType: "string",
          name: "description",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "rewardAmount",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "rewardType",
          type: "string"
        },
        {
          internalType: "string",
          name: "badgeName",
          type: "string"
        },
        {
          internalType: "string",
          name: "badgeDescription",
          type: "string"
        },
        {
          internalType: "string",
          name: "badgeTokenURI",
          type: "string"
        },
        {
          internalType: "string",
          name: "playerName",
          type: "string"
        },
        {
          internalType: "string",
          name: "playerPosition",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "playerRating",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "playerNationality",
          type: "string"
        },
        {
          internalType: "bool",
          name: "isLegendary",
          type: "bool"
        },
        {
          internalType: "bool",
          name: "isActive",
          type: "bool"
        },
        {
          internalType: "uint256",
          name: "completions",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address"
        }
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ],
  bytecode: "0x60803461011057601f612cf638819003918201601f19168301916001600160401b03831184841017610114578084926060946040528339810103126101105761004781610128565b90610060604061005960208401610128565b9201610128565b9033156100fd575f8054336001600160a01b0319821681178355604051959290916001600160a01b0316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a3600480546001600160a01b03199081166001600160a01b0393841617909155600580548216938316939093179092556006805490921692169190911790555f600355612bb9908161013d8239f35b631e4fbdf760e01b5f525f60045260245ffd5b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b51906001600160a01b03821682036101105756fe6080806040526004361015610012575f80fd5b5f905f3560e01c908163378295331461278f5750806339527ea8146126325780634348e0e91461260a57806349f86f341461235e578063528be0a914611d82578063656bbbfa14611d595780636b85a35d146110fc578063715018a6146110a25780637d7591f0146110845780638da5cb5b1461105d578063953874d214611016578063aa995c2c14610d3d578063e085f98014610e9c578063e9d2821d14610e0c578063f2fde38b14610d86578063f8be734714610d3d5763ff8b17be146100d9575f80fd5b34610d3a5760e0366003190112610d3a576004356001600160401b038111610d3857610109903690600401612842565b906024356001600160401b038111610d3857610129903690600401612842565b916064356001600160401b038111610d3457610149903690600401612842565b906084356001600160401b038111610d3057610169903690600401612842565b9160a4356001600160401b038111610d2c57610189903690600401612842565b60c4356001600160401b038111610d28576101a8903690600401612842565b906101b1612b3d565b600354946101be8661298e565b600355604051976101ce896127d6565b85895260208901526044356040890152836060890152608088015260a087015260c08601526020946040516102038782612806565b85815260e08201526040516102188782612806565b858152610100820152846101208201526040516102358782612806565b858152610140820152846101608201526001610180820152846101a082015283855260018652604085209481518051906001600160401b0382116107d157819061027f895461289e565b601f8111610cdd575b508990601f8311600114610c76578492610c6b575b50508160011b915f199060031b1c19161786555b60208201518051906001600160401b0382116107d15781906102d660018a015461289e565b601f8111610c1d575b508990601f8311600114610bb5578492610baa575b50508160011b915f199060031b1c19161760018701555b6040820151600287015560608201518051906001600160401b0382116107d157819061033a60038a015461289e565b601f8111610b5c575b508990601f8311600114610af4578492610ae9575b50508160011b915f199060031b1c19161760038701555b60808201518051906001600160401b0382116107d157819061039460048a015461289e565b601f8111610a9b575b508990601f8311600114610a33578492610a28575b50508160011b915f199060031b1c19161760048701555b60a08201518051906001600160401b0382116107d15781906103ee60058a015461289e565b601f81116109da575b508990601f8311600114610972578492610967575b50508160011b915f199060031b1c19161760058701555b60c08201518051906001600160401b0382116107d157819061044860068a015461289e565b601f8111610919575b508990601f83116001146108b15784926108a6575b50508160011b915f199060031b1c19161760068701555b60e08201518051906001600160401b0382116107d15781906104a260078a015461289e565b601f8111610858575b508990601f83116001146107f05784926107e5575b50508160011b915f199060031b1c19161760078701555b6101008201518051906001600160401b0382116107d15781906104fd60088a015461289e565b601f8111610780575b508990601f831160011461071857849261070d575b50508160011b915f199060031b1c19161760088701555b6101208201516009870155600a860190610140830151908151916001600160401b0383116106f957610564845461289e565b601f81116106b6575b508991601f8411600114610635575f516020612b645f395f51905f52979561061f958561061299968c9d96600c966101a0969261062a575b50508160011b915f199060031b1c19161790555b6105f9600b85016105dd6101608401511515829060ff801983541691151516179055565b610180830151815461ff00191690151560081b61ff0016179055565b01519101556040519384936040855260408501906127b2565b90838203898501526127b2565b0390a2604051908152f35b015190505f806105a5565b9190601f1984168584528b8420935b8c8282106106a05750509561061f956001868c9d96600c966101a0966106129d9a5f516020612b645f395f51905f529f9d10610688575b505050811b0190556105b9565b01515f1960f88460031b161c191690555f808061067b565b6001859682939686015181550195019301610644565b8483528a8320601f850160051c8101918c86106106ef575b601f0160051c01905b8181106106e4575061056d565b8381556001016106d7565b90915081906106ce565b634e487b7160e01b82526041600452602482fd5b015190505f8061051b565b60088a0185528a85209250601f198416855b8c82821061076a575050908460019594939210610752575b505050811b016008870155610532565b01515f1960f88460031b161c191690555f8080610742565b600185968293968601518155019501930161072a565b909150600889018452898420601f840160051c8101918b85106107c7575b90601f859493920160051c01905b8181106107b95750610506565b8581558493506001016107ac565b909150819061079e565b634e487b7160e01b83526041600452602483fd5b015190505f806104c0565b60078a0185528a85209250601f198416855b8c82821061084257505090846001959493921061082a575b505050811b0160078701556104d7565b01515f1960f88460031b161c191690555f808061081a565b6001859682939686015181550195019301610802565b909150600789018452898420601f840160051c81018b851061089f575b90849392915b601f830160051c820181106108915750506104ab565b86815585945060010161087b565b5080610875565b015190505f80610466565b60068a0185528a85209250601f198416855b8c8282106109035750509084600195949392106108eb575b505050811b01600687015561047d565b01515f1960f88460031b161c191690555f80806108db565b60018596829396860151815501950193016108c3565b909150600689018452898420601f840160051c81018b8510610960575b90849392915b601f830160051c82018110610952575050610451565b86815585945060010161093c565b5080610936565b015190505f8061040c565b60058a0185528a85209250601f198416855b8c8282106109c45750509084600195949392106109ac575b505050811b016005870155610423565b01515f1960f88460031b161c191690555f808061099c565b6001859682939686015181550195019301610984565b909150600589018452898420601f840160051c81018b8510610a21575b90849392915b601f830160051c82018110610a135750506103f7565b8681558594506001016109fd565b50806109f7565b015190505f806103b2565b60048a0185528a85209250601f198416855b8c828210610a85575050908460019594939210610a6d575b505050811b0160048701556103c9565b01515f1960f88460031b161c191690555f8080610a5d565b6001859682939686015181550195019301610a45565b909150600489018452898420601f840160051c81018b8510610ae2575b90849392915b601f830160051c82018110610ad457505061039d565b868155859450600101610abe565b5080610ab8565b015190505f80610358565b60038a0185528a85209250601f198416855b8c828210610b46575050908460019594939210610b2e575b505050811b01600387015561036f565b01515f1960f88460031b161c191690555f8080610b1e565b6001859682939686015181550195019301610b06565b909150600389018452898420601f840160051c81018b8510610ba3575b90849392915b601f830160051c82018110610b95575050610343565b868155859450600101610b7f565b5080610b79565b015190505f806102f4565b60018a0185528a85209250601f198416855b8c828210610c07575050908460019594939210610bef575b505050811b01600187015561030b565b01515f1960f88460031b161c191690555f8080610bdf565b6001859682939686015181550195019301610bc7565b909150600189018452898420601f840160051c81018b8510610c64575b90849392915b601f830160051c82018110610c565750506102df565b868155859450600101610c40565b5080610c3a565b015190505f8061029d565b92508884528984209084935b8b601f1985168610610cc457506001945083601f19811610610cac575b505050811b0186556102b1565b01515f1960f88460031b161c191690555f8080610c9f565b8282015184559485019460019093019290910190610c82565b909150888452898420601f840160051c81018b8510610d21575b90849392915b601f830160051c82018110610d13575050610288565b868155859450600101610cfd565b5080610cf7565b8580fd5b8480fd5b8380fd5b8280fd5b505b80fd5b5034610d3a576040366003190112610d3a5760209060ff906040906001600160a01b03610d68612888565b16815260028452818120602435825284522054166040519015158152f35b5034610d3a576020366003190112610d3a57610da0612888565b610da8612b3d565b6001600160a01b03168015610df85781546001600160a01b03198116821783556001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b631e4fbdf760e01b82526004829052602482fd5b5034610d3a576020366003190112610d3a57600435610e29612b3d565b808252600160205260ff600b60408420015460081c1615610e5e578152600160205260408120600b01805461ff001916905580f35b60405162461bcd60e51b8152602060048201526016602482015275517565737420616c726561647920696e61637469766560501b6044820152606490fd5b5034610d3a576020366003190112610d3a576004358152600160205260409020610ec5816128d6565b610ed1600183016128d6565b91600281015460038201610ee4906128d6565b610ef0600484016128d6565b610efc600585016128d6565b610f08600686016128d6565b610f14600787016128d6565b90610f21600888016128d6565b92600988015494600a8901610f35906128d6565b96600b8a015499600c0154986040519c8d9c8d6101c081526101c001610f5a916127b2565b8d810360208f0152610f6b916127b2565b9060408d01528b810360608d0152610f82916127b2565b8a810360808c0152610f93916127b2565b89810360a08b0152610fa4916127b2565b88810360c08a0152610fb5916127b2565b87810360e0890152610fc6916127b2565b868103610100880152610fd8916127b2565b90610120860152848103610140860152610ff1916127b2565b9160ff8116151561016085015260081c60ff1615156101808401526101a08301520390f35b5034610d3a5780600319360112610d3a57600454600554600654604080516001600160a01b0394851681529284166020840152921691810191909152306060820152608090f35b5034610d3a5780600319360112610d3a57546040516001600160a01b039091168152602090f35b5034610d3a5780600319360112610d3a576020600354604051908152f35b5034610d3a5780600319360112610d3a576110bb612b3d565b80546001600160a01b03198116825581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b5034610d3a57610120366003190112610d3a576004356001600160401b038111610d385761112e903690600401612842565b6024356001600160401b038111610d345761114d903690600401612842565b6064356001600160401b038111610d305761116c903690600401612842565b906084356001600160401b038111610d2c5761118c903690600401612842565b9260c4356001600160401b038111610d28576111ac903690600401612842565b60e435908115158203611d5557610104356001600160401b038111611d51576111d9903690600401612842565b956111e2612b3d565b600354956111ef8761298e565b600355604051956111ff876127d6565b85875260208701526044356040870152611217612a31565b606087015260209760405161122c8a82612806565b8a815260808801526040516112418a82612806565b8a815260a088015260c087015260e086015261010085015260a43561012085015261014084015215156101608301526001610180830152846101a0830152828552600184526040852082518051906001600160401b0382116118a25781906112a9845461289e565b601f8111611d06575b508790601f8311600114611c9f578992611c94575b50508160011b915f199060031b1c19161781555b60208301518051906001600160401b0382116118a2578190611300600185015461289e565b601f8111611c46575b508790601f8311600114611bd9578992611bce575b50508160011b915f199060031b1c19161760018201555b6040830151600282015560608301518051906001600160401b0382116118a2578190611364600385015461289e565b601f8111611b80575b508790601f8311600114611b13578992611b08575b50508160011b915f199060031b1c19161760038201555b60808301518051906001600160401b0382116118a25781906113be600485015461289e565b601f8111611aba575b508790601f8311600114611a4d578992611a42575b50508160011b915f199060031b1c19161760048201555b60a08301518051906001600160401b0382116118a2578190611418600585015461289e565b601f81116119f4575b508790601f831160011461198757899261197c575b50508160011b915f199060031b1c19161760058201555b60c08301518051906001600160401b0382116118a2578190611472600685015461289e565b601f811161192e575b508790601f83116001146118c15789926118b6575b50508160011b915f199060031b1c19161760068201555b60e08301518051906001600160401b0382116118a25781906114cc600785015461289e565b601f8111611851575b508790601f83116001146117e45789926117d9575b50508160011b915f199060031b1c19161760078201555b600881016101008401518051906001600160401b03821161170a578190611528845461289e565b601f811161178b575b508890601f8311600114611729578a9261171e575b50508160011b915f199060031b1c19161790555b6101208301516009820155600a8101926101408101518051906001600160401b03821161170a5761158b865461289e565b601f81116116c7575b50969795969495879589916001601f85111461164c579280600c95935f516020612b645f395f51905f52999a936101a09692611641575b50508160011b915f199060031b1c19161790555b611603600b85016105dd6101608401511515829060ff801983541691151516179055565b0151910155604061161c815192828452828401906127b2565b65383630bcb2b960d11b878483039283828701526006815201520190a2604051908152f35b015190505f806115cb565b9190601f1984168984528b8420935b8c8282106116ae57505093600c95935f516020612b645f395f51905f52999a93600193836101a09810611696575b505050811b0190556115df565b01515f1960f88460031b161c191690555f8080611689565b8484015186558c9a50600190950194938401930161165b565b868a52888a20601f840160051c8101918a8510611700575b601f0160051c01905b8181106116f55750611594565b8a81556001016116e8565b90915081906116df565b634e487b7160e01b89526041600452602489fd5b015190505f80611546565b848b52898b209250601f1984168b5b8b82821061177557505090846001959493921061175d575b505050811b01905561155a565b01515f1960f88460031b161c191690555f8080611750565b6001859682939686015181550195019301611738565b909150838a52888a20601f840160051c8101918a85106117cf575b90601f859493920160051c01905b8181106117c15750611531565b8b81558493506001016117b4565b90915081906117a6565b015190505f806114ea565b92506007840189528789209089935b89601f198516861061183857506001945083601f19811610611820575b505050811b016007820155611501565b01515f1960f88460031b161c191690555f8080611810565b82820151845594850194600190930192909101906117f3565b909150600784018952878920601f840160051c810191898510611898575b90601f859493920160051c01905b81811061188a57506114d5565b8a815584935060010161187d565b909150819061186f565b634e487b7160e01b88526041600452602488fd5b015190505f80611490565b92506006840189528789209089935b89601f198516861061191557506001945083601f198116106118fd575b505050811b0160068201556114a7565b01515f1960f88460031b161c191690555f80806118ed565b82820151845594850194600190930192909101906118d0565b909150600684018952878920601f840160051c8101898510611975575b90849392915b601f830160051c8201811061196757505061147b565b8b8155859450600101611951565b508061194b565b015190505f80611436565b92506005840189528789209089935b89601f19851686106119db57506001945083601f198116106119c3575b505050811b01600582015561144d565b01515f1960f88460031b161c191690555f80806119b3565b8282015184559485019460019093019290910190611996565b909150600584018952878920601f840160051c8101898510611a3b575b90849392915b601f830160051c82018110611a2d575050611421565b8b8155859450600101611a17565b5080611a11565b015190505f806113dc565b92506004840189528789209089935b89601f1985168610611aa157506001945083601f19811610611a89575b505050811b0160048201556113f3565b01515f1960f88460031b161c191690555f8080611a79565b8282015184559485019460019093019290910190611a5c565b909150600484018952878920601f840160051c8101898510611b01575b90849392915b601f830160051c82018110611af35750506113c7565b8b8155859450600101611add565b5080611ad7565b015190505f80611382565b92506003840189528789209089935b89601f1985168610611b6757506001945083601f19811610611b4f575b505050811b016003820155611399565b01515f1960f88460031b161c191690555f8080611b3f565b8282015184559485019460019093019290910190611b22565b909150600384018952878920601f840160051c8101898510611bc7575b90849392915b601f830160051c82018110611bb957505061136d565b8b8155859450600101611ba3565b5080611b9d565b015190505f8061131e565b92506001840189528789209089935b89601f1985168610611c2d57506001945083601f19811610611c15575b505050811b016001820155611335565b01515f1960f88460031b161c191690555f8080611c05565b8282015184559485019460019093019290910190611be8565b909150600184018952878920601f840160051c8101898510611c8d575b90849392915b601f830160051c82018110611c7f575050611309565b8b8155859450600101611c69565b5080611c63565b015190505f806112c7565b92508389528789209089935b89601f1985168610611ced57506001945083601f19811610611cd5575b505050811b0181556112db565b01515f1960f88460031b161c191690555f8080611cc8565b8282015184559485019460019093019290910190611cab565b909150838952878920601f840160051c8101898510611d4a575b90849392915b601f830160051c82018110611d3c5750506112b2565b8b8155859450600101611d26565b5080611d20565b8780fd5b8680fd5b5034610d3a5780600319360112610d3a576004546040516001600160a01b039091168152602090f35b503461227157602036600319011261227157600435805f52600160205260ff600b60405f20015460081c161561232857335f52600260205260405f20815f5260205260ff60405f2054166122ef576024602060018060a01b0360045416604051928380926355138f0d60e11b82523060048301525afa908115612266575f916122d0575b501561227557805f52600160205260405f20335f52600260205260405f20825f5260205260405f20600160ff19825416179055600c8101611e47815461298e565b90556004546002820180549092916001600160a01b031690813b15612271575f916044839260405194859384926340c10f1960e01b845233600485015260248401525af1801561226657612251575b5060038101604051611eb381611eac81856129b0565b0382612806565b60208151910120611ec2612a31565b60208151910120145f1461203157506006546001600160a01b03168015611ff65781602091611f618760096006960154611f7b60ff600b870154166040519889978896879563a905b12960e01b875233600488015260e06024880152611f46611f3160e48901600786016129b0565b8881036003190160448a0152600885016129b0565b906064880152600319878203016084880152600a83016129b0565b92151560a48601528483036003190160c4860152016129b0565b03925af18015611feb57611fbc575b505b546040519081527fe0b5124b12e878158288d1002ed1fb960faff0ec1c7b3168f86d9d1afd1b0d8b60203392a380f35b611fdd9060203d602011611fe4575b611fd58183612806565b810190612a55565b505f611f8a565b503d611fcb565b6040513d86823e3d90fd5b60405162461bcd60e51b8152602060048201526013602482015272119bdbdd18985b1b139195081b9bdd081cd95d606a1b6044820152606490fd5b612044611eac91604051928380926129b0565b602081519101209060409160056020845161205f8682612806565b8281520164626164676560d81b8152201461207c575b5050611f8c565b600554825163aa2fe91b60e01b81523060048201526001600160a01b0390911690602081602481855afa908115612247578791612218575b50156121be5761217f9291602091612164886120cf89612a64565b9386519788958694859362b7160160e61b8552336004860152610140602486015260068b61211c6121076101448901600486016129b0565b8881036003190160448a0152600585016129b0565b603c888203600319810160648b0152600b83526a28bab2b9ba102837bbb2b960a91b8f840152603260848b01528a60a48b0152600360c48b01520160e48901520191016129b0565b600161010485015283810360031901610124850152906127b2565b03925af19081156121b55750612196575b80612075565b6121ae9060203d602011611fe457611fd58183612806565b505f612190565b513d86823e3d90fd5b825162461bcd60e51b815260206004820152602d60248201527f51756573744d616e61676572206e6f7420617574686f72697a656420746f206d60448201526c696e742042616467654e46547360981b6064820152608490fd5b61223a915060203d602011612240575b6122328183612806565b810190612976565b5f6120b4565b503d612228565b84513d89823e3d90fd5b61225e9194505f90612806565b5f925f611e96565b6040513d5f823e3d90fd5b5f80fd5b60405162461bcd60e51b815260206004820152602d60248201527f51756573744d616e61676572206e6f7420617574686f72697a656420746f206d60448201526c696e74204d6565546f6b656e7360981b6064820152608490fd5b6122e9915060203d602011612240576122328183612806565b5f611e06565b60405162461bcd60e51b8152602060048201526011602482015270105b1c9958591e4818dbdb5c1b195d1959607a1b6044820152606490fd5b60405162461bcd60e51b815260206004820152600e60248201526d517565737420696e61637469766560901b6044820152606490fd5b346122715760203660031901126122715760405161237b816127d6565b606081526020810160609052604081015f90526060810160609052608081016060905260a081016060905260c081016060905260e081016060905261010081016060905261012081015f905261014081016060905261016081015f905261018081015f90526101a0015f90526004355f52600160205260405f20604051612401816127d6565b61240a826128d6565b8152612418600183016128d6565b916020820192835260028101546040830190815260038201612439906128d6565b606084019081529061244d600484016128d6565b60808501908152612460600585016128d6565b60a0860190815290612474600686016128d6565b60c08701908152612487600787016128d6565b60e0880190815261249a600888016128d6565b9161010089019283526009880154946101208a01958652600a89016124be906128d6565b946101408b01958652600b8a0154976101608c019a60ff8a1615158c526101808d019960081c60ff1615158a52600c0154996101a08d019a8b52604051809e819e6020835251602083016101c090526101e0830161251b916127b2565b9051828203601f1901604084015261253391906127b2565b9251606090910152518c8203601f190160808e015261255291906127b2565b90518b8203601f190160a08d015261256a91906127b2565b90518a8203601f190160c08c015261258291906127b2565b9051898203601f190160e08b015261259a91906127b2565b9051888203601f19016101008a01526125b391906127b2565b9051878203601f19016101208901526125cc91906127b2565b915161014087015251858203601f19016101608701526125ec91906127b2565b925115156101808501525115156101a0840152516101c08301520390f35b34612271575f366003190112612271576005546040516001600160a01b039091168152602090f35b34612271575f366003190112612271576024602060018060a01b0360045416604051928380926355138f0d60e11b82523060048301525afa8015612266576024915f91612770575b5060055460405163aa2fe91b60e01b81523060048201529260209184919082906001600160a01b03165afa8015612266576024925f91612751575b50600654604051634211c96160e11b81523060048201529360209185919082906001600160a01b03165afa908115612266576080935f92612730575b508280612727575b8361271e575b6040519315158452151560208401521515604083015215156060820152f35b925081926126ff565b925080926126f9565b61274a91925060203d602011612240576122328183612806565b90846126f1565b61276a915060203d602011612240576122328183612806565b836126b5565b612789915060203d602011612240576122328183612806565b8261267a565b34612271575f366003190112612271576006546001600160a01b03168152602090f35b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b6101c081019081106001600160401b038211176127f257604052565b634e487b7160e01b5f52604160045260245ffd5b90601f801991011681019081106001600160401b038211176127f257604052565b6001600160401b0381116127f257601f01601f191660200190565b81601f820112156122715780359061285982612827565b926128676040519485612806565b8284526020838301011161227157815f926020809301838601378301015290565b600435906001600160a01b038216820361227157565b90600182811c921680156128cc575b60208310146128b857565b634e487b7160e01b5f52602260045260245ffd5b91607f16916128ad565b9060405191825f8254926128e98461289e565b80845293600181169081156129545750600114612910575b5061290e92500383612806565b565b90505f9291925260205f20905f915b81831061293857505090602061290e928201015f612901565b602091935080600191548385890101520191019091849261291f565b90506020925061290e94915060ff191682840152151560051b8201015f612901565b90816020910312612271575180151581036122715790565b5f19811461299c5760010190565b634e487b7160e01b5f52601160045260245ffd5b5f92918154916129bf8361289e565b8083529260018116908115612a1457506001146129db57505050565b5f9081526020812093945091925b8383106129fa575060209250010190565b6001816020929493945483858701015201910191906129e9565b915050602093945060ff929192191683830152151560051b010190565b60405190612a40604083612806565b6006825265383630bcb2b960d11b6020830152565b90816020910312612271575190565b8015612b1d575f81805b612b095750612a7c81612827565b90612a8a6040519283612806565b808252601f19612a9982612827565b013660208401375b80928015612b02575f19820191821161299c578193600a8206603001928360301161299c5784511115612aee57600a9260f81b6001600160f81b0319165f1a908401601f01530491612aa1565b634e487b7160e01b5f52603260045260245ffd5b5050905090565b90612b15600a9161298e565b910480612a6e565b50604051612b2c604082612806565b60018152600360fc1b602082015290565b5f546001600160a01b03163303612b5057565b63118cdaa760e01b5f523360045260245ffdfe5873af79ad2855095709e4952730b178b7c8c9290ebce0d50bb100007633f7f6a2646970667358221220ab460355c312b7f0a69d89128e4eb43c00b07dd997e36b2c2076f50c7a0665cd64736f6c634300081c0033",
  deployedBytecode: "0x6080806040526004361015610012575f80fd5b5f905f3560e01c908163378295331461278f5750806339527ea8146126325780634348e0e91461260a57806349f86f341461235e578063528be0a914611d82578063656bbbfa14611d595780636b85a35d146110fc578063715018a6146110a25780637d7591f0146110845780638da5cb5b1461105d578063953874d214611016578063aa995c2c14610d3d578063e085f98014610e9c578063e9d2821d14610e0c578063f2fde38b14610d86578063f8be734714610d3d5763ff8b17be146100d9575f80fd5b34610d3a5760e0366003190112610d3a576004356001600160401b038111610d3857610109903690600401612842565b906024356001600160401b038111610d3857610129903690600401612842565b916064356001600160401b038111610d3457610149903690600401612842565b906084356001600160401b038111610d3057610169903690600401612842565b9160a4356001600160401b038111610d2c57610189903690600401612842565b60c4356001600160401b038111610d28576101a8903690600401612842565b906101b1612b3d565b600354946101be8661298e565b600355604051976101ce896127d6565b85895260208901526044356040890152836060890152608088015260a087015260c08601526020946040516102038782612806565b85815260e08201526040516102188782612806565b858152610100820152846101208201526040516102358782612806565b858152610140820152846101608201526001610180820152846101a082015283855260018652604085209481518051906001600160401b0382116107d157819061027f895461289e565b601f8111610cdd575b508990601f8311600114610c76578492610c6b575b50508160011b915f199060031b1c19161786555b60208201518051906001600160401b0382116107d15781906102d660018a015461289e565b601f8111610c1d575b508990601f8311600114610bb5578492610baa575b50508160011b915f199060031b1c19161760018701555b6040820151600287015560608201518051906001600160401b0382116107d157819061033a60038a015461289e565b601f8111610b5c575b508990601f8311600114610af4578492610ae9575b50508160011b915f199060031b1c19161760038701555b60808201518051906001600160401b0382116107d157819061039460048a015461289e565b601f8111610a9b575b508990601f8311600114610a33578492610a28575b50508160011b915f199060031b1c19161760048701555b60a08201518051906001600160401b0382116107d15781906103ee60058a015461289e565b601f81116109da575b508990601f8311600114610972578492610967575b50508160011b915f199060031b1c19161760058701555b60c08201518051906001600160401b0382116107d157819061044860068a015461289e565b601f8111610919575b508990601f83116001146108b15784926108a6575b50508160011b915f199060031b1c19161760068701555b60e08201518051906001600160401b0382116107d15781906104a260078a015461289e565b601f8111610858575b508990601f83116001146107f05784926107e5575b50508160011b915f199060031b1c19161760078701555b6101008201518051906001600160401b0382116107d15781906104fd60088a015461289e565b601f8111610780575b508990601f831160011461071857849261070d575b50508160011b915f199060031b1c19161760088701555b6101208201516009870155600a860190610140830151908151916001600160401b0383116106f957610564845461289e565b601f81116106b6575b508991601f8411600114610635575f516020612b645f395f51905f52979561061f958561061299968c9d96600c966101a0969261062a575b50508160011b915f199060031b1c19161790555b6105f9600b85016105dd6101608401511515829060ff801983541691151516179055565b610180830151815461ff00191690151560081b61ff0016179055565b01519101556040519384936040855260408501906127b2565b90838203898501526127b2565b0390a2604051908152f35b015190505f806105a5565b9190601f1984168584528b8420935b8c8282106106a05750509561061f956001868c9d96600c966101a0966106129d9a5f516020612b645f395f51905f529f9d10610688575b505050811b0190556105b9565b01515f1960f88460031b161c191690555f808061067b565b6001859682939686015181550195019301610644565b8483528a8320601f850160051c8101918c86106106ef575b601f0160051c01905b8181106106e4575061056d565b8381556001016106d7565b90915081906106ce565b634e487b7160e01b82526041600452602482fd5b015190505f8061051b565b60088a0185528a85209250601f198416855b8c82821061076a575050908460019594939210610752575b505050811b016008870155610532565b01515f1960f88460031b161c191690555f8080610742565b600185968293968601518155019501930161072a565b909150600889018452898420601f840160051c8101918b85106107c7575b90601f859493920160051c01905b8181106107b95750610506565b8581558493506001016107ac565b909150819061079e565b634e487b7160e01b83526041600452602483fd5b015190505f806104c0565b60078a0185528a85209250601f198416855b8c82821061084257505090846001959493921061082a575b505050811b0160078701556104d7565b01515f1960f88460031b161c191690555f808061081a565b6001859682939686015181550195019301610802565b909150600789018452898420601f840160051c81018b851061089f575b90849392915b601f830160051c820181106108915750506104ab565b86815585945060010161087b565b5080610875565b015190505f80610466565b60068a0185528a85209250601f198416855b8c8282106109035750509084600195949392106108eb575b505050811b01600687015561047d565b01515f1960f88460031b161c191690555f80806108db565b60018596829396860151815501950193016108c3565b909150600689018452898420601f840160051c81018b8510610960575b90849392915b601f830160051c82018110610952575050610451565b86815585945060010161093c565b5080610936565b015190505f8061040c565b60058a0185528a85209250601f198416855b8c8282106109c45750509084600195949392106109ac575b505050811b016005870155610423565b01515f1960f88460031b161c191690555f808061099c565b6001859682939686015181550195019301610984565b909150600589018452898420601f840160051c81018b8510610a21575b90849392915b601f830160051c82018110610a135750506103f7565b8681558594506001016109fd565b50806109f7565b015190505f806103b2565b60048a0185528a85209250601f198416855b8c828210610a85575050908460019594939210610a6d575b505050811b0160048701556103c9565b01515f1960f88460031b161c191690555f8080610a5d565b6001859682939686015181550195019301610a45565b909150600489018452898420601f840160051c81018b8510610ae2575b90849392915b601f830160051c82018110610ad457505061039d565b868155859450600101610abe565b5080610ab8565b015190505f80610358565b60038a0185528a85209250601f198416855b8c828210610b46575050908460019594939210610b2e575b505050811b01600387015561036f565b01515f1960f88460031b161c191690555f8080610b1e565b6001859682939686015181550195019301610b06565b909150600389018452898420601f840160051c81018b8510610ba3575b90849392915b601f830160051c82018110610b95575050610343565b868155859450600101610b7f565b5080610b79565b015190505f806102f4565b60018a0185528a85209250601f198416855b8c828210610c07575050908460019594939210610bef575b505050811b01600187015561030b565b01515f1960f88460031b161c191690555f8080610bdf565b6001859682939686015181550195019301610bc7565b909150600189018452898420601f840160051c81018b8510610c64575b90849392915b601f830160051c82018110610c565750506102df565b868155859450600101610c40565b5080610c3a565b015190505f8061029d565b92508884528984209084935b8b601f1985168610610cc457506001945083601f19811610610cac575b505050811b0186556102b1565b01515f1960f88460031b161c191690555f8080610c9f565b8282015184559485019460019093019290910190610c82565b909150888452898420601f840160051c81018b8510610d21575b90849392915b601f830160051c82018110610d13575050610288565b868155859450600101610cfd565b5080610cf7565b8580fd5b8480fd5b8380fd5b8280fd5b505b80fd5b5034610d3a576040366003190112610d3a5760209060ff906040906001600160a01b03610d68612888565b16815260028452818120602435825284522054166040519015158152f35b5034610d3a576020366003190112610d3a57610da0612888565b610da8612b3d565b6001600160a01b03168015610df85781546001600160a01b03198116821783556001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b631e4fbdf760e01b82526004829052602482fd5b5034610d3a576020366003190112610d3a57600435610e29612b3d565b808252600160205260ff600b60408420015460081c1615610e5e578152600160205260408120600b01805461ff001916905580f35b60405162461bcd60e51b8152602060048201526016602482015275517565737420616c726561647920696e61637469766560501b6044820152606490fd5b5034610d3a576020366003190112610d3a576004358152600160205260409020610ec5816128d6565b610ed1600183016128d6565b91600281015460038201610ee4906128d6565b610ef0600484016128d6565b610efc600585016128d6565b610f08600686016128d6565b610f14600787016128d6565b90610f21600888016128d6565b92600988015494600a8901610f35906128d6565b96600b8a015499600c0154986040519c8d9c8d6101c081526101c001610f5a916127b2565b8d810360208f0152610f6b916127b2565b9060408d01528b810360608d0152610f82916127b2565b8a810360808c0152610f93916127b2565b89810360a08b0152610fa4916127b2565b88810360c08a0152610fb5916127b2565b87810360e0890152610fc6916127b2565b868103610100880152610fd8916127b2565b90610120860152848103610140860152610ff1916127b2565b9160ff8116151561016085015260081c60ff1615156101808401526101a08301520390f35b5034610d3a5780600319360112610d3a57600454600554600654604080516001600160a01b0394851681529284166020840152921691810191909152306060820152608090f35b5034610d3a5780600319360112610d3a57546040516001600160a01b039091168152602090f35b5034610d3a5780600319360112610d3a576020600354604051908152f35b5034610d3a5780600319360112610d3a576110bb612b3d565b80546001600160a01b03198116825581906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b5034610d3a57610120366003190112610d3a576004356001600160401b038111610d385761112e903690600401612842565b6024356001600160401b038111610d345761114d903690600401612842565b6064356001600160401b038111610d305761116c903690600401612842565b906084356001600160401b038111610d2c5761118c903690600401612842565b9260c4356001600160401b038111610d28576111ac903690600401612842565b60e435908115158203611d5557610104356001600160401b038111611d51576111d9903690600401612842565b956111e2612b3d565b600354956111ef8761298e565b600355604051956111ff876127d6565b85875260208701526044356040870152611217612a31565b606087015260209760405161122c8a82612806565b8a815260808801526040516112418a82612806565b8a815260a088015260c087015260e086015261010085015260a43561012085015261014084015215156101608301526001610180830152846101a0830152828552600184526040852082518051906001600160401b0382116118a25781906112a9845461289e565b601f8111611d06575b508790601f8311600114611c9f578992611c94575b50508160011b915f199060031b1c19161781555b60208301518051906001600160401b0382116118a2578190611300600185015461289e565b601f8111611c46575b508790601f8311600114611bd9578992611bce575b50508160011b915f199060031b1c19161760018201555b6040830151600282015560608301518051906001600160401b0382116118a2578190611364600385015461289e565b601f8111611b80575b508790601f8311600114611b13578992611b08575b50508160011b915f199060031b1c19161760038201555b60808301518051906001600160401b0382116118a25781906113be600485015461289e565b601f8111611aba575b508790601f8311600114611a4d578992611a42575b50508160011b915f199060031b1c19161760048201555b60a08301518051906001600160401b0382116118a2578190611418600585015461289e565b601f81116119f4575b508790601f831160011461198757899261197c575b50508160011b915f199060031b1c19161760058201555b60c08301518051906001600160401b0382116118a2578190611472600685015461289e565b601f811161192e575b508790601f83116001146118c15789926118b6575b50508160011b915f199060031b1c19161760068201555b60e08301518051906001600160401b0382116118a25781906114cc600785015461289e565b601f8111611851575b508790601f83116001146117e45789926117d9575b50508160011b915f199060031b1c19161760078201555b600881016101008401518051906001600160401b03821161170a578190611528845461289e565b601f811161178b575b508890601f8311600114611729578a9261171e575b50508160011b915f199060031b1c19161790555b6101208301516009820155600a8101926101408101518051906001600160401b03821161170a5761158b865461289e565b601f81116116c7575b50969795969495879589916001601f85111461164c579280600c95935f516020612b645f395f51905f52999a936101a09692611641575b50508160011b915f199060031b1c19161790555b611603600b85016105dd6101608401511515829060ff801983541691151516179055565b0151910155604061161c815192828452828401906127b2565b65383630bcb2b960d11b878483039283828701526006815201520190a2604051908152f35b015190505f806115cb565b9190601f1984168984528b8420935b8c8282106116ae57505093600c95935f516020612b645f395f51905f52999a93600193836101a09810611696575b505050811b0190556115df565b01515f1960f88460031b161c191690555f8080611689565b8484015186558c9a50600190950194938401930161165b565b868a52888a20601f840160051c8101918a8510611700575b601f0160051c01905b8181106116f55750611594565b8a81556001016116e8565b90915081906116df565b634e487b7160e01b89526041600452602489fd5b015190505f80611546565b848b52898b209250601f1984168b5b8b82821061177557505090846001959493921061175d575b505050811b01905561155a565b01515f1960f88460031b161c191690555f8080611750565b6001859682939686015181550195019301611738565b909150838a52888a20601f840160051c8101918a85106117cf575b90601f859493920160051c01905b8181106117c15750611531565b8b81558493506001016117b4565b90915081906117a6565b015190505f806114ea565b92506007840189528789209089935b89601f198516861061183857506001945083601f19811610611820575b505050811b016007820155611501565b01515f1960f88460031b161c191690555f8080611810565b82820151845594850194600190930192909101906117f3565b909150600784018952878920601f840160051c810191898510611898575b90601f859493920160051c01905b81811061188a57506114d5565b8a815584935060010161187d565b909150819061186f565b634e487b7160e01b88526041600452602488fd5b015190505f80611490565b92506006840189528789209089935b89601f198516861061191557506001945083601f198116106118fd575b505050811b0160068201556114a7565b01515f1960f88460031b161c191690555f80806118ed565b82820151845594850194600190930192909101906118d0565b909150600684018952878920601f840160051c8101898510611975575b90849392915b601f830160051c8201811061196757505061147b565b8b8155859450600101611951565b508061194b565b015190505f80611436565b92506005840189528789209089935b89601f19851686106119db57506001945083601f198116106119c3575b505050811b01600582015561144d565b01515f1960f88460031b161c191690555f80806119b3565b8282015184559485019460019093019290910190611996565b909150600584018952878920601f840160051c8101898510611a3b575b90849392915b601f830160051c82018110611a2d575050611421565b8b8155859450600101611a17565b5080611a11565b015190505f806113dc565b92506004840189528789209089935b89601f1985168610611aa157506001945083601f19811610611a89575b505050811b0160048201556113f3565b01515f1960f88460031b161c191690555f8080611a79565b8282015184559485019460019093019290910190611a5c565b909150600484018952878920601f840160051c8101898510611b01575b90849392915b601f830160051c82018110611af35750506113c7565b8b8155859450600101611add565b5080611ad7565b015190505f80611382565b92506003840189528789209089935b89601f1985168610611b6757506001945083601f19811610611b4f575b505050811b016003820155611399565b01515f1960f88460031b161c191690555f8080611b3f565b8282015184559485019460019093019290910190611b22565b909150600384018952878920601f840160051c8101898510611bc7575b90849392915b601f830160051c82018110611bb957505061136d565b8b8155859450600101611ba3565b5080611b9d565b015190505f8061131e565b92506001840189528789209089935b89601f1985168610611c2d57506001945083601f19811610611c15575b505050811b016001820155611335565b01515f1960f88460031b161c191690555f8080611c05565b8282015184559485019460019093019290910190611be8565b909150600184018952878920601f840160051c8101898510611c8d575b90849392915b601f830160051c82018110611c7f575050611309565b8b8155859450600101611c69565b5080611c63565b015190505f806112c7565b92508389528789209089935b89601f1985168610611ced57506001945083601f19811610611cd5575b505050811b0181556112db565b01515f1960f88460031b161c191690555f8080611cc8565b8282015184559485019460019093019290910190611cab565b909150838952878920601f840160051c8101898510611d4a575b90849392915b601f830160051c82018110611d3c5750506112b2565b8b8155859450600101611d26565b5080611d20565b8780fd5b8680fd5b5034610d3a5780600319360112610d3a576004546040516001600160a01b039091168152602090f35b503461227157602036600319011261227157600435805f52600160205260ff600b60405f20015460081c161561232857335f52600260205260405f20815f5260205260ff60405f2054166122ef576024602060018060a01b0360045416604051928380926355138f0d60e11b82523060048301525afa908115612266575f916122d0575b501561227557805f52600160205260405f20335f52600260205260405f20825f5260205260405f20600160ff19825416179055600c8101611e47815461298e565b90556004546002820180549092916001600160a01b031690813b15612271575f916044839260405194859384926340c10f1960e01b845233600485015260248401525af1801561226657612251575b5060038101604051611eb381611eac81856129b0565b0382612806565b60208151910120611ec2612a31565b60208151910120145f1461203157506006546001600160a01b03168015611ff65781602091611f618760096006960154611f7b60ff600b870154166040519889978896879563a905b12960e01b875233600488015260e06024880152611f46611f3160e48901600786016129b0565b8881036003190160448a0152600885016129b0565b906064880152600319878203016084880152600a83016129b0565b92151560a48601528483036003190160c4860152016129b0565b03925af18015611feb57611fbc575b505b546040519081527fe0b5124b12e878158288d1002ed1fb960faff0ec1c7b3168f86d9d1afd1b0d8b60203392a380f35b611fdd9060203d602011611fe4575b611fd58183612806565b810190612a55565b505f611f8a565b503d611fcb565b6040513d86823e3d90fd5b60405162461bcd60e51b8152602060048201526013602482015272119bdbdd18985b1b139195081b9bdd081cd95d606a1b6044820152606490fd5b612044611eac91604051928380926129b0565b602081519101209060409160056020845161205f8682612806565b8281520164626164676560d81b8152201461207c575b5050611f8c565b600554825163aa2fe91b60e01b81523060048201526001600160a01b0390911690602081602481855afa908115612247578791612218575b50156121be5761217f9291602091612164886120cf89612a64565b9386519788958694859362b7160160e61b8552336004860152610140602486015260068b61211c6121076101448901600486016129b0565b8881036003190160448a0152600585016129b0565b603c888203600319810160648b0152600b83526a28bab2b9ba102837bbb2b960a91b8f840152603260848b01528a60a48b0152600360c48b01520160e48901520191016129b0565b600161010485015283810360031901610124850152906127b2565b03925af19081156121b55750612196575b80612075565b6121ae9060203d602011611fe457611fd58183612806565b505f612190565b513d86823e3d90fd5b825162461bcd60e51b815260206004820152602d60248201527f51756573744d616e61676572206e6f7420617574686f72697a656420746f206d60448201526c696e742042616467654e46547360981b6064820152608490fd5b61223a915060203d602011612240575b6122328183612806565b810190612976565b5f6120b4565b503d612228565b84513d89823e3d90fd5b61225e9194505f90612806565b5f925f611e96565b6040513d5f823e3d90fd5b5f80fd5b60405162461bcd60e51b815260206004820152602d60248201527f51756573744d616e61676572206e6f7420617574686f72697a656420746f206d60448201526c696e74204d6565546f6b656e7360981b6064820152608490fd5b6122e9915060203d602011612240576122328183612806565b5f611e06565b60405162461bcd60e51b8152602060048201526011602482015270105b1c9958591e4818dbdb5c1b195d1959607a1b6044820152606490fd5b60405162461bcd60e51b815260206004820152600e60248201526d517565737420696e61637469766560901b6044820152606490fd5b346122715760203660031901126122715760405161237b816127d6565b606081526020810160609052604081015f90526060810160609052608081016060905260a081016060905260c081016060905260e081016060905261010081016060905261012081015f905261014081016060905261016081015f905261018081015f90526101a0015f90526004355f52600160205260405f20604051612401816127d6565b61240a826128d6565b8152612418600183016128d6565b916020820192835260028101546040830190815260038201612439906128d6565b606084019081529061244d600484016128d6565b60808501908152612460600585016128d6565b60a0860190815290612474600686016128d6565b60c08701908152612487600787016128d6565b60e0880190815261249a600888016128d6565b9161010089019283526009880154946101208a01958652600a89016124be906128d6565b946101408b01958652600b8a0154976101608c019a60ff8a1615158c526101808d019960081c60ff1615158a52600c0154996101a08d019a8b52604051809e819e6020835251602083016101c090526101e0830161251b916127b2565b9051828203601f1901604084015261253391906127b2565b9251606090910152518c8203601f190160808e015261255291906127b2565b90518b8203601f190160a08d015261256a91906127b2565b90518a8203601f190160c08c015261258291906127b2565b9051898203601f190160e08b015261259a91906127b2565b9051888203601f19016101008a01526125b391906127b2565b9051878203601f19016101208901526125cc91906127b2565b915161014087015251858203601f19016101608701526125ec91906127b2565b925115156101808501525115156101a0840152516101c08301520390f35b34612271575f366003190112612271576005546040516001600160a01b039091168152602090f35b34612271575f366003190112612271576024602060018060a01b0360045416604051928380926355138f0d60e11b82523060048301525afa8015612266576024915f91612770575b5060055460405163aa2fe91b60e01b81523060048201529260209184919082906001600160a01b03165afa8015612266576024925f91612751575b50600654604051634211c96160e11b81523060048201529360209185919082906001600160a01b03165afa908115612266576080935f92612730575b508280612727575b8361271e575b6040519315158452151560208401521515604083015215156060820152f35b925081926126ff565b925080926126f9565b61274a91925060203d602011612240576122328183612806565b90846126f1565b61276a915060203d602011612240576122328183612806565b836126b5565b612789915060203d602011612240576122328183612806565b8261267a565b34612271575f366003190112612271576006546001600160a01b03168152602090f35b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b6101c081019081106001600160401b038211176127f257604052565b634e487b7160e01b5f52604160045260245ffd5b90601f801991011681019081106001600160401b038211176127f257604052565b6001600160401b0381116127f257601f01601f191660200190565b81601f820112156122715780359061285982612827565b926128676040519485612806565b8284526020838301011161227157815f926020809301838601378301015290565b600435906001600160a01b038216820361227157565b90600182811c921680156128cc575b60208310146128b857565b634e487b7160e01b5f52602260045260245ffd5b91607f16916128ad565b9060405191825f8254926128e98461289e565b80845293600181169081156129545750600114612910575b5061290e92500383612806565b565b90505f9291925260205f20905f915b81831061293857505090602061290e928201015f612901565b602091935080600191548385890101520191019091849261291f565b90506020925061290e94915060ff191682840152151560051b8201015f612901565b90816020910312612271575180151581036122715790565b5f19811461299c5760010190565b634e487b7160e01b5f52601160045260245ffd5b5f92918154916129bf8361289e565b8083529260018116908115612a1457506001146129db57505050565b5f9081526020812093945091925b8383106129fa575060209250010190565b6001816020929493945483858701015201910191906129e9565b915050602093945060ff929192191683830152151560051b010190565b60405190612a40604083612806565b6006825265383630bcb2b960d11b6020830152565b90816020910312612271575190565b8015612b1d575f81805b612b095750612a7c81612827565b90612a8a6040519283612806565b808252601f19612a9982612827565b013660208401375b80928015612b02575f19820191821161299c578193600a8206603001928360301161299c5784511115612aee57600a9260f81b6001600160f81b0319165f1a908401601f01530491612aa1565b634e487b7160e01b5f52603260045260245ffd5b5050905090565b90612b15600a9161298e565b910480612a6e565b50604051612b2c604082612806565b60018152600360fc1b602082015290565b5f546001600160a01b03163303612b5057565b63118cdaa760e01b5f523360045260245ffdfe5873af79ad2855095709e4952730b178b7c8c9290ebce0d50bb100007633f7f6a2646970667358221220ab460355c312b7f0a69d89128e4eb43c00b07dd997e36b2c2076f50c7a0665cd64736f6c634300081c0033",
  linkReferences: {},
  deployedLinkReferences: {},
  immutableReferences: {},
  inputSourceName: "project/contracts/QuestManager.sol",
  buildInfoId: "solc-0_8_28-5e6938fe94469a3f5a4e87d999d59d35de2d4bac"
};

// server/api/quest-management.ts
init_deploy_config();
async function createQuest(req, res) {
  try {
    const deployRegistry = getDeployConfig();
    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: "Contract configuration missing"
      });
    }
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || "https://sepolia.optimism.io";
    if (!privateKey) {
      return res.status(500).json({
        success: false,
        error: "Server configuration missing - no private key"
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
        error: "Missing required fields: name, description, rewardAmount, rewardType"
      });
    }
    const provider = new ethers2.JsonRpcProvider(rpcUrl);
    const wallet = new ethers2.Wallet(privateKey, provider);
    const contract = new ethers2.Contract(
      deployRegistry.contracts.QuestManager,
      QuestManager_default.abi,
      wallet
    );
    const tx = await contract.createQuest(
      name,
      description,
      ethers2.parseEther(rewardAmount.toString()),
      rewardType,
      badgeName || "",
      badgeDescription || "",
      badgeTokenURI || ""
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
  } catch (error) {
    console.error("Create quest error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create quest"
    });
  }
}
async function completeQuest(req, res) {
  try {
    const deployRegistry = getDeployConfig();
    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: "Contract configuration missing"
      });
    }
    const { questId } = req.params;
    const { userAddress, privateKey: userPrivateKey } = req.body;
    if (!userAddress || !userPrivateKey) {
      return res.status(400).json({
        success: false,
        error: "Missing userAddress or privateKey"
      });
    }
    const rpcUrl = process.env.RPC_URL || "https://sepolia.optimism.io";
    const provider = new ethers2.JsonRpcProvider(rpcUrl);
    const wallet = new ethers2.Wallet(userPrivateKey, provider);
    const contract = new ethers2.Contract(
      deployRegistry.contracts.QuestManager,
      QuestManager_default.abi,
      wallet
    );
    const hasCompleted = await contract.hasCompletedQuest(userAddress, questId);
    if (hasCompleted) {
      return res.status(400).json({
        success: false,
        error: "Quest already completed"
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
        message: "Quest completed successfully! Badge and tokens minted."
      }
    });
  } catch (error) {
    console.error("Complete quest error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to complete quest"
    });
  }
}
async function getQuestStatus(req, res) {
  try {
    const deployRegistry = getDeployConfig();
    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: "Contract configuration missing"
      });
    }
    const { questId, userAddress } = req.params;
    const rpcUrl = process.env.RPC_URL || "https://sepolia.optimism.io";
    const provider = new ethers2.JsonRpcProvider(rpcUrl);
    const contract = new ethers2.Contract(
      deployRegistry.contracts.QuestManager,
      QuestManager_default.abi,
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
        rewardAmount: ethers2.formatEther(quest.rewardAmount),
        rewardType: quest.rewardType,
        isActive: quest.isActive,
        completions: Number(quest.completions),
        userCompleted: hasCompleted,
        userStatus: hasCompleted ? "completed" : quest.isActive ? "available" : "inactive"
      }
    });
  } catch (error) {
    console.error("Get quest status error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to get quest status"
    });
  }
}
async function getAllQuestsWithUserStatus(req, res) {
  try {
    const deployRegistry = getDeployConfig();
    if (!deployRegistry?.contracts?.QuestManager) {
      return res.status(500).json({
        success: false,
        error: "Contract configuration missing"
      });
    }
    const { userAddress } = req.query;
    const rpcUrl = process.env.RPC_URL || "https://sepolia.optimism.io";
    const provider = new ethers2.JsonRpcProvider(rpcUrl);
    const contract = new ethers2.Contract(
      deployRegistry.contracts.QuestManager,
      QuestManager_default.abi,
      provider
    );
    const questCount = await contract.questCounter();
    const quests = [];
    for (let i = 0; i < questCount; i++) {
      const quest = await contract.getQuest(i);
      let userCompleted = false;
      if (userAddress && typeof userAddress === "string") {
        userCompleted = await contract.hasCompletedQuest(userAddress, i);
      }
      quests.push({
        questId: i,
        name: quest.name,
        description: quest.description,
        rewardAmount: ethers2.formatEther(quest.rewardAmount),
        rewardType: quest.rewardType,
        badgeName: quest.badgeName,
        badgeDescription: quest.badgeDescription,
        isActive: quest.isActive,
        completions: Number(quest.completions),
        userCompleted,
        userStatus: userCompleted ? "completed" : quest.isActive ? "available" : "inactive"
      });
    }
    return res.json({
      success: true,
      data: quests
    });
  } catch (error) {
    console.error("Get all quests error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to get quests"
    });
  }
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
  const { getRPCHealth: getRPCHealth2, switchRPC: switchRPC2 } = await Promise.resolve().then(() => (init_rpc_health(), rpc_health_exports));
  app2.get("/api/rpc/health", getRPCHealth2);
  app2.post("/api/rpc/switch", switchRPC2);
  const { checkAuthorizations: checkAuthorizations2, updateAuthorizations: updateAuthorizations2 } = await Promise.resolve().then(() => (init_contract_auth(), contract_auth_exports));
  app2.get("/api/contracts/authorizations", checkAuthorizations2);
  app2.post("/api/contracts/authorizations/update", updateAuthorizations2);
  const { mintBadge: mintBadge2, getBadgesByUser: getBadgesByUser2 } = await Promise.resolve().then(() => (init_badge_mint(), badge_mint_exports));
  app2.post("/api/badge/mint", mintBadge2);
  app2.get("/api/badge/user/:address", getBadgesByUser2);
  const { getQuestList: getQuestListFromContract, completeQuestAPI: completeQuestAPI2 } = await Promise.resolve().then(() => (init_quest_list(), quest_list_exports));
  app2.post("/api/quest/complete", completeQuestAPI2);
  app2.get("/api/quest/list", getQuestListFromContract);
  app2.post("/api/quest/create", createQuest);
  app2.post("/api/quest/:questId/complete", completeQuest);
  app2.get("/api/quest/:questId/status/:userAddress", getQuestStatus);
  app2.get("/api/quests/all", getAllQuestsWithUserStatus);
  const { mintToken: mintToken2 } = await Promise.resolve().then(() => (init_token_mint(), token_mint_exports));
  app2.post("/api/token/mint", mintToken2);
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

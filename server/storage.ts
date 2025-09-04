import { 
  type User, type InsertUser, 
  type Wallet, type InsertWallet, 
  type OnboardingProgress, type InsertOnboardingProgress,
  type Token, type InsertToken,
  type UserTokenBalance, type InsertUserTokenBalance,
  type Mission, type InsertMission,
  type UserMission, type InsertUserMission
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserBySocialId(socialId: string, provider: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Wallet operations
  getWalletByUserId(userId: string): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWallet(id: string, updates: Partial<InsertWallet>): Promise<Wallet | undefined>;
  
  // Onboarding operations
  getOnboardingProgress(userId: string): Promise<OnboardingProgress | undefined>;
  createOnboardingProgress(progress: InsertOnboardingProgress): Promise<OnboardingProgress>;
  updateOnboardingProgress(userId: string, updates: Partial<InsertOnboardingProgress>): Promise<OnboardingProgress | undefined>;
  
  // Token operations
  getTokens(): Promise<Token[]>;
  getTokenByAddress(address: string, chainId: string): Promise<Token | undefined>;
  createToken(token: InsertToken): Promise<Token>;
  
  // User token balance operations
  getUserTokenBalance(userId: string, tokenId: string): Promise<UserTokenBalance | undefined>;
  getUserTokenBalances(userId: string): Promise<UserTokenBalance[]>;
  updateUserTokenBalance(userId: string, tokenId: string, updates: Partial<InsertUserTokenBalance>): Promise<UserTokenBalance>;
  
  // Mission operations
  getMissions(): Promise<Mission[]>;
  getMission(id: string): Promise<Mission | undefined>;
  createMission(mission: InsertMission): Promise<Mission>;
  
  // User mission operations
  getUserMissions(userId: string): Promise<UserMission[]>;
  getUserMission(userId: string, missionId: string): Promise<UserMission | undefined>;
  createUserMission(userMission: InsertUserMission): Promise<UserMission>;
  updateUserMission(id: string, updates: Partial<InsertUserMission>): Promise<UserMission | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private wallets: Map<string, Wallet>;
  private onboardingProgress: Map<string, OnboardingProgress>;
  private tokens: Map<string, Token>;
  private userTokenBalances: Map<string, UserTokenBalance>;
  private missions: Map<string, Mission>;
  private userMissions: Map<string, UserMission>;

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.onboardingProgress = new Map();
    this.tokens = new Map();
    this.userTokenBalances = new Map();
    this.missions = new Map();
    this.userMissions = new Map();
    
    // Initialize with default tokens and missions
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Add the Fuse Network token
    const fuseToken = await this.createToken({
      address: "0xa669b1F45F84368fBe48882bF8d1814aae7a4422",
      chainId: "122",
      symbol: "FUSE",
      name: "Fuse Token",
      decimals: "18",
      logoUri: "https://cryptologos.cc/logos/fuse-fuse-logo.png",
      isTestToken: false,
      isRewardEligible: true,
    });

    // Add demo token for testing
    const demoToken = await this.createToken({
      address: "0x0000000000000000000000000000000000000001",
      chainId: "122",
      symbol: "MEE",
      name: "MeeChain Token",
      decimals: "18",
      logoUri: null,
      isTestToken: true,
      isRewardEligible: true,
    });

    // Initialize missions
    await this.createMission({
      id: "create_wallet",
      title: "สร้าง Smart Wallet",
      description: "สร้าง Smart Wallet พร้อมใช้งานครั้งแรก",
      rewardType: "token",
      rewardAmount: "100",
      rewardTokenId: demoToken.id,
      isActive: true,
    });

    await this.createMission({
      id: "connect_dapp",
      title: "เชื่อมต่อ DApp ครั้งแรก",
      description: "เชื่อมต่อกับ DApp ภายนอกผ่าน WalletConnect",
      rewardType: "token",
      rewardAmount: "10",
      rewardTokenId: fuseToken.id,
      isActive: true,
    });

    await this.createMission({
      id: "enable_biometric",
      title: "เปิดใช้งาน Biometric",
      description: "เปิดใช้งานการยืนยันตัวตนด้วยลายนิ้วมือ",
      rewardType: "token",
      rewardAmount: "50",
      rewardTokenId: demoToken.id,
      isActive: true,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserBySocialId(socialId: string, provider: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.socialId === socialId && user.provider === provider,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      email: insertUser.email ?? null,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      profileImageUrl: insertUser.profileImageUrl ?? null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getWalletByUserId(userId: string): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.userId === userId,
    );
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = randomUUID();
    const wallet: Wallet = { 
      ...insertWallet,
      type: insertWallet.type ?? "smart",
      biometricEnabled: insertWallet.biometricEnabled ?? false,
      pinHash: insertWallet.pinHash ?? null,
      id,
      createdAt: new Date(),
    };
    this.wallets.set(id, wallet);
    return wallet;
  }

  async updateWallet(id: string, updates: Partial<InsertWallet>): Promise<Wallet | undefined> {
    const wallet = this.wallets.get(id);
    if (!wallet) return undefined;
    
    const updatedWallet = { ...wallet, ...updates };
    this.wallets.set(id, updatedWallet);
    return updatedWallet;
  }

  async getOnboardingProgress(userId: string): Promise<OnboardingProgress | undefined> {
    return Array.from(this.onboardingProgress.values()).find(
      (progress) => progress.userId === userId,
    );
  }

  async createOnboardingProgress(insertProgress: InsertOnboardingProgress): Promise<OnboardingProgress> {
    const id = randomUUID();
    const progress: OnboardingProgress = { 
      ...insertProgress,
      mode: insertProgress.mode ?? null,
      currentStep: insertProgress.currentStep ?? "1",
      completedSteps: insertProgress.completedSteps ?? [],
      isCompleted: insertProgress.isCompleted ?? false,
      firstMissionCompleted: insertProgress.firstMissionCompleted ?? false,
      id,
      updatedAt: new Date(),
    };
    this.onboardingProgress.set(id, progress);
    return progress;
  }

  async updateOnboardingProgress(userId: string, updates: Partial<InsertOnboardingProgress>): Promise<OnboardingProgress | undefined> {
    const existing = await this.getOnboardingProgress(userId);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.onboardingProgress.set(existing.id, updated);
    return updated;
  }

  // Token operations
  async getTokens(): Promise<Token[]> {
    return Array.from(this.tokens.values());
  }

  async getTokenByAddress(address: string, chainId: string): Promise<Token | undefined> {
    return Array.from(this.tokens.values()).find(
      (token) => token.address.toLowerCase() === address.toLowerCase() && token.chainId === chainId
    );
  }

  async createToken(insertToken: InsertToken): Promise<Token> {
    const id = randomUUID();
    const token: Token = { 
      ...insertToken,
      decimals: insertToken.decimals ?? "18",
      logoUri: insertToken.logoUri ?? null,
      isTestToken: insertToken.isTestToken ?? true,
      isRewardEligible: insertToken.isRewardEligible ?? true,
      id,
      createdAt: new Date(),
    };
    this.tokens.set(id, token);
    return token;
  }

  // User token balance operations
  async getUserTokenBalance(userId: string, tokenId: string): Promise<UserTokenBalance | undefined> {
    return Array.from(this.userTokenBalances.values()).find(
      (balance) => balance.userId === userId && balance.tokenId === tokenId
    );
  }

  async getUserTokenBalances(userId: string): Promise<UserTokenBalance[]> {
    return Array.from(this.userTokenBalances.values()).filter(
      (balance) => balance.userId === userId
    );
  }

  async updateUserTokenBalance(userId: string, tokenId: string, updates: Partial<InsertUserTokenBalance>): Promise<UserTokenBalance> {
    const existing = await this.getUserTokenBalance(userId, tokenId);
    
    if (existing) {
      const updated = { 
        ...existing, 
        ...updates, 
        updatedAt: new Date() 
      };
      this.userTokenBalances.set(existing.id, updated);
      return updated;
    } else {
      // Create new balance record
      const id = randomUUID();
      const newBalance: UserTokenBalance = {
        id,
        userId,
        tokenId,
        balance: updates.balance ?? "0",
        lastFaucetClaim: updates.lastFaucetClaim ?? null,
        totalEarned: updates.totalEarned ?? "0",
        updatedAt: new Date(),
      };
      this.userTokenBalances.set(id, newBalance);
      return newBalance;
    }
  }

  // Mission operations
  async getMissions(): Promise<Mission[]> {
    return Array.from(this.missions.values()).filter(mission => mission.isActive);
  }

  async getMission(id: string): Promise<Mission | undefined> {
    return this.missions.get(id);
  }

  async createMission(insertMission: InsertMission): Promise<Mission> {
    const mission: Mission = { 
      ...insertMission,
      description: insertMission.description ?? null,
      rewardTokenId: insertMission.rewardTokenId ?? null,
      isActive: insertMission.isActive ?? true,
      createdAt: new Date(),
    };
    this.missions.set(mission.id, mission);
    return mission;
  }

  // User mission operations
  async getUserMissions(userId: string): Promise<UserMission[]> {
    return Array.from(this.userMissions.values()).filter(
      (userMission) => userMission.userId === userId
    );
  }

  async getUserMission(userId: string, missionId: string): Promise<UserMission | undefined> {
    return Array.from(this.userMissions.values()).find(
      (userMission) => userMission.userId === userId && userMission.missionId === missionId
    );
  }

  async createUserMission(insertUserMission: InsertUserMission): Promise<UserMission> {
    const id = randomUUID();
    const userMission: UserMission = { 
      ...insertUserMission,
      status: insertUserMission.status ?? "pending",
      completedAt: insertUserMission.completedAt ?? null,
      claimedAt: insertUserMission.claimedAt ?? null,
      proof: insertUserMission.proof ?? null,
      id,
      createdAt: new Date(),
    };
    this.userMissions.set(id, userMission);
    return userMission;
  }

  async updateUserMission(id: string, updates: Partial<InsertUserMission>): Promise<UserMission | undefined> {
    const userMission = this.userMissions.get(id);
    if (!userMission) return undefined;
    
    const updated = { ...userMission, ...updates };
    this.userMissions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();

import { type User, type InsertUser, type Wallet, type InsertWallet, type OnboardingProgress, type InsertOnboardingProgress } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private wallets: Map<string, Wallet>;
  private onboardingProgress: Map<string, OnboardingProgress>;

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.onboardingProgress = new Map();
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
}

export const storage = new MemStorage();

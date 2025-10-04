import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  socialId: text("social_id").notNull().unique(),
  provider: text("provider").notNull(), // google, facebook, line
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  address: text("address").notNull(),
  type: text("type").notNull().default("smart"), // smart, eoa
  biometricEnabled: boolean("biometric_enabled").default(false),
  pinHash: text("pin_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const onboardingProgress = pgTable("onboarding_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  currentStep: text("current_step").notNull().default("1"),
  completedSteps: jsonb("completed_steps").default("[]"),
  isCompleted: boolean("is_completed").default(false),
  mode: text("mode"), // demo, live
  firstMissionCompleted: boolean("first_mission_completed").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
});

export const insertOnboardingProgressSchema = createInsertSchema(onboardingProgress).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertOnboardingProgress = z.infer<typeof insertOnboardingProgressSchema>;
export type OnboardingProgress = typeof onboardingProgress.$inferSelect;

// Token Registry for ERC-20 tokens
export const tokens = pgTable("tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull(),
  chainId: text("chain_id").notNull(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  decimals: text("decimals").notNull().default("18"),
  logoUri: text("logo_uri"),
  isTestToken: boolean("is_test_token").default(true),
  isRewardEligible: boolean("is_reward_eligible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User token balances (for tracking rewards and faucet claims)
export const userTokenBalances = pgTable("user_token_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  tokenId: varchar("token_id").notNull().references(() => tokens.id),
  balance: text("balance").notNull().default("0"),
  lastFaucetClaim: timestamp("last_faucet_claim"),
  totalEarned: text("total_earned").notNull().default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mission system
export const missions = pgTable("missions", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  rewardType: text("reward_type").notNull(), // token, gas_credit, badge_nft, tier_unlock
  rewardAmount: text("reward_amount").notNull(),
  rewardTokenId: varchar("reward_token_id").references(() => tokens.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User mission progress
export const userMissions = pgTable("user_missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  missionId: varchar("mission_id").notNull().references(() => missions.id),
  status: text("status").notNull().default("pending"), // pending, completed, claimed
  completedAt: timestamp("completed_at"),
  claimedAt: timestamp("claimed_at"),
  proof: jsonb("proof"), // txHash, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTokenSchema = createInsertSchema(tokens).omit({
  id: true,
  createdAt: true,
});

export const insertUserTokenBalanceSchema = createInsertSchema(userTokenBalances).omit({
  id: true,
  updatedAt: true,
});

export const insertMissionSchema = createInsertSchema(missions).omit({
  createdAt: true,
});

export const insertUserMissionSchema = createInsertSchema(userMissions).omit({
  id: true,
  createdAt: true,
});

export type InsertToken = z.infer<typeof insertTokenSchema>;
export type Token = typeof tokens.$inferSelect;
export type InsertUserTokenBalance = z.infer<typeof insertUserTokenBalanceSchema>;
export type UserTokenBalance = typeof userTokenBalances.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Mission = typeof missions.$inferSelect;
export type InsertUserMission = z.infer<typeof insertUserMissionSchema>;
export type UserMission = typeof userMissions.$inferSelect;

// Badge & NFT System
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  rarity: text("rarity").notNull(), // Common, Rare, Legendary
  category: text("category").notNull(), // achievement, quest, special, season
  isNFT: boolean("is_nft").default(false),
  contractAddress: text("contract_address"),
  tokenId: text("token_id"),
  powers: jsonb("powers"), // {type: "xp_boost", value: 10, condition: "night_quest"}
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User badge collection
export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  badgeId: varchar("badge_id").notNull().references(() => badges.id),
  mintedAt: timestamp("minted_at").defaultNow(),
  isEquipped: boolean("is_equipped").default(false),
  earnedFrom: text("earned_from"), // mission_id, quest_type, special_event
  metadata: jsonb("metadata"), // additional data like mint transaction hash
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  createdAt: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  mintedAt: true,
});

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;

// Badge Power Types
export type BadgePower = {
  type: 'xp_boost' | 'token_boost' | 'quest_unlock' | 'special_access';
  value: number;
  condition?: string;
  description: string;
};

/**
 * Contributor Reputation Service
 * Tracks contributor actions, manages reputation scores, and awards badges
 */

import { logEvent } from '../utils/logger.js'

export interface ContributorAction {
  type: 'refund_flag' | 'proposal_create' | 'audit_complete' | 'vote_cast' | 'dispute_resolve'
  refundId?: string
  proposalId?: string
  timestamp: Date
  valid: boolean
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: {
    type: string
    count: number
  }
  tokenId?: number
  contractAddress?: string
  metadataURI?: string
  mintedAt?: Date
}

export interface ContributorProfile {
  address: string
  name?: string
  score: number
  badges: Badge[]
  sbtTokens: Array<{
    tokenId: number
    name: string
    contractAddress: string
    metadataURI: string
  }>
  auditLogs: Array<{
    refundId: string
    status: string
    timestamp: Date
    action: string
  }>
  actions: ContributorAction[]
  joinedAt: Date
}

// Badge definitions
const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'watchdog',
    name: '🛡️ Watchdog',
    description: 'Awarded for flagging 5 valid refund logs',
    icon: '/badges/watchdog.png',
    requirement: { type: 'refund_flag', count: 5 }
  },
  {
    id: 'auditor',
    name: '🔍 Auditor',
    description: 'Awarded for completing 10 audit reviews',
    icon: '/badges/auditor.png',
    requirement: { type: 'audit_complete', count: 10 }
  },
  {
    id: 'proposer',
    name: '📝 Proposer',
    description: 'Awarded for creating 3 DAO proposals',
    icon: '/badges/proposer.png',
    requirement: { type: 'proposal_create', count: 3 }
  },
  {
    id: 'governor',
    name: '⚖️ Governor',
    description: 'Awarded for casting 20 votes in DAO proposals',
    icon: '/badges/governor.png',
    requirement: { type: 'vote_cast', count: 20 }
  },
  {
    id: 'mediator',
    name: '🤝 Mediator',
    description: 'Awarded for resolving 5 disputes',
    icon: '/badges/mediator.png',
    requirement: { type: 'dispute_resolve', count: 5 }
  }
]

// In-memory storage (in production, use database)
const contributorProfiles = new Map<string, ContributorProfile>()

/**
 * Get or create contributor profile
 */
export function getContributorProfile(address: string): ContributorProfile {
  if (!contributorProfiles.has(address)) {
    contributorProfiles.set(address, {
      address,
      score: 0,
      badges: [],
      sbtTokens: [],
      auditLogs: [],
      actions: [],
      joinedAt: new Date()
    })
  }
  return contributorProfiles.get(address)!
 * Tracks contributor actions, reputation scores, and badges
 */

export type ActionType = 
  | 'flag_created'
  | 'flag_validated'
  | 'flag_rejected'
  | 'refund_approved'
  | 'audit_completed';

export interface Badge {
  id: string;
  name: string;
  description: string;
  threshold: number;
  icon: string;
}

export interface ContributorAction {
  timestamp: Date;
  actionType: ActionType;
  context: Record<string, any>;
  scoreImpact: number;
}

export interface ContributorStats {
  address: string;
  name?: string;
  score: number;
  badges: string[];
  actions: ContributorAction[];
  totalFlags: number;
  validatedFlags: number;
  rejectedFlags: number;
}

// Badge definitions
const BADGES: Record<string, Badge> = {
  watchdog: {
    id: 'watchdog',
    name: 'Watchdog',
    description: 'Created 10+ validated flags',
    threshold: 10,
    icon: '🛡️'
  },
  truthSeeker: {
    id: 'truthSeeker',
    name: 'Truth Seeker',
    description: 'Maintained 90%+ flag validation rate',
    threshold: 0.9,
    icon: '🔍'
  },
  auditorOG: {
    id: 'auditorOG',
    name: 'Auditor OG',
    description: 'Reached reputation score of 1000+',
    threshold: 1000,
    icon: '👑'
  }
};

// Score impacts for different actions
const SCORE_IMPACTS: Record<ActionType, number> = {
  flag_created: 5,
  flag_validated: 50,
  flag_rejected: -20,
  refund_approved: 30,
  audit_completed: 20
};

// In-memory storage (can be replaced with database)
const contributors = new Map<string, ContributorStats>();

/**
 * Get or create contributor stats
 */
function getOrCreateContributor(address: string): ContributorStats {
  if (!contributors.has(address)) {
    contributors.set(address, {
      address,
      score: 0,
      badges: [],
      actions: [],
      totalFlags: 0,
      validatedFlags: 0,
      rejectedFlags: 0
    });
  }
  return contributors.get(address)!;
}

/**
 * Record a contributor action and update reputation
 */
export async function recordAction(
  address: string,
  action: ContributorAction
): Promise<{ 
  success: boolean
  newScore: number
  badgesUnlocked: Badge[]
}> {
  const profile = getContributorProfile(address)
  
  // Add action to history
  profile.actions.push(action)
  
  // Calculate score change
  const scoreChange = calculateScoreChange(action)
  profile.score += scoreChange
  
  logEvent('contributor-action-recorded', {
    address,
    actionType: action.type,
    valid: action.valid,
    scoreChange,
    newScore: profile.score
  }, 'debug')
  
  // Check for badge unlocks
  const badgesUnlocked = await checkBadgeUnlocks(address, profile)
  
  return {
    success: true,
    newScore: profile.score,
    badgesUnlocked
  }
}

/**
 * Calculate reputation score change based on action
 */
function calculateScoreChange(action: ContributorAction): number {
  if (!action.valid) return 0
  
  const scoreMap: Record<string, number> = {
    'refund_flag': 10,
    'proposal_create': 25,
    'audit_complete': 15,
    'vote_cast': 5,
    'dispute_resolve': 30
  }
  
  return scoreMap[action.type] || 0
}

/**
 * Check if contributor has unlocked any new badges
 */
async function checkBadgeUnlocks(
  address: string,
  profile: ContributorProfile
): Promise<Badge[]> {
  const unlockedBadges: Badge[] = []
  
  for (const badgeDef of BADGE_DEFINITIONS) {
    // Skip if already has this badge
    if (profile.badges.some(b => b.id === badgeDef.id)) {
      continue
    }
    
    // Count valid actions of required type
    const validActionCount = profile.actions.filter(
      a => a.type === badgeDef.requirement.type && a.valid
    ).length
    
    // Check if requirement met
    if (validActionCount >= badgeDef.requirement.count) {
      const unlockedBadge = { ...badgeDef }
      profile.badges.push(unlockedBadge)
      unlockedBadges.push(unlockedBadge)
      
      logEvent('badge-unlocked', {
        address,
        badgeId: badgeDef.id,
        badgeName: badgeDef.name
      })

      // Trigger NFT minting (async, don't wait)
      // Note: To avoid circular dependency, minting is triggered externally
      // See badgeMintingService.onBadgeUnlocked()
    }
  }
  
  return unlockedBadges
}

/**
 * Record audit log entry
 */
export function recordAuditLog(
  address: string,
  refundId: string,
  status: string,
  action: string
): void {
  const profile = getContributorProfile(address)
  profile.auditLogs.push({
    refundId,
    status,
    action,
    timestamp: new Date()
  })
  
  logEvent('audit-log-recorded', {
    address,
    refundId,
    status,
    action
  }, 'debug')
}

/**
 * Link SBT token to contributor profile
 */
export function linkSBTToken(
  address: string,
  tokenId: number,
  name: string,
  contractAddress: string,
  metadataURI: string
): void {
  const profile = getContributorProfile(address)
  
  // Update badge with token info
  const badge = profile.badges.find(b => b.name === name)
  if (badge) {
    badge.tokenId = tokenId
    badge.contractAddress = contractAddress
    badge.metadataURI = metadataURI
    badge.mintedAt = new Date()
  }
  
  // Add to SBT tokens list
  profile.sbtTokens.push({
    tokenId,
    name,
    contractAddress,
    metadataURI
  })
  
  logEvent('sbt-token-linked', {
    address,
    tokenId,
    name,
    contractAddress
  })
}

/**
 * Get all contributor profiles (for explorer)
 */
export function getAllContributors(): ContributorProfile[] {
  return Array.from(contributorProfiles.values())
    .sort((a, b) => b.score - a.score) // Sort by score descending
}

/**
 * Get leaderboard (top contributors)
 */
export function getLeaderboard(limit: number = 10): ContributorProfile[] {
  return getAllContributors().slice(0, limit)
}

/**
 * Get badge definitions
 */
export function getBadgeDefinitions(): Badge[] {
  return BADGE_DEFINITIONS
}

/**
 * Clear all contributor profiles (for testing only)
 */
export function clearAllProfiles(): void {
  contributorProfiles.clear()
export function recordAction(
  address: string,
  actionType: ActionType,
  context: Record<string, any> = {}
): ContributorStats {
  const contributor = getOrCreateContributor(address);
  
  const scoreImpact = SCORE_IMPACTS[actionType];
  
  const action: ContributorAction = {
    timestamp: new Date(),
    actionType,
    context,
    scoreImpact
  };
  
  contributor.actions.push(action);
  contributor.score += scoreImpact;
  
  // Update flag statistics
  if (actionType === 'flag_created') {
    contributor.totalFlags++;
  } else if (actionType === 'flag_validated') {
    contributor.validatedFlags++;
  } else if (actionType === 'flag_rejected') {
    contributor.rejectedFlags++;
  }
  
  // Evaluate badges
  evaluateBadges(contributor);
  
  return contributor;
}

/**
 * Evaluate and award badges based on contributor stats
 */
function evaluateBadges(contributor: ContributorStats): void {
  const newBadges: string[] = [];
  
  // Watchdog badge: 10+ validated flags
  if (contributor.validatedFlags >= BADGES.watchdog.threshold && 
      !contributor.badges.includes('watchdog')) {
    newBadges.push('watchdog');
  }
  
  // Truth Seeker badge: 90%+ validation rate
  if (contributor.totalFlags >= 10) {
    const validationRate = contributor.validatedFlags / contributor.totalFlags;
    if (validationRate >= BADGES.truthSeeker.threshold && 
        !contributor.badges.includes('truthSeeker')) {
      newBadges.push('truthSeeker');
    }
  }
  
  // Auditor OG badge: 1000+ reputation score
  if (contributor.score >= BADGES.auditorOG.threshold && 
      !contributor.badges.includes('auditorOG')) {
    newBadges.push('auditorOG');
  }
  
  contributor.badges.push(...newBadges);
}

/**
 * Get contributor stats by address
 */
export function getContributor(address: string): ContributorStats | null {
  return contributors.get(address) || null;
}

/**
 * Get all contributors
 */
export function getAllContributors(): ContributorStats[] {
  return Array.from(contributors.values());
}

/**
 * Get badge definition
 */
export function getBadge(badgeId: string): Badge | null {
  return BADGES[badgeId] || null;
}

/**
 * Get all badge definitions
 */
export function getAllBadges(): Badge[] {
  return Object.values(BADGES);
}

/**
 * Clear all contributor data (for testing)
 */
export function clearAllContributors(): void {
  contributors.clear();
}

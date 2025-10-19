/**
 * Contributor Reputation Service
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

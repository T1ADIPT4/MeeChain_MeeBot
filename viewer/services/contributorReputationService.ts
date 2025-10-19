/**
 * Contributor Reputation Service
 * จัดการคะแนน reputation และ badge ของผู้มีส่วนร่วม
 */

export interface ContributorData {
  address: string;
  name?: string;
  score: number;
  badges: string[];
  actions: ReputationAction[];
}

export interface ReputationAction {
  type: 'flag_submit' | 'flag_confirm' | 'flag_reject' | 'review_complete';
  timestamp: number;
  points: number;
  refundId?: string;
}

// Badge thresholds and definitions
const BADGE_THRESHOLDS = {
  'Watchdog': { minScore: 10, description: 'แจ้งเตือน flag 5 ครั้ง' },
  'Validator': { minScore: 50, description: 'ตรวจสอบ flag 20 ครั้ง' },
  'Guardian': { minScore: 100, description: 'ช่วยปกป้องระบบอย่างต่อเนื่อง' },
  'Champion': { minScore: 200, description: 'ผู้นำชุมชน' },
};

// Points for each action
const ACTION_POINTS = {
  'flag_submit': 2,
  'flag_confirm': 5,
  'flag_reject': 1,
  'review_complete': 10,
};

// In-memory storage (in production, use database or blockchain)
const contributors: Map<string, ContributorData> = new Map();

/**
 * Initialize or get contributor data
 */
export function getContributor(address: string): ContributorData {
  if (!contributors.has(address)) {
    contributors.set(address, {
      address,
      score: 0,
      badges: [],
      actions: [],
    });
  }
  return contributors.get(address)!;
}

/**
 * Record a reputation action
 */
export function recordAction(
  address: string,
  actionType: ReputationAction['type'],
  refundId?: string
): { contributor: ContributorData; newBadges: string[] } {
  const contributor = getContributor(address);
  const points = ACTION_POINTS[actionType];
  
  const action: ReputationAction = {
    type: actionType,
    timestamp: Date.now(),
    points,
    refundId,
  };

  contributor.actions.push(action);
  const oldScore = contributor.score;
  contributor.score += points;

  // Check for new badges
  const newBadges = checkForNewBadges(contributor, oldScore);
  
  return { contributor, newBadges };
}

/**
 * Check if contributor earned new badges
 */
function checkForNewBadges(contributor: ContributorData, oldScore: number): string[] {
  const newBadges: string[] = [];
  
  Object.entries(BADGE_THRESHOLDS).forEach(([badgeName, threshold]) => {
    // Check if just crossed threshold
    if (contributor.score >= threshold.minScore && 
        oldScore < threshold.minScore &&
        !contributor.badges.includes(badgeName)) {
      contributor.badges.push(badgeName);
      newBadges.push(badgeName);
    }
  });
  
  return newBadges;
}

/**
 * Get all contributors sorted by score
 */
export function getAllContributors(): ContributorData[] {
  return Array.from(contributors.values()).sort((a, b) => b.score - a.score);
}

/**
 * Get top N contributors
 */
export function getTopContributors(limit: number = 10): ContributorData[] {
  return getAllContributors().slice(0, limit);
}

/**
 * Get contributor rank
 */
export function getContributorRank(address: string): number {
  const sorted = getAllContributors();
  const index = sorted.findIndex(c => c.address === address);
  return index === -1 ? -1 : index + 1;
}

/**
 * Get badge information
 */
export function getBadgeInfo(badgeName: string) {
  return BADGE_THRESHOLDS[badgeName as keyof typeof BADGE_THRESHOLDS];
}

/**
 * Get all available badges
 */
export function getAllBadges() {
  return BADGE_THRESHOLDS;
}

// Mock data for testing
export function initMockData() {
  // Add some mock contributors for demo
  recordAction('0x1234567890abcdef', 'flag_submit');
  recordAction('0x1234567890abcdef', 'flag_submit');
  recordAction('0x1234567890abcdef', 'flag_submit');
  recordAction('0x1234567890abcdef', 'flag_submit');
  recordAction('0x1234567890abcdef', 'flag_submit');
  recordAction('0x1234567890abcdef', 'flag_confirm');
  
  recordAction('0xabcdef1234567890', 'flag_confirm');
  recordAction('0xabcdef1234567890', 'flag_confirm');
  recordAction('0xabcdef1234567890', 'flag_confirm');
  recordAction('0xabcdef1234567890', 'review_complete');
  recordAction('0xabcdef1234567890', 'review_complete');
  recordAction('0xabcdef1234567890', 'review_complete');
  recordAction('0xabcdef1234567890', 'review_complete');
  recordAction('0xabcdef1234567890', 'review_complete');
  
  recordAction('0xfedcba0987654321', 'flag_submit');
  recordAction('0xfedcba0987654321', 'flag_confirm');
  recordAction('0xfedcba0987654321', 'review_complete');
}


// (โค้ดเดิมทั้งหมดจะยังคงอยู่)
// ... (existing code) ...

// --- เพิ่มประเภทข้อมูลและฟังก์ชันสำหรับ Leaderboard ---

export interface LeaderboardEntry {
  rank: number;
  address: string;
  tier: number;
  badgeCount: number;
  isSpecialUser?: boolean; // Flag for our special user
}

/**
 * ดึงข้อมูลสำหรับ Leaderboard (จำลอง)
 * ในสถานการณ์จริง อาจจะต้องดึงข้อมูลจากหลาย contract หรือใช้ a caching layer
 */
export async function fetchLeaderboardData(): Promise<LeaderboardEntry[]> {
  console.log(`[BlockchainService] Fetching leaderboard data`);

  // สร้างข้อมูลผู้ใช้จำลอง
  const mockUsers = [
    { address: '0x1234...abcd', tier: 3, badgeCount: 15 },
    { address: '0x5678...efgh', tier: 2, badgeCount: 10 },
    { address: '0xabcd...1234', tier: 2, badgeCount: 12 },
    // เพิ่มผู้ใช้คนพิเศษของเราเข้าไปในข้อมูลจำลอง
    { address: '0xpouri...9028', tier: 1, badgeCount: 5 }, 
    { address: '0xefgh...5678', tier: 1, badgeCount: 3 },
    { address: '0x9999...aaaa', tier: 3, badgeCount: 18 },
  ];

  // จัดอันดับตาม Tier ก่อน แล้วตามด้วยจำนวน Badge
  const sortedUsers = mockUsers.sort((a, b) => {
    if (b.tier !== a.tier) {
      return b.tier - a.tier;
    }
    return b.badgeCount - a.badgeCount;
  });

  // สร้างผลลัพธ์พร้อม Rank
  return Promise.resolve(
    sortedUsers.map((user, index) => ({
      rank: index + 1,
      address: user.address,
      tier: user.tier,
      badgeCount: user.badgeCount,
      // เช็คว่าเป็นผู้ใช้คนพิเศษหรือไม่
      isSpecialUser: user.address.includes('pouri'),
    }))
  );
}

/**
 * Fetch user tier (mock)
 */
export async function fetchUserTier(userAddress: string): Promise<number> {
  console.log(`[BlockchainService] Fetching tier for ${userAddress}`);
  // Mock implementation - return a random tier between 1-3
  await new Promise(res => setTimeout(res, 500));
  return Math.floor(Math.random() * 3) + 1;
}

/**
 * Upgrade user tier (mock)
 */
export async function upgradeTier(userAddress: string): Promise<boolean> {
  console.log(`[BlockchainService] Upgrading tier for ${userAddress}`);
  // Mock implementation
  await new Promise(res => setTimeout(res, 1000));
  return Math.random() > 0.1; // 90% success rate
}

/**
 * Fetch owned badges (mock)
 * Returns badge IDs instead of names
 */
export async function fetchOwnedBadges(userAddress: string): Promise<number[]> {
  console.log(`[BlockchainService] Fetching owned badges for ${userAddress}`);
  // Mock implementation - in production, this would call badgeSBTContract.getBadgesOf(userAddress)
  await new Promise(res => setTimeout(res, 500));
  const mockBadgeIds = [1, 2, 3, 5, 6]; // Pioneer, Quest Master, Early Adopter, Flow Master, Token Holder
  const numBadges = Math.floor(Math.random() * mockBadgeIds.length) + 1;
  return mockBadgeIds.slice(0, numBadges);
}

/**
 * Fetch user quests (mock)
 */
export async function fetchUserQuests(userAddress: string): Promise<any[]> {
  console.log(`[BlockchainService] Fetching quests for ${userAddress}`);
  // Mock implementation
  await new Promise(res => setTimeout(res, 500));
  return [
    { id: 'quest-1', name: 'First Quest', status: 'completed' },
    { id: 'quest-2', name: 'Second Quest', status: 'in-progress' },
    { id: 'quest-3', name: 'Third Quest', status: 'not-started' },
  ];
}

/**
 * Check quest status (mock)
 */
export async function checkQuestStatus(userAddress: string, questId: string): Promise<string> {
  console.log(`[BlockchainService] Checking quest status for ${questId} and user ${userAddress}`);
  // Mock implementation
  await new Promise(res => setTimeout(res, 500));
  const statuses = ['not-started', 'in-progress', 'completed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

/**
 * Mint badge (mock)
 */
export async function mintBadge(userAddress: string, questId: string): Promise<{ success: boolean; badgeId?: number }> {
  console.log(`[BlockchainService] Minting badge for quest ${questId} to user ${userAddress}`);
  // Mock implementation
  await new Promise(res => setTimeout(res, 1000));
  const success = Math.random() > 0.1; // 90% success rate
  const badgeId = success ? Math.floor(Math.random() * 10) + 1 : undefined;
  return { success, badgeId };
}

/**
 * Fetch available quests (mock)
 */
export async function fetchAvailableQuests(userAddress: string): Promise<any[]> {
  console.log(`[BlockchainService] Fetching available quests for ${userAddress}`);
  // Mock implementation
  await new Promise(res => setTimeout(res, 500));
  return [
    { id: 'quest-1', name: 'Welcome Quest', reward: '100 MEE', status: 'available' },
    { id: 'quest-2', name: 'Trading Quest', reward: '200 MEE', status: 'available' },
    { id: 'quest-3', name: 'Community Quest', reward: '300 MEE', status: 'locked' },
  ];
}

/**
 * Fetch timeline events (mock)
 */
export async function fetchTimelineEvents(userAddress: string): Promise<any[]> {
  console.log(`[BlockchainService] Fetching timeline events for ${userAddress}`);
  // Mock implementation
  await new Promise(res => setTimeout(res, 500));
  return [
    { timestamp: Date.now() - 86400000, event: 'Quest Completed', details: 'Welcome Quest' },
    { timestamp: Date.now() - 172800000, event: 'Badge Minted', details: 'Pioneer Badge' },
    { timestamp: Date.now() - 259200000, event: 'Tier Upgraded', details: 'Tier 2' },
  ];
}

/**
 * Check if user has a specific badge (mock)
 * In production, this would call: badgeContract.methods.hasBadge(userAddress, badgeId).call()
 */
export async function hasBadge(userAddress: string, badgeId: number): Promise<boolean> {
  console.log(`[BlockchainService] Checking if ${userAddress} has badge ${badgeId}`);
  // Mock implementation
  await new Promise(res => setTimeout(res, 300));
  // Simulate some users having certain badges
  return Math.random() > 0.5;
}

/**
 * Get all badges for a user (mock)
 * In production, this would call: badgeContract.methods.getBadges(userAddress).call()
 */
export async function getUserBadgeIds(userAddress: string): Promise<number[]> {
  console.log(`[BlockchainService] Fetching badge IDs for ${userAddress}`);
  // Mock implementation
  await new Promise(res => setTimeout(res, 300));
  // Return mock badge IDs
  const mockBadgeIds = [1, 3, 5, 7];
  return mockBadgeIds.slice(0, Math.floor(Math.random() * 4) + 1);
}

/**
 * Get badge type by token ID (mock)
 * In production, this would call: badgeContract.methods.getBadgeType(tokenId).call()
 */
export async function getBadgeType(tokenId: number): Promise<string> {
  console.log(`[BlockchainService] Fetching badge type for token ${tokenId}`);
  // Mock implementation
  await new Promise(res => setTimeout(res, 200));
  const badgeTypes: Record<number, string> = {
    1: 'Watchdog',
    2: 'Pioneer',
    3: 'Quest Master',
    4: 'Early Adopter',
    5: 'Community Leader',
    6: 'Developer',
    7: 'Tester',
  };
  return badgeTypes[tokenId] || 'Unknown Badge';
}

/**
 * Example of how to use Web3 with badge contract in production
 * This is commented out as it requires Web3 setup
 */
/*
import Web3 from 'web3';

const web3 = new Web3(window.ethereum);
const badgeContractAddress = '0x...'; // Your deployed contract address
const badgeContractABI = [...]; // Your contract ABI

const badgeContract = new web3.eth.Contract(badgeContractABI, badgeContractAddress);

// Check if user has a badge
export async function hasBadge(userAddress: string, badgeId: number): Promise<boolean> {
  try {
    const hasIt = await badgeContract.methods.hasBadge(userAddress, badgeId).call();
    return hasIt;
  } catch (error) {
    console.error('Error checking badge:', error);
    return false;
  }
}

// Get all badges for a user
export async function getUserBadges(userAddress: string): Promise<number[]> {
  try {
    const badges = await badgeContract.methods.getBadges(userAddress).call();
    return badges;
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
}
*/

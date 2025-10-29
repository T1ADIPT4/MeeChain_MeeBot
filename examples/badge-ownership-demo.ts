/**
 * Badge Ownership Demo
 * Demonstrates how to use the MeeChainBadge contract and Contributor Explorer
 */

// Mock Web3 interaction (in production, use actual Web3 library)
interface BadgeContract {
  hasBadge(user: string, badgeId: number): Promise<boolean>;
  getBadges(user: string): Promise<number[]>;
  getBadgeType(tokenId: number): Promise<string>;
  totalSupply(): Promise<number>;
}

// Badge IDs
const BADGE_IDS = {
  WATCHDOG: 1,
  PIONEER: 2,
  QUEST_MASTER: 3,
  EARLY_ADOPTER: 4,
  COMMUNITY_LEADER: 5,
};

// Mock badge contract
const createBadgeContract = (): BadgeContract => {
  // Mock implementation
  const mockUserBadges: Record<string, number[]> = {
    '0x1234567890abcdef1234567890abcdef12345678': [1, 2, 3],
    '0xabcdef1234567890abcdef1234567890abcdef12': [1, 4],
  };

  const mockBadgeTypes: Record<number, string> = {
    1: 'Watchdog',
    2: 'Pioneer',
    3: 'Quest Master',
    4: 'Early Adopter',
    5: 'Community Leader',
  };

  return {
    hasBadge: async (user: string, badgeId: number): Promise<boolean> => {
      const badges = mockUserBadges[user] || [];
      return badges.includes(badgeId);
    },

    getBadges: async (user: string): Promise<number[]> => {
      return mockUserBadges[user] || [];
    },

    getBadgeType: async (tokenId: number): Promise<string> => {
      return mockBadgeTypes[tokenId] || 'Unknown Badge';
    },

    totalSupply: async (): Promise<number> => {
      return 5;
    },
  };
};

/**
 * Example 1: Check if user has a specific badge
 */
async function checkUserHasBadge() {
  console.log('\n=== Example 1: Check Badge Ownership ===');
  
  const badgeContract = createBadgeContract();
  const userAddress = '0x1234567890abcdef1234567890abcdef12345678';
  
  // Check if user has Watchdog badge
  const hasWatchdog = await badgeContract.hasBadge(userAddress, BADGE_IDS.WATCHDOG);
  console.log(`✅ User has Watchdog badge: ${hasWatchdog}`);
  
  // Check if user has Community Leader badge
  const hasLeader = await badgeContract.hasBadge(userAddress, BADGE_IDS.COMMUNITY_LEADER);
  console.log(`❌ User has Community Leader badge: ${hasLeader}`);
}

/**
 * Example 2: Get all badges for a user
 */
async function getUserBadges() {
  console.log('\n=== Example 2: Get All User Badges ===');
  
  const badgeContract = createBadgeContract();
  const userAddress = '0x1234567890abcdef1234567890abcdef12345678';
  
  // Get all badge IDs
  const badgeIds = await badgeContract.getBadges(userAddress);
  console.log(`📋 User has ${badgeIds.length} badges:`, badgeIds);
  
  // Get badge type names
  const badgeNames = await Promise.all(
    badgeIds.map(id => badgeContract.getBadgeType(id))
  );
  
  console.log('\n🏅 Badge Details:');
  badgeIds.forEach((id, index) => {
    console.log(`   ${id}: ${badgeNames[index]}`);
  });
}

/**
 * Example 3: Filter contributors by badge ownership
 */
async function filterContributorsByBadge() {
  console.log('\n=== Example 3: Filter Contributors by Badge ===');
  
  const badgeContract = createBadgeContract();
  
  // Sample contributors
  const contributors = [
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdef1234567890abcdef1234567890abcdef12',
    '0x2468ace0246801234567890abcdef1234567890',
  ];
  
  // Find all contributors with Watchdog badge
  const watchdogHolders: string[] = [];
  
  for (const contributor of contributors) {
    const hasWatchdog = await badgeContract.hasBadge(contributor, BADGE_IDS.WATCHDOG);
    if (hasWatchdog) {
      watchdogHolders.push(contributor);
    }
  }
  
  console.log(`🔍 Found ${watchdogHolders.length} Watchdog badge holders:`);
  watchdogHolders.forEach(address => {
    console.log(`   - ${address.slice(0, 10)}...${address.slice(-8)}`);
  });
}

/**
 * Example 4: Display contributor with badge information
 */
async function displayContributorProfile() {
  console.log('\n=== Example 4: Contributor Profile ===');
  
  const badgeContract = createBadgeContract();
  const userAddress = '0x1234567890abcdef1234567890abcdef12345678';
  
  // Get badges
  const badgeIds = await badgeContract.getBadges(userAddress);
  const badgeNames = await Promise.all(
    badgeIds.map(id => badgeContract.getBadgeType(id))
  );
  
  // Display profile
  console.log(`\n👤 Contributor: ${userAddress.slice(0, 10)}...${userAddress.slice(-8)}`);
  console.log(`⭐ Reputation: 120`);
  console.log(`🏅 Badges (${badgeIds.length}):`);
  
  badgeNames.forEach((name, index) => {
    console.log(`   ${index + 1}. ${name} (#${badgeIds[index]})`);
  });
  
  // BscScan link
  const badgeContractAddress = '0x...'; // Replace with actual contract address
  const verificationLink = `https://bscscan.com/token/${badgeContractAddress}?a=${userAddress}`;
  console.log(`\n🔍 Verify on-chain: ${verificationLink}`);
}

/**
 * Example 5: Get badge statistics
 */
async function getBadgeStatistics() {
  console.log('\n=== Example 5: Badge Statistics ===');
  
  const badgeContract = createBadgeContract();
  
  // Get total supply
  const totalBadges = await badgeContract.totalSupply();
  console.log(`📊 Total badge types: ${totalBadges}`);
  
  // List all badge types
  console.log('\n🏆 Available Badges:');
  for (let i = 1; i <= totalBadges; i++) {
    const badgeType = await badgeContract.getBadgeType(i);
    console.log(`   #${i}: ${badgeType}`);
  }
}

/**
 * Example 6: Web3 Integration Pattern
 */
function web3IntegrationExample() {
  console.log('\n=== Example 6: Web3 Integration Pattern ===');
  
  // This is how you would use it with real Web3
  const example = `
// Import Web3 and ABI
import Web3 from 'web3';
import badgeABI from './abis/MeeChainBadge.json';

// Connect to Web3
const web3 = new Web3(window.ethereum);
const badgeContractAddress = '0x...'; // Your deployed contract

// Create contract instance
const badgeContract = new web3.eth.Contract(
  badgeABI,
  badgeContractAddress
);

// Check if user has badge
const hasWatchdog = await badgeContract.methods
  .hasBadge(userAddress, WATCHDOG_ID)
  .call();

// Get all user badges
const badgeList = await badgeContract.methods
  .getBadges(userAddress)
  .call();

// Get badge type
const badgeType = await badgeContract.methods
  .getBadgeType(badgeId)
  .call();
`;
  
  console.log(example);
}

/**
 * Run all examples
 */
async function main() {
  console.log('🎯 MeeChain Badge Ownership Demo');
  console.log('=================================');
  
  try {
    await checkUserHasBadge();
    await getUserBadges();
    await filterContributorsByBadge();
    await displayContributorProfile();
    await getBadgeStatistics();
    web3IntegrationExample();
    
    console.log('\n✅ Demo completed successfully!');
  } catch (error) {
    console.error('❌ Error running demo:', error);
  }
}

// Run the demo
if (require.main === module) {
  main();
}

export {
  checkUserHasBadge,
  getUserBadges,
  filterContributorsByBadge,
  displayContributorProfile,
  getBadgeStatistics,
  web3IntegrationExample,
};

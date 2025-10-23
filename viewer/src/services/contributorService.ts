/**
 * Contributor Service
 * Handles fetching and managing contributor data including badges and reputation
 */

export interface Contributor {
  address: string;
  name?: string;
  reputation: number;
  badges: string[];
  tier?: number;
  joinedDate?: Date;
}

/**
 * Mock data for contributors with their badges and reputation
 * In production, this would fetch from blockchain and backend API
 */
const mockContributors: Contributor[] = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'Alice Wong',
    reputation: 95,
    badges: ['Watchdog', 'Pioneer', 'Quest Master'],
    tier: 3,
    joinedDate: new Date('2024-01-15'),
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    name: 'Bob Chen',
    reputation: 78,
    badges: ['Early Adopter', 'Quest Master'],
    tier: 2,
    joinedDate: new Date('2024-02-10'),
  },
  {
    address: '0x2468ace0246801234567890abcdef1234567890',
    name: 'Charlie Lee',
    reputation: 120,
    badges: ['Watchdog', 'Pioneer', 'Early Adopter', 'Community Leader'],
    tier: 3,
    joinedDate: new Date('2024-01-05'),
  },
  {
    address: '0x13579bdf13579024680abcdef1234567890abcde',
    name: 'Diana Singh',
    reputation: 65,
    badges: ['Quest Master'],
    tier: 2,
    joinedDate: new Date('2024-03-01'),
  },
  {
    address: '0xfedcba0987654321fedcba0987654321fedcba09',
    name: 'Eve Martinez',
    reputation: 42,
    badges: ['Early Adopter'],
    tier: 1,
    joinedDate: new Date('2024-04-15'),
  },
  {
    address: '0x1111222233334444555566667777888899990000',
    reputation: 88,
    badges: ['Watchdog', 'Community Leader'],
    tier: 2,
    joinedDate: new Date('2024-02-20'),
  },
  {
    address: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555',
    name: 'Frank Kim',
    reputation: 53,
    badges: ['Pioneer'],
    tier: 1,
    joinedDate: new Date('2024-03-25'),
  },
  {
    address: '0x9876543210fedcba9876543210fedcba98765432',
    name: 'Grace Nguyen',
    reputation: 110,
    badges: ['Watchdog', 'Pioneer', 'Quest Master', 'Early Adopter'],
    tier: 3,
    joinedDate: new Date('2024-01-10'),
  },
];

/**
 * Fetch all contributors with their badges and reputation
 * @returns Promise<Contributor[]> List of all contributors
 */
export async function fetchContributors(): Promise<Contributor[]> {
  console.log('[ContributorService] Fetching contributors...');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In production, this would be:
  // const response = await fetch('/api/contributors');
  // return response.json();
  
  return mockContributors;
}

/**
 * Fetch a specific contributor by address
 * @param address Contributor's wallet address
 * @returns Promise<Contributor | null> Contributor data or null if not found
 */
export async function fetchContributorByAddress(address: string): Promise<Contributor | null> {
  console.log(`[ContributorService] Fetching contributor ${address}...`);
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const contributor = mockContributors.find(
    c => c.address.toLowerCase() === address.toLowerCase()
  );
  
  return contributor || null;
}

/**
 * Fetch top contributors sorted by reputation
 * @param limit Number of top contributors to return
 * @returns Promise<Contributor[]> Top contributors
 */
export async function fetchTopContributors(limit: number = 5): Promise<Contributor[]> {
  console.log(`[ContributorService] Fetching top ${limit} contributors...`);
  
  const allContributors = await fetchContributors();
  
  return allContributors
    .sort((a, b) => b.reputation - a.reputation)
    .slice(0, limit);
}

/**
 * Search contributors by name or address
 * @param query Search query string
 * @returns Promise<Contributor[]> Matching contributors
 */
export async function searchContributors(query: string): Promise<Contributor[]> {
  console.log(`[ContributorService] Searching contributors with query: ${query}`);
  
  const allContributors = await fetchContributors();
  const lowerQuery = query.toLowerCase();
  
  return allContributors.filter(
    c =>
      c.address.toLowerCase().includes(lowerQuery) ||
      c.name?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter contributors by badge type
 * @param badgeType Badge type to filter by
 * @returns Promise<Contributor[]> Contributors with the specified badge
 */
export async function fetchContributorsByBadge(badgeType: string): Promise<Contributor[]> {
  console.log(`[ContributorService] Fetching contributors with badge: ${badgeType}`);
  
  const allContributors = await fetchContributors();
  
  return allContributors.filter(c =>
    c.badges.some(badge => badge.toLowerCase() === badgeType.toLowerCase())
  );
}

/**
 * Filter contributors by minimum reputation
 * @param minReputation Minimum reputation score
 * @returns Promise<Contributor[]> Contributors with reputation >= minReputation
 */
export async function fetchContributorsByReputation(
  minReputation: number
): Promise<Contributor[]> {
  console.log(`[ContributorService] Fetching contributors with reputation >= ${minReputation}`);
  
  const allContributors = await fetchContributors();
  
  return allContributors.filter(c => c.reputation >= minReputation);
}

/**
 * Get contributor statistics
 * @returns Promise<object> Statistics about contributors
 */
export async function getContributorStats() {
  const contributors = await fetchContributors();
  
  const totalContributors = contributors.length;
  const totalBadges = contributors.reduce((sum, c) => sum + c.badges.length, 0);
  const averageReputation = contributors.reduce((sum, c) => sum + c.reputation, 0) / totalContributors;
  
  const badgeDistribution: Record<string, number> = {};
  contributors.forEach(c => {
    c.badges.forEach(badge => {
      badgeDistribution[badge] = (badgeDistribution[badge] || 0) + 1;
    });
  });
  
  return {
    totalContributors,
    totalBadges,
    averageReputation: Math.round(averageReputation),
    badgeDistribution,
  };
}

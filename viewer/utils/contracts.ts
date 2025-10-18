
// --- Mock Smart Contracts ---
const badgeNFT = {
  getTopBadgeHolders: async (): Promise<{ address: string; badgeCount: number }[]> => {
    console.log("[Contract] Fetching top badge holders...");
    await new Promise(res => setTimeout(res, 800));
    if (Math.random() < 0.1) throw new Error("RPC Error: Failed to fetch from primary endpoint.");
    return [
      { address: "0xUserA1bC...dE2f", badgeCount: 15 },
      { address: "0xUserB3dE...fG8h", badgeCount: 12 },
      { address: "0xUserC5fG...hI0j", badgeCount: 9 },
    ];
  },
  getBadgesOf: async (address: string): Promise<string[]> => {
    console.log(`[Contract] Fetching badges for ${address}...`);
    await new Promise(res => setTimeout(res, 500));
    if (Math.random() < 0.1) throw new Error("RPC Error: Failed to fetch badges.");
    // Simulate badges based on address
    if (address.includes("A1bC")) return ["QuestMaster01", "PioneerUser", "ValidatorS1"];
    return ["PioneerUser"];
  },
};

const questManager = {
  getAllQuestIds: async (): Promise<string[]> => {
    console.log("[Contract] Fetching all quest IDs...");
    await new Promise(res => setTimeout(res, 600));
    if (Math.random() < 0.1) throw new Error("RPC Error: Failed to fetch quests.");
    return ["Q01-Onboarding", "Q02-FirstMint", "Q03-CommunityCall", "Q04-AdvancedTrade"];
  },
  getQuestStatus: async (user: string, questId: string): Promise<string> => {
    console.log(`[Contract] Getting status for quest ${questId} for user ${user}...`);
    await new Promise(res => setTimeout(res, 200 + Math.random() * 300));
    if (Math.random() < 0.05) return 'unknown';
    
    // Simulate status
    if (questId === "Q01-Onboarding" || questId === "Q02-FirstMint") return 'completed';
    if (questId === "Q03-CommunityCall") return 'inprogress';
    return 'not-started';
  },
};


// --- API Functions ---

export async function getLeaderboard(): Promise<{ address: string; badgeCount: number }[]> {
  try {
    return await badgeNFT.getTopBadgeHolders();
  } catch (error) {
    console.error("Failed to get leaderboard, returning fallback.", error);
    return []; // fallback: empty data
  }
}

export async function getUserBadges(address: string): Promise<string[]> {
  try {
    return await badgeNFT.getBadgesOf(address);
  } catch (error) {
    console.error(`Failed to get badges for ${address}, returning fallback.`, error);
    return []; // fallback: no badges
  }
}

export async function getAllQuests(): Promise<string[]> {
  try {
    return await questManager.getAllQuestIds();
  } catch (error) {
    console.error("Failed to get all quests, returning fallback.", error);
    return [];
  }
}

export async function getQuestStatus(user: string, questId: string): Promise<string> {
  try {
    return await questManager.getQuestStatus(user, questId);
  } catch (error) {
    console.error(`Failed to get status for quest ${questId}, returning fallback.`, error);
    return 'unknown';
  }
}

export async function upgradeTier(userAddress: string): Promise<boolean> {
  console.log(`[Contract] Upgrading tier for ${userAddress}...`);
  await new Promise(res => setTimeout(res, 1000));
  return Math.random() > 0.1; // 90% success rate
}

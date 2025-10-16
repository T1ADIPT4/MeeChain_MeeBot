
import { ethers } from 'ethers';
import QuestManager_ABI from '../abis/QuestManager.json';
import BadgeNFTUpgrade_ABI from '../abis/BadgeNFTUpgrade.json';

// --- RPC Provider Setup with Fallback ---
const primaryRpcUrl = 'https://rpc.primary.dev'; // URL สมมติสำหรับ RPC หลัก
const fallbackRpcUrl = 'https://rpc.smanky.dev';

const primaryProvider = new ethers.providers.JsonRpcProvider(primaryRpcUrl);
const fallbackProvider = new ethers.providers.JsonRpcProvider(fallbackRpcUrl);

// FallbackProvider จะใช้ primaryProvider ก่อน และถ้าล้มเหลวจะสลับไปใช้ fallbackProvider
const provider = new ethers.providers.FallbackProvider([
  { provider: primaryProvider, priority: 1 },
  { provider: fallbackProvider, priority: 2 },
]);

// --- Contract Instances ---
const questManagerAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // ใส่ Address ที่ถูกต้อง
const badgeUpgradeAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';

const questManager = new ethers.Contract(questManagerAddress, QuestManager_ABI, provider);
const badgeUpgrade = new ethers.Contract(badgeUpgradeAddress, BadgeNFTUpgrade_ABI, provider);

// --- Mint Badge Function ---
export async function mintBadge(user: string, questId: string): Promise<boolean> {
  try {
    // @ts-ignore
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
    const questManagerWithSigner = questManager.connect(signer);
    const tx = await questManagerWithSigner.mintBadge(user, questId);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Mint badge failed:", error);
    return false;
  }
}

// --- Upgrade Tier Function ---
export async function upgradeTier(user: string): Promise<boolean> {
  try {
    // @ts-ignore
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
    const upgradeWithSigner = badgeUpgrade.connect(signer);
    const tx = await upgradeWithSigner.upgradeTier(user);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Upgrade tier failed:", error);
    return false;
  }
}

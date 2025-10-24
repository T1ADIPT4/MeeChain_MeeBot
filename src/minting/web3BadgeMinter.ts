import { ethers } from 'ethers';
import { logEvent } from '../utils/logger';
import { getBadgeContract, getFallbackContract, type SupportedNetwork } from '../config/registryLoader';
import badgeABI from '../../contracts/BadgeABI.json'; // ปรับ path ตามที่เก็บ ABI จริง
import erc20ABI from './erc20ABI.json';
import { verifyBadgeExists } from './badgeMinter';

// RPC endpoint และ network config
const PRIMARY_CHAIN_RPC = process.env.RPC_MAINNET || 'https://rpc.meechain.io';
const FALLBACK_CHAIN_RPC = process.env.RPC_FALLBACK || 'https://fallback.meechain.io';
const DEFAULT_PRIMARY_NETWORK: SupportedNetwork = 'polygon';
const DEFAULT_FALLBACK_NETWORK: SupportedNetwork = 'ethereum';

// ใช้ signer ที่ปลอดภัย (backend: private key จาก secret manager, frontend: injected wallet)
function getSigner(provider: ethers.JsonRpcProvider, isBackend = true) {
  if (isBackend && process.env.PRIVATE_KEY) {
    return new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  }
  // fallback: frontend signer (เช่น MetaMask)
  return provider.getSigner();
}

async function mintBadgeOnChain({
  userId,
  questId,
  chainUrl,
  contractAddress,
  networkName,
  chainId,
  isFallback = false
}: {
  userId: string,
  questId: string,
  chainUrl: string,
  contractAddress: string,
  networkName: string,
  chainId: number,
  isFallback?: boolean
}): Promise<any> {
  try {
    const provider = new ethers.JsonRpcProvider(chainUrl);
    // ตรวจสอบ network ก่อน mint
    const net = await provider.getNetwork();
    if (net.chainId !== chainId) {
      throw new Error(`ChainId mismatch: expected ${chainId}, got ${net.chainId}`);
    }
    const signer = getSigner(provider, !!process.env.PRIVATE_KEY);
    // 1. ตรวจสอบ T2P token (ถ้ามีการตั้งค่า)
    const t2pTokenAddress = process.env.T2P_TOKEN_ADDRESS;
    if (t2pTokenAddress && userId) {
      const tokenContract = new ethers.Contract(t2pTokenAddress, erc20ABI, provider);
      const balance = await tokenContract.balanceOf(userId);
      if (balance.lte(0)) {
        throw new Error('User has no T2P token');
      }
    }
    // 2. ตรวจสอบ badge ซ้ำ
    const alreadyMinted = await verifyBadgeExists(userId, questId);
    if (alreadyMinted) {
      throw new Error('Badge already minted for this quest');
    }
    // 3. Mint badge
    const contract = new ethers.Contract(contractAddress, badgeABI, signer);
    const tx = await contract.mintQuestBadge(userId, questId);
    await tx.wait();
    // ดึง tokenId และ tokenURI (สมมุติฟังก์ชัน getTokenId, tokenURI มีใน contract)
    let tokenId, tokenUri;
    try {
      tokenId = await contract.getTokenId(userId, questId);
      tokenUri = await contract.tokenURI(tokenId);
    } catch (e) {
      tokenId = undefined;
      tokenUri = undefined;
    }
    const badgeTx = {
      txHash: tx.hash,
      userId,
      questId,
      badgeId: `badge-${questId}`,
      timestamp: new Date(),
      chain: isFallback ? 'fallback' : 'primary',
      contractAddress,
      network: networkName,
      tokenId,
      tokenUri
    };
    logEvent(isFallback ? 'blockchain-fallback-mint-success' : 'blockchain-mint-success', badgeTx);
    return badgeTx;
  } catch (error) {
    logEvent(isFallback ? 'blockchain-fallback-mint-error' : 'blockchain-mint-error', {
      userId,
      questId,
      error: String(error),
      chain: chainUrl,
      contractAddress,
      networkName,
      chainId
    }, 'error');
    throw error;
  }
}

export async function mintBadge(userId: string, questId: string, network?: SupportedNetwork) {
  const targetNetwork = network || DEFAULT_PRIMARY_NETWORK;
  const contractAddress = getBadgeContract(targetNetwork);
  // สมมุติ chainId mapping (ควรดึงจาก registry จริง)
  const chainId = targetNetwork === 'polygon' ? 137 : 1;
  return mintBadgeOnChain({
    userId,
    questId,
    chainUrl: PRIMARY_CHAIN_RPC,
    contractAddress,
    networkName: targetNetwork,
    chainId
  });
}

export async function fallbackMintBadge(userId: string, questId: string, network?: SupportedNetwork) {
  const targetNetwork = network || DEFAULT_FALLBACK_NETWORK;
  const contractAddress = getFallbackContract(targetNetwork);
  // สมมุติ chainId mapping (ควรดึงจาก registry จริง)
  const chainId = targetNetwork === 'ethereum' ? 1 : 137;
  return mintBadgeOnChain({
    userId,
    questId,
    chainUrl: FALLBACK_CHAIN_RPC,
    contractAddress,
    networkName: targetNetwork,
    chainId,
    isFallback: true
  });
}

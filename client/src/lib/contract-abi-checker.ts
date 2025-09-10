
import { ethers } from 'ethers';

// MeeToken Contract ABI (สำคัญๆ)
export const MEE_TOKEN_ABI = [
  // ERC-20 Standard
  "function name() view returns (string)",
  "function symbol() view returns (string)", 
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address, uint256) returns (bool)",
  "function approve(address, uint256) returns (bool)",
  "function allowance(address, address) view returns (uint256)",
  
  // MeeToken Specific
  "function mintReward(address, uint256)",
  "function getUserTier(address) view returns (uint8)",
  "function checkTierEligibility(address) view returns (uint8)",
  "function setMembershipNFT(address)",
  "function totalEarned(address) view returns (uint256)",
  "function userTier(address) view returns (uint8)",
  
  // Events
  "event Transfer(address indexed, address indexed, uint256)",
  "event Approval(address indexed, address indexed, uint256)",
  "event TierUpgraded(address indexed, uint8)",
  "event NFTRewardMinted(address indexed, uint8, uint256)"
];

// MembershipNFT Contract ABI
export const MEMBERSHIP_NFT_ABI = [
  // ERC-721 Standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256) view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function ownerOf(uint256) view returns (address)",
  
  // Membership Specific
  "function mintReward(address, uint256, uint8)",
  "function hasTierNFT(address, uint8) view returns (bool)",
  "function getUserHighestTier(address) view returns (uint8)",
  "function updateTierMetadata(uint8, string, string)",
  "function authorizeMinter(address)",
  
  // Events
  "event Transfer(address indexed, address indexed, uint256)",
  "event NFTRewardMinted(address indexed, uint8, uint256)"
];

// Contract addresses (ใส่ address จริงตอน deploy)
export const CONTRACT_ADDRESSES = {
  MEE_TOKEN: process.env.VITE_TOKEN_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  MEMBERSHIP_NFT: process.env.VITE_NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  FUSE_RPC: process.env.VITE_FUSE_RPC_URL || "https://rpc.fuse.io",
  CHAIN_ID: parseInt(process.env.VITE_CHAIN_ID || "122"),
};

// Validate contract connection
export const validateContractConnection = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(CONTRACT_ADDRESSES.FUSE_RPC);
    
    // Test RPC connection
    await provider.getBlockNumber();
    
    // Test contract existence
    const tokenCode = await provider.getCode(CONTRACT_ADDRESSES.MEE_TOKEN);
    const nftCode = await provider.getCode(CONTRACT_ADDRESSES.MEMBERSHIP_NFT);
    
    return {
      rpcConnected: true,
      tokenContractExists: tokenCode !== "0x",
      nftContractExists: nftCode !== "0x",
      chainId: await provider.getNetwork().then(n => Number(n.chainId)),
    };
  } catch (error) {
    console.error('Contract validation failed:', error);
    return {
      rpcConnected: false,
      tokenContractExists: false,
      nftContractExists: false,
      chainId: null,
      error: error.message,
    };
  }
};

// Get contract instances
export const getContractInstances = (signer?: ethers.Signer) => {
  const provider = new ethers.JsonRpcProvider(CONTRACT_ADDRESSES.FUSE_RPC);
  const signerOrProvider = signer || provider;
  
  const meeToken = new ethers.Contract(
    CONTRACT_ADDRESSES.MEE_TOKEN,
    MEE_TOKEN_ABI,
    signerOrProvider
  );
  
  const membershipNFT = new ethers.Contract(
    CONTRACT_ADDRESSES.MEMBERSHIP_NFT,
    MEMBERSHIP_NFT_ABI,
    signerOrProvider
  );
  
  return { meeToken, membershipNFT, provider };
};

// Check if user has contracts interaction capability
export const checkUserContractAccess = async (userAddress: string) => {
  try {
    const { meeToken, membershipNFT } = getContractInstances();
    
    // Get user data
    const [balance, tier, totalEarned, highestNFTTier] = await Promise.all([
      meeToken.balanceOf(userAddress),
      meeToken.getUserTier(userAddress),
      meeToken.totalEarned(userAddress),
      membershipNFT.getUserHighestTier(userAddress),
    ]);
    
    return {
      success: true,
      balance: ethers.formatEther(balance),
      tier: Number(tier),
      totalEarned: ethers.formatEther(totalEarned),
      highestNFTTier: Number(highestNFTTier),
    };
  } catch (error) {
    console.error('User contract access check failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

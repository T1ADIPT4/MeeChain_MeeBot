
import { ethers } from 'ethers';

// Real Token Contract ABI (จาก Fuse Network)
export const MEE_TOKEN_ABI = [
  // ERC-20 Standard Functions
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol", 
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "type": "function"
  },
  
  // Advanced Functions
  {
    "constant": false,
    "inputs": [
      {"internalType": "address", "name": "account", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "mint",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"internalType": "address", "name": "_to", "type": "address"},
      {"internalType": "uint256", "name": "_value", "type": "uint256"},
      {"internalType": "bytes", "name": "_data", "type": "bytes"}
    ],
    "name": "transferAndCall",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "isMinter",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "type": "function"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "from", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "spender", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}
    ],
    "name": "Approval",
    "type": "event"
  }
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

// MeeBadgeNFT Contract ABI
export const BADGE_NFT_ABI = [
  // ERC-721 Standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256) view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function ownerOf(uint256) view returns (address)",
  
  // Badge NFT Specific
  "function mintBadge(address, string, string, string, uint256, uint8, uint8, string, bool, string) returns (uint256)",
  "function upgradeBadge(uint256)",
  "function activatePower(uint256)",
  "function getUserBadgesWithPowers(address) view returns (tuple(uint256, string, string, string, uint256, uint256, uint8, uint8, uint256, address, bool, string, uint256, bool)[])",
  "function getQuestSetProgress(address, string) view returns (uint256, uint256, bool, string)",
  "function createQuestSet(string, string, string, string[], string, string, string, uint256, uint8, uint8, string, string, uint256, uint256)",
  "function authorizeMinter(address)",
  "function userXP(address) view returns (uint256)",
  "function userLevel(address) view returns (uint256)",
  
  // Events
  "event BadgeMinted(address indexed, uint256 indexed, string, string, uint256, uint8)",
  "event BadgeUpgraded(uint256 indexed, uint256, string)",
  "event QuestSetCompleted(address indexed, string, uint256, string)",
  "event PowerActivated(address indexed, uint256, string, uint256)"
];

// Contract addresses (ใส่ address จริงตอน deploy)
export const CONTRACT_ADDRESSES = {
  MEE_TOKEN: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  MEMBERSHIP_NFT: import.meta.env.VITE_NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  BADGE_NFT: import.meta.env.VITE_BADGE_NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  FUSE_RPC: import.meta.env.VITE_FUSE_RPC_URL || "https://rpc.fuse.io",
  CHAIN_ID: parseInt(import.meta.env.VITE_CHAIN_ID || "122"),
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
  
  const badgeNFT = new ethers.Contract(
    CONTRACT_ADDRESSES.BADGE_NFT,
    BADGE_NFT_ABI,
    signerOrProvider
  );
  
  return { meeToken, membershipNFT, badgeNFT, provider };
};

// Check if user has contracts interaction capability
export const checkUserContractAccess = async (userAddress: string) => {
  try {
    const { meeToken } = getContractInstances();
    
    // Test basic contract functions
    const [balance, name, symbol, decimals, totalSupply] = await Promise.all([
      meeToken.balanceOf(userAddress),
      meeToken.name(),
      meeToken.symbol(), 
      meeToken.decimals(),
      meeToken.totalSupply(),
    ]);
    
    // Check if user is a minter (optional)
    let isMinter = false;
    try {
      isMinter = await meeToken.isMinter(userAddress);
    } catch (e) {
      // isMinter function might not exist in all contracts
      console.log('isMinter check skipped:', e.message);
    }
    
    return {
      success: true,
      contractInfo: {
        name: name,
        symbol: symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatEther(totalSupply),
      },
      userInfo: {
        balance: ethers.formatEther(balance),
        isMinter: isMinter,
        address: userAddress,
      },
    };
  } catch (error) {
    console.error('User contract access check failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

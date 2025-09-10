
import { ethers } from "ethers";

// Token Contract Configuration
const TOKEN_CONTRACT_ADDRESS = "0xYourTokenContractAddress";
const FUSE_RPC_URL = "https://rpc.fuse.io";
const FUSE_CHAIN_ID = 122;

const TOKEN_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Deposit Contract Configuration
const DEPOSIT_CONTRACT_ADDRESS = "0xYourDepositContractAddress";
const DEPOSIT_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export async function mintToken(to: string, amount: string): Promise<string> {
  if (!window.ethereum) throw new Error("Wallet not found");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const contract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer);
  
  try {
    const tx = await contract.mint(to, ethers.parseUnits(amount, 18));
    return tx.hash;
  } catch (error: any) {
    console.error("Mint error:", error);
    throw new Error(error.message || "Mint transaction failed");
  }
}

export async function depositToken(tokenAddress: string, amount: string): Promise<string> {
  if (!window.ethereum) throw new Error("Wallet not found");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  // First approve the deposit contract to spend tokens
  const tokenContract = new ethers.Contract(tokenAddress, TOKEN_CONTRACT_ABI, signer);
  const approvalTx = await tokenContract.approve(
    DEPOSIT_CONTRACT_ADDRESS, 
    ethers.parseUnits(amount, 18)
  );
  await approvalTx.wait();
  
  // Then deposit tokens
  const depositContract = new ethers.Contract(DEPOSIT_CONTRACT_ADDRESS, DEPOSIT_CONTRACT_ABI, signer);
  
  try {
    const tx = await depositContract.deposit(tokenAddress, ethers.parseUnits(amount, 18));
    return tx.hash;
  } catch (error: any) {
    console.error("Deposit error:", error);
    throw new Error(error.message || "Deposit transaction failed");
  }
}

export async function getTokenBalance(tokenAddress: string, userAddress: string, chainId?: number): Promise<string> {
  if (!window.ethereum) throw new Error("Wallet not found");
  
  let provider;
  if (chainId === FUSE_CHAIN_ID) {
    // Use Fuse RPC for Fuse network
    provider = new ethers.JsonRpcProvider(FUSE_RPC_URL);
  } else {
    provider = new ethers.BrowserProvider(window.ethereum);
  }
  
  const contract = new ethers.Contract(tokenAddress, [
    {
      "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ], provider);
  
  try {
    const balance = await contract.balanceOf(userAddress);
    return ethers.formatUnits(balance, 18);
  } catch (error: any) {
    console.error("Balance check error:", error);
    return "0";
  }
}

export async function switchToFuseNetwork(): Promise<boolean> {
  if (!window.ethereum) throw new Error("Wallet not found");
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x7A' }], // 122 in hex
    });
    return true;
  } catch (switchError: any) {
    // Chain not added, try to add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x7A',
            chainName: 'Fuse Network',
            nativeCurrency: {
              name: 'Fuse',
              symbol: 'FUSE',
              decimals: 18,
            },
            rpcUrls: [FUSE_RPC_URL],
            blockExplorerUrls: ['https://explorer.fuse.io/'],
          }],
        });
        return true;
      } catch (addError) {
        console.error("Failed to add Fuse network:", addError);
        return false;
      }
    }
    console.error("Failed to switch to Fuse network:", switchError);
    return false;
  }
}

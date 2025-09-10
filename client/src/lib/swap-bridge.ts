
import { ethers } from "ethers";

// ใส่ address และ ABI ของ swap/bridge contract จริง
const CONTRACT_ADDRESS = "0xYourSwapBridgeContractAddress";
const CONTRACT_ABI = [
  // ตัวอย่าง ABI สำหรับ swap/bridge function
  {
    "inputs": [
      { "internalType": "address", "name": "tokenFrom", "type": "address" },
      { "internalType": "address", "name": "tokenTo", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "targetChainId", "type": "uint256" }
    ],
    "name": "swapOrBridge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "tokenFrom", "type": "address" },
      { "internalType": "address", "name": "tokenTo", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "getSwapQuote",
    "outputs": [
      { "internalType": "uint256", "name": "outputAmount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const TOKEN_ADDRESSES = {
  ETH: "0x0000000000000000000000000000000000000000",
  MEE: "0x0000000000000000000000000000000000000001",
  USDT: "0xa669b1F45F84368fBe48882bF8d1814aae7a4422",
  FUSE: "0xa669b1F45F84368fBe48882bF8d1814aae7a4422",
};

export const CHAIN_OPTIONS = [
  { id: "1", name: "Ethereum Mainnet" },
  { id: "122", name: "Fuse Network" },
  { id: "56", name: "BSC" },
  { id: "137", name: "Polygon" },
];

export async function swapOrBridgeToken(
  tokenFrom: string,
  tokenTo: string,
  amount: string,
  targetChainId?: string // ถ้า bridge ใส่ chain id ด้วย
) {
  if (!window.ethereum) {
    throw new Error("Wallet not found - กรุณาติดตั้ง MetaMask หรือ wallet อื่น ๆ");
  }

  // Check if contract address is configured
  if (CONTRACT_ADDRESS === "0xYourSwapBridgeContractAddress") {
    throw new Error("Contract not configured - ระบบยังไม่ได้ตั้งค่า contract address");
  }
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Check network
    const network = await provider.getNetwork();
    console.log('Current network:', network.chainId);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    // Check if user has enough balance
    const userAddress = await signer.getAddress();
    console.log('User address:', userAddress);

    const tx = await contract.swapOrBridge(
      tokenFrom,
      tokenTo,
      ethers.parseUnits(amount, 18),
      targetChainId ? ethers.toBigInt(targetChainId) : 0
    );
    
    console.log('Transaction sent:', tx.hash);
    return tx.hash;
  } catch (error: any) {
    console.error("Swap/Bridge error:", error);
    
    if (error.code === 4001) {
      throw new Error("User denied transaction - ผู้ใช้ปฏิเสธการทำธุรกรรม");
    } else if (error.code === -32603) {
      throw new Error("Insufficient funds - ยอดเงินไม่เพียงพอ");
    } else if (error.message?.includes('network')) {
      throw new Error("Network error - เกิดปัญหาเครือข่าย");
    }
    
    throw new Error(error.message || "Transaction failed - การทำธุรกรรมล้มเหลว");
  }
}

export async function getSwapQuote(
  tokenFrom: string,
  tokenTo: string,
  amount: string
): Promise<string> {
  if (!window.ethereum) throw new Error("Wallet not found");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  
  try {
    const quote = await contract.getSwapQuote(
      tokenFrom,
      tokenTo,
      ethers.parseUnits(amount, 18)
    );
    
    return ethers.formatUnits(quote, 18);
  } catch (error: any) {
    console.error("Quote error:", error);
    return "0";
  }
}

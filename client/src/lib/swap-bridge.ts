import { ethers } from "ethers";

// Demo swap bridge API - calls backend endpoints instead of contracts directly
const API_BASE = '/api/swap-bridge';

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

// Get swap configuration from backend
export async function getSwapConfig() {
  const response = await fetch(`${API_BASE}/config`);
  return await response.json();
}

// Get quote for token swap
export async function getSwapQuote(
  tokenFrom: string,
  tokenTo: string,
  amount: string
): Promise<string> {
  try {
    const response = await fetch(
      `${API_BASE}/quote?fromToken=${tokenFrom}&toToken=${tokenTo}&amount=${amount}`
    );
    const data = await response.json();
    return data.outputAmount || "0";
  } catch (error) {
    console.error("Quote error:", error);
    // Return demo quote as fallback
    const rate = Math.random() * 0.1 + 0.95;
    return (parseFloat(amount) * rate).toFixed(6);
  }
}

// Execute swap/bridge transaction (demo mode)
export async function swapOrBridgeToken(
  tokenFrom: string,
  tokenTo: string,
  amount: string,
  targetChainId?: string
) {
  try {
    const response = await fetch(`${API_BASE}/swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromToken: tokenFrom,
        toToken: tokenTo,
        amount,
        fromNetwork: "1",
        toNetwork: targetChainId || "1"
      })
    });

    const data = await response.json();
    return {
      success: true,
      txHash: data.txHash,
      message: "Mock transaction completed successfully (Demo mode)"
    };
  } catch (error: any) {
    console.error("Swap error:", error);
    throw new Error(error.message || "Transaction failed - การทำธุรกรรมล้มเหลว");
  }
}
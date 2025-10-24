const PRIMARY_RPC_URL = "https://primary.rpc.provider";
const FALLBACK_RPC_URL = "https://rpc.smanky.dev";

let currentRpcUrl = PRIMARY_RPC_URL;

/**
 * Simulates switching to a fallback RPC if the primary one fails.
 * In a real app, this would involve re-initializing the ethers/web3 provider.
 */
export function switchToFallbackRpc() {
  if (currentRpcUrl !== FALLBACK_RPC_URL) {
    console.warn(`Switching to fallback RPC: ${FALLBACK_RPC_URL}`);
    currentRpcUrl = FALLBACK_RPC_URL;
    // Here you would re-configure your web3 provider, e.g.:
    // provider.connection.url = FALLBACK_RPC_URL;
  }
}

/**
 * Gets the currently active RPC URL.
 */
export function getCurrentRpc() {
  return currentRpcUrl;
}

// Firestore collection: contributorLogs
// Example document:
{
  "action": "swap",
  "userAddress": "0x123...",
  "timestamp": "2025-10-29T08:55:00Z",
  "tierUsed": "buffered",
  "metadata": {
    "amount": "2.5",
    "status": "success"
  }
}

// Node.js listener for smart contract → Firestore sync
import { ethers } from 'ethers';
import { getFirestore } from 'firebase-admin/firestore';

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
const db = getFirestore();

contract.on('SwapExecuted', async (user, amount, tierUsed, event) => {
  await db.collection('contributorLogs').add({
    action: 'swap',
    userAddress: user,
    timestamp: new Date().toISOString(),
    tierUsed,
    metadata: { amount: amount.toString(), txHash: event.transactionHash }
  });
});

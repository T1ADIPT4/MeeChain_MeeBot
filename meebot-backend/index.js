import express from 'express';
import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// Load MeeChain ABI
const MeeChainABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'abi', 'MeeChainSupply.json'), 'utf8')
);

// Initialize Web3 and contract
const web3 = new Web3(process.env.RPC_URL);
const contract = new web3.eth.Contract(MeeChainABI, process.env.CONTRACT_ADDRESS);
const signer = process.env.MEEBOT_WALLET_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log transaction to file
 * @param {Object} entry - Transaction log entry
 */
const logTx = (entry) => {
  const logPath = path.join(logsDir, 'tx.log');
  const logEntry = {
    ...entry,
    timestamp: entry.timestamp || Date.now(),
  };
  fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
  console.log('📝 Logged:', logEntry);
};

/**
 * API endpoint to trigger MeeChain actions
 * POST /api/meechain/trigger
 * Body: { userAddress, action, amountBNB }
 */
app.post('/api/meechain/trigger', async (req, res) => {
  const { userAddress, action, amountBNB } = req.body;

  // Validate user address
  if (!userAddress || !web3.utils.isAddress(userAddress)) {
    return res.status(400).json({ error: 'Invalid or missing user address' });
  }

  // Validate action
  if (!action) {
    return res.status(400).json({ error: 'Missing action parameter' });
  }

  let tx;
  try {
    const nonce = await web3.eth.getTransactionCount(signer, 'latest');
    let txData;

    // Prepare transaction data based on action
    switch (action) {
      case 'replay':
        if (!amountBNB) {
          return res.status(400).json({ error: 'Missing amountBNB for replay action' });
        }
        const amountWei = web3.utils.toWei(amountBNB.toString(), 'ether');
        txData = contract.methods.confirmReplay(userAddress, amountWei).encodeABI();
        break;
      
      case 'supply':
        txData = contract.methods.triggerSupply(userAddress).encodeABI();
        break;
      
      case 'refund':
        txData = contract.methods.refund(userAddress).encodeABI();
        break;
      
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }

    // Prepare transaction object
    const txObject = {
      to: process.env.CONTRACT_ADDRESS,
      data: txData,
      gas: 300000,
      nonce,
    };

    // Sign and send transaction
    console.log(`🚀 Sending transaction for action: ${action}`);
    const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
    tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    // Log pending transaction
    logTx({ 
      userAddress, 
      action, 
      txHash: tx.transactionHash, 
      status: 'pending',
      timestamp: Date.now() 
    });

    // Wait for transaction receipt
    const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
    const status = receipt.status ? 'success' : 'failed';

    // Log final transaction status
    logTx({ 
      txHash: tx.transactionHash, 
      status, 
      block: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      timestamp: Date.now()
    });

    console.log(`✅ Transaction ${status}: ${tx.transactionHash}`);

    res.json({
      success: true,
      message: `✅ Action "${action}" completed successfully`,
      txHash: tx.transactionHash,
      status,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
    });
  } catch (err) {
    console.error('❌ Transaction failed:', err);
    
    // Log error
    logTx({
      userAddress,
      action,
      status: 'error',
      error: err.message,
      timestamp: Date.now(),
    });

    res.status(500).json({ 
      error: 'Transaction failed', 
      details: err.message 
    });
  }
});

/**
 * Health check endpoint
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'MeeBot Backend',
    network: process.env.RPC_URL,
    contract: process.env.CONTRACT_ADDRESS,
  });
});

/**
 * Get user status from contract
 * GET /api/meechain/status/:address
 */
app.get('/api/meechain/status/:address', async (req, res) => {
  const { address } = req.params;

  if (!web3.utils.isAddress(address)) {
    return res.status(400).json({ error: 'Invalid address' });
  }

  try {
    const [replayConfirmed, pendingSupply] = await Promise.all([
      contract.methods.replayConfirmed(address).call(),
      contract.methods.pendingSupply(address).call(),
    ]);

    res.json({
      address,
      replayConfirmed,
      pendingSupply: web3.utils.fromWei(pendingSupply, 'ether'),
      pendingSupplyWei: pendingSupply,
    });
  } catch (err) {
    console.error('❌ Failed to get status:', err);
    res.status(500).json({ 
      error: 'Failed to get status', 
      details: err.message 
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 MeeBot backend running on port', PORT);
  console.log('📡 Network:', process.env.RPC_URL);
  console.log('📝 Contract:', process.env.CONTRACT_ADDRESS);
  console.log('👤 Signer:', signer);
  console.log('\n📚 Available endpoints:');
  console.log('  - POST /api/meechain/trigger');
  console.log('  - GET  /api/meechain/status/:address');
  console.log('  - GET  /health');
});

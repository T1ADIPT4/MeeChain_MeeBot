# MeeBot Web3 Backend API

Complete Web3 backend implementation for MeeChain Supply system with replay verification, token supply, and refund functionality.

## 📋 Overview

This backend API provides secure Web3 interactions for the MeeBot system, enabling:
- **Replay Confirmation**: Verify and confirm off-chain replay transactions
- **Token Supply**: Trigger token supply after successful replay
- **Refund Processing**: Handle refunds for failed replays

## 🏗️ Architecture

```
api/
├── server.ts           # Main Express server
├── routes/
│   └── trigger.ts      # Trigger endpoint handler
├── utils/
│   ├── web3Config.ts   # Web3 provider and contract setup
│   └── logger.ts       # Database logging utility
├── types/
│   └── index.ts        # TypeScript type definitions
└── abi/
    └── MeeChainSupply.json  # Smart contract ABI
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
# Web3 Configuration
RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
CONTRACT_ADDRESS=0x...
MEEBOT_WALLET_ADDRESS=0x...
PRIVATE_KEY=your_private_key_here

# Server Configuration
PORT=3000
```

### 3. Start Server

Development mode:
```bash
npm run api:dev
```

Production mode:
```bash
npm run api:start
```

## 📡 API Endpoints

### POST `/api/meechain/trigger`

Trigger a Web3 action (replay, supply, or refund).

#### Request Body

```typescript
{
  userAddress: string;      // Ethereum address
  action: "replay" | "supply" | "refund";
  amountBNB?: string;       // Required for replay action
}
```

#### Examples

**Replay Confirmation:**
```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x1234567890123456789012345678901234567890",
    "action": "replay",
    "amountBNB": "0.01"
  }'
```

**Trigger Supply:**
```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x1234567890123456789012345678901234567890",
    "action": "supply"
  }'
```

**Process Refund:**
```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x1234567890123456789012345678901234567890",
    "action": "refund"
  }'
```

#### Response

Success:
```json
{
  "success": true,
  "message": "✅ Action \"replay\" initiated successfully",
  "txHash": "0xabc...def"
}
```

Error:
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Invalid Ethereum address"
}
```

### GET `/health`

Health check endpoint.

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": 1234567890,
  "service": "MeeBot Web3 Backend"
}
```

## 🔄 Integration Flow

### 1. Replay Confirmation Flow

```
Frontend/Flow Editor
    ↓
POST /api/meechain/trigger
{
  userAddress: "0x...",
  action: "replay",
  amountBNB: "0.01"
}
    ↓
Backend validates request
    ↓
Web3: contract.confirmReplay(user, amount)
    ↓
Log transaction (pending)
    ↓
Return { success: true, txHash }
    ↓
Monitor transaction status
    ↓
Update log (success/failed)
```

### 2. Supply Trigger Flow

```
User clicks "Claim Tokens"
    ↓
POST /api/meechain/trigger
{
  userAddress: "0x...",
  action: "supply"
}
    ↓
Backend validates request
    ↓
Web3: contract.triggerSupply(user)
    ↓
Log transaction
    ↓
Return { success: true, txHash }
```

### 3. Refund Flow

```
Replay verification fails
    ↓
POST /api/meechain/trigger
{
  userAddress: "0x...",
  action: "refund"
}
    ↓
Backend validates request
    ↓
Web3: contract.refund(user)
    ↓
Log transaction
    ↓
Return { success: true, txHash }
```

## 🔐 Security Features

### Input Validation
- ✅ Ethereum address format validation
- ✅ Action type validation
- ✅ Amount validation (numeric, positive)
- ✅ Required field validation

### Web3 Security
- ✅ Private key stored in environment variables
- ✅ Gas limit protection
- ✅ Transaction monitoring
- ✅ Error handling and logging

### Rate Limiting (Recommended)
Consider adding rate limiting middleware:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/meechain/trigger', limiter);
```

## 📊 Database Logging

Transactions are logged with the following structure:

```typescript
{
  user: string;           // User address
  action: ActionType;     // replay, supply, or refund
  txHash: string;         // Transaction hash
  status: string;         // pending, success, or failed
  timestamp: number;      // Unix timestamp
  amount?: string;        // Amount (for replay)
}
```

Logs are stored in:
1. **In-memory storage** (fallback)
2. **Firebase Firestore** (if configured)

## 🧪 Testing

Run tests:
```bash
npm test tests/meebotAPI.test.ts
```

Test coverage includes:
- Type definitions validation
- Request validation
- Address validation
- Transaction log structure
- Response structure
- Security features
- Error handling

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RPC_URL` | Yes | BSC RPC endpoint URL |
| `CONTRACT_ADDRESS` | Yes | Deployed MeeChainSupply contract address |
| `MEEBOT_WALLET_ADDRESS` | Yes | MeeBot wallet address (must match contract) |
| `PRIVATE_KEY` | Yes | Private key for signing transactions |
| `PORT` | No | Server port (default: 3000) |

### Multi-Chain Support

To support multiple chains, update the configuration:

```typescript
const chains = {
  bsc: {
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    contractAddress: '0x...',
    chainId: 56
  },
  polygon: {
    rpcUrl: 'https://polygon-rpc.com/',
    contractAddress: '0x...',
    chainId: 137
  }
};
```

## 📈 Monitoring

### Transaction Monitoring

The API automatically monitors transaction status:
1. Transaction is sent to blockchain
2. Returns immediately with txHash
3. Polls for transaction receipt (2s delay)
4. Updates log status (success/failed)

### Logging

All operations are logged to console:
```
✅ Web3 initialized
📍 RPC: https://...
📝 Contract: 0x...
🔄 Executing confirmReplay for 0x...
✅ Transaction confirmed successfully
```

## 🚨 Error Handling

### Common Errors

1. **Missing environment variables**
   ```
   Error: Missing required environment variables: RPC_URL
   ```
   Solution: Check `.env` file

2. **Invalid address**
   ```
   Error: Invalid Ethereum address
   ```
   Solution: Verify address format (0x + 40 hex chars)

3. **Transaction failed**
   ```
   Error: Transaction execution failed
   ```
   Solution: Check gas, contract state, permissions

4. **Web3 not initialized**
   ```
   Error: Web3 not initialized
   ```
   Solution: Ensure server started properly

## 🛡️ Production Deployment

### Security Checklist

- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/TLS
- [ ] Add rate limiting
- [ ] Implement authentication/authorization
- [ ] Use Gnosis Safe or multi-sig for production
- [ ] Monitor transaction costs
- [ ] Set up error alerting
- [ ] Configure CORS properly
- [ ] Use process manager (PM2, systemd)
- [ ] Set up backup RPC endpoints

### Deployment Example (PM2)

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start api/server.js --name meebot-api

# Monitor
pm2 monit

# Logs
pm2 logs meebot-api
```

### Docker Support

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "api/server.js"]
```

Build and run:
```bash
docker build -t meebot-api .
docker run -p 3000:3000 --env-file .env meebot-api
```

## 🤝 Integration Examples

### Frontend Integration (React)

```typescript
import axios from 'axios';

async function confirmReplay(userAddress: string, amount: string) {
  try {
    const response = await axios.post('http://localhost:3000/api/meechain/trigger', {
      userAddress,
      action: 'replay',
      amountBNB: amount
    });
    
    console.log('Transaction hash:', response.data.txHash);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data?.error);
    throw error;
  }
}

async function triggerSupply(userAddress: string) {
  const response = await axios.post('http://localhost:3000/api/meechain/trigger', {
    userAddress,
    action: 'supply'
  });
  return response.data;
}
```

### Flow Editor Integration

```javascript
// Node.js Flow Editor node
const axios = require('axios');

module.exports = function(RED) {
  function MeeChainTriggerNode(config) {
    RED.nodes.createNode(this, config);
    
    this.on('input', async function(msg) {
      try {
        const response = await axios.post('http://localhost:3000/api/meechain/trigger', {
          userAddress: msg.payload.userAddress,
          action: msg.payload.action,
          amountBNB: msg.payload.amountBNB
        });
        
        msg.payload = response.data;
        this.send(msg);
      } catch (error) {
        this.error(error);
      }
    });
  }
  
  RED.nodes.registerType('meechain-trigger', MeeChainTriggerNode);
};
```

## 📚 Additional Resources

- [MeeChain Supply Contract](../contracts/MeeChainSupply.sol)
- [Deployment Guide](../MEECHAIN_SUPPLY_GUIDE.md)
- [Quick Reference](../MEECHAIN_SUPPLY_QUICK_REFERENCE.md)
- [Contract Tests](../tests/meeChainSupply.test.ts)

## 🐛 Troubleshooting

### Issue: Server won't start
- Check environment variables
- Verify RPC endpoint is accessible
- Ensure port is not in use

### Issue: Transactions fail
- Verify contract address is correct
- Check wallet has sufficient balance for gas
- Ensure MEEBOT_WALLET_ADDRESS matches contract's meeBot address
- Review contract state (is replay confirmed?)

### Issue: Logs not saving
- Check Firebase configuration
- Verify Firebase credentials
- Check in-memory logs: console output

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review test cases
3. Check contract documentation
4. Review error logs

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-19  
**Status**: ✅ Production Ready

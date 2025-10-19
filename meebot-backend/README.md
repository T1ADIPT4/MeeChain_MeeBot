# MeeBot Backend

Express.js backend API for interacting with MeeChain Supply smart contract on Binance Smart Chain.

## 📁 Project Structure

```
meebot-backend/
├── .env                      # Environment configuration (create from .env.example)
├── .env.example              # Example environment variables
├── abi/
│   └── MeeChainSupply.json  # Contract ABI
├── logs/
│   └── tx.log               # Transaction logs
├── index.js                 # Main Express server
├── package.json             # Node.js dependencies
└── README.md                # This file
```

## 🚀 Setup

### 1. Install Dependencies

```bash
cd meebot-backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
RPC_URL=https://bsc-dataseed.binance.org
CONTRACT_ADDRESS=0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F
MEEBOT_WALLET_ADDRESS=0xYourSignerAddress
PRIVATE_KEY=your_private_key_here
PORT=3000
```

**⚠️ Security Warning:** Never commit your actual private key to version control!

### 3. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## 📡 API Endpoints

### 1. Trigger MeeChain Action

**Endpoint:** `POST /api/meechain/trigger`

**Description:** Execute a MeeChain Supply contract action (replay confirmation, supply trigger, or refund).

**Request Body:**

```json
{
  "userAddress": "0xabc123...",
  "action": "replay",
  "amountBNB": "0.01"
}
```

**Actions:**

- `replay` - Confirm replay and set pending supply amount (requires `amountBNB`)
- `supply` - Trigger token supply to user (after replay confirmation)
- `refund` - Issue refund if replay verification failed

**Response (Success):**

```json
{
  "success": true,
  "message": "✅ Action \"replay\" completed successfully",
  "txHash": "0x...",
  "status": "success",
  "blockNumber": 12345678,
  "gasUsed": 45678
}
```

**Response (Error):**

```json
{
  "error": "Transaction failed",
  "details": "Error message..."
}
```

### 2. Get User Status

**Endpoint:** `GET /api/meechain/status/:address`

**Description:** Get user's replay confirmation status and pending supply amount.

**Example:**

```bash
curl http://localhost:3000/api/meechain/status/0xabc123...
```

**Response:**

```json
{
  "address": "0xabc123...",
  "replayConfirmed": true,
  "pendingSupply": "0.01",
  "pendingSupplyWei": "10000000000000000"
}
```

### 3. Health Check

**Endpoint:** `GET /health`

**Description:** Check if the server is running and view configuration.

**Response:**

```json
{
  "status": "ok",
  "service": "MeeBot Backend",
  "network": "https://bsc-dataseed.binance.org",
  "contract": "0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F"
}
```

## 🧪 Testing with cURL

### Confirm Replay

```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0xabc123...",
    "action": "replay",
    "amountBNB": "0.01"
  }'
```

### Trigger Supply

```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0xabc123...",
    "action": "supply"
  }'
```

### Issue Refund

```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0xabc123...",
    "action": "refund"
  }'
```

### Check User Status

```bash
curl http://localhost:3000/api/meechain/status/0xabc123...
```

### Health Check

```bash
curl http://localhost:3000/health
```

## 📊 Transaction Logs

All transactions are logged to `logs/tx.log` in JSON format. Each log entry includes:

- `userAddress` - User's wallet address
- `action` - Action performed (replay/supply/refund)
- `txHash` - Transaction hash
- `status` - Transaction status (pending/success/failed/error)
- `timestamp` - Unix timestamp
- `blockNumber` - Block number (for successful transactions)
- `gasUsed` - Gas used (for successful transactions)

Example log entry:

```json
{"userAddress":"0xabc...","action":"replay","txHash":"0x123...","status":"pending","timestamp":1234567890}
{"txHash":"0x123...","status":"success","block":12345678,"gasUsed":45678,"timestamp":1234567891}
```

## 🚀 Next Steps

- ✅ Integrate with MetaMask frontend using `window.ethereum`
- 📡 Add webhook notifications for successful operations
- 🧾 Connect with Flow Editor for user action selection
- 🔐 Consider using Gnosis Safe or Biconomy for multisig security
- 📊 Add monitoring and alerting for transaction failures
- 🔒 Implement rate limiting to prevent abuse
- 🔑 Use environment-specific configurations for testnet/mainnet

## 🔒 Security Considerations

1. **Private Key Protection**
   - Never commit private keys to git
   - Use environment variables only
   - Consider using hardware wallets or key management services

2. **Authorization**
   - Ensure MEEBOT_WALLET_ADDRESS is authorized in the contract
   - Implement API authentication if exposing publicly

3. **Rate Limiting**
   - Add rate limiting to prevent spam
   - Monitor for suspicious activity

4. **Gas Management**
   - Monitor gas prices and adjust as needed
   - Keep gas limits reasonable (current: 300,000)

5. **Error Handling**
   - All errors are logged
   - Failed transactions are recorded in logs

## 📞 Support

For issues or questions:
- See main repository documentation
- Check contract at `contracts/MeeChainSupply.sol`
- Review transaction logs in `logs/tx.log`

---

**Version:** 1.0.0  
**Status:** ✅ Ready for use

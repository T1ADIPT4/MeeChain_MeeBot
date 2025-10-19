# MeeBot Backend - Quick Start Guide

Get your MeeBot backend API server up and running in 5 minutes!

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A BSC wallet with private key
- Access to BSC RPC endpoint (public or private)
- Deployed MeeChainSupply contract address

## 🚀 5-Minute Setup

### Step 1: Navigate to Backend Directory

```bash
cd meebot-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express (Web server framework)
- web3 (Blockchain interaction library)
- dotenv (Environment variable loader)

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your actual values
nano .env
```

Update these required values in `.env`:

```env
# Required: BSC RPC endpoint
RPC_URL=https://bsc-dataseed.binance.org

# Required: Your deployed MeeChainSupply contract address
CONTRACT_ADDRESS=0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F

# Required: Your wallet address (must be authorized as MeeBot in contract)
MEEBOT_WALLET_ADDRESS=0xYourActualWalletAddress

# Required: Your wallet private key (never share or commit this!)
PRIVATE_KEY=your_actual_private_key_without_0x_prefix

# Optional: Server port (defaults to 3000)
PORT=3000
```

**⚠️ Security Warning:**
- Never commit your `.env` file to git
- Keep your private key secure
- Use a dedicated wallet for MeeBot operations
- Consider using environment variables in production

### Step 4: Verify Setup

```bash
node test-setup.js
```

You should see:
```
✅ Setup verification PASSED - backend is ready!
```

### Step 5: Start the Server

```bash
npm start
```

You should see:
```
🚀 MeeBot backend running on port 3000
📡 Network: https://bsc-dataseed.binance.org
📝 Contract: 0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F
👤 Signer: 0xYourWalletAddress

📚 Available endpoints:
  - POST /api/meechain/trigger
  - GET  /api/meechain/status/:address
  - GET  /health
```

## ✅ Test Your Setup

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "MeeBot Backend",
  "network": "https://bsc-dataseed.binance.org",
  "contract": "0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F"
}
```

### 2. Check User Status

Replace `USER_ADDRESS` with an actual wallet address:

```bash
curl http://localhost:3000/api/meechain/status/0xUSER_ADDRESS
```

Expected response:
```json
{
  "address": "0xUSER_ADDRESS",
  "replayConfirmed": false,
  "pendingSupply": "0",
  "pendingSupplyWei": "0"
}
```

### 3. Trigger an Action (Example)

**⚠️ This will execute a real transaction! Make sure you have:**
- Sufficient BNB for gas fees
- Authorization in the contract
- A valid user address

```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0xUSER_ADDRESS",
    "action": "replay",
    "amountBNB": "0.01"
  }'
```

Expected response (on success):
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

## 🎯 Common Actions

### Confirm Replay (Step 1 of supply process)

```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0xUSER_ADDRESS",
    "action": "replay",
    "amountBNB": "0.01"
  }'
```

### Trigger Supply (Step 2 - after replay confirmed)

```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0xUSER_ADDRESS",
    "action": "supply"
  }'
```

### Issue Refund (If replay verification failed)

```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0xUSER_ADDRESS",
    "action": "refund"
  }'
```

## 📊 View Transaction Logs

All transactions are automatically logged to `logs/tx.log`:

```bash
# View recent transactions
tail -f logs/tx.log

# View all transactions (formatted)
cat logs/tx.log | jq .
```

Example log entry:
```json
{"userAddress":"0x...","action":"replay","txHash":"0x...","status":"pending","timestamp":1234567890}
{"txHash":"0x...","status":"success","block":12345678,"gasUsed":45678,"timestamp":1234567891}
```

## 🐛 Troubleshooting

### Server won't start

**Problem:** `Error: Cannot find module 'express'`
**Solution:** Run `npm install`

**Problem:** `Error: Missing environment variables`
**Solution:** Make sure `.env` file exists with all required values

### Transaction fails

**Problem:** `Transaction failed: Insufficient funds`
**Solution:** Add BNB to your MeeBot wallet for gas fees

**Problem:** `Transaction failed: Not authorized`
**Solution:** Ensure your MEEBOT_WALLET_ADDRESS is authorized in the contract

**Problem:** `Transaction failed: Invalid address`
**Solution:** Check that userAddress is a valid Ethereum/BSC address

### Can't connect to network

**Problem:** `Error: Connection timeout`
**Solution:** Check your RPC_URL is accessible. Try alternative BSC RPC endpoints:
- `https://bsc-dataseed1.binance.org`
- `https://bsc-dataseed2.binance.org`
- `https://bsc-dataseed3.binance.org`

## 🔐 Production Deployment

For production use, consider:

1. **Use a Process Manager**
   ```bash
   npm install -g pm2
   pm2 start index.js --name meebot-backend
   pm2 save
   pm2 startup
   ```

2. **Enable HTTPS**
   - Use a reverse proxy (nginx, caddy)
   - Get SSL certificate (Let's Encrypt)

3. **Add Authentication**
   - Implement API key validation
   - Rate limiting
   - IP whitelisting

4. **Monitor Logs**
   - Set up log rotation
   - Use log aggregation (e.g., ELK stack)
   - Set up alerts for errors

5. **Use Environment-Specific Config**
   - Testnet for development
   - Mainnet for production
   - Separate wallets for each

## 📚 Next Steps

- ✅ Read the full [README.md](README.md) for detailed API documentation
- 🔒 Review security best practices
- 📊 Set up monitoring and alerts
- 🌐 Integrate with your frontend application
- 🤖 Connect with MeeBot Flow Editor
- 📡 Add webhook notifications

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the contract at `../contracts/MeeChainSupply.sol`
- Check transaction logs in `logs/tx.log`
- Verify contract authorization
- Test on BSC testnet first

---

**Quick Command Reference:**

```bash
npm install              # Install dependencies
node test-setup.js       # Verify setup
npm start                # Start server
npm run dev              # Start with auto-reload
curl localhost:3000/health  # Test server
```

Happy coding! 🚀

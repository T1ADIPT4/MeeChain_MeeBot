# 🚀 MeeBot Web3 Backend Quick Start

Get started with the MeeBot Web3 Backend API in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your values
nano .env
```

Add these values to `.env`:

```env
RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
CONTRACT_ADDRESS=0x...  # Your MeeChainSupply contract
MEEBOT_WALLET_ADDRESS=0x...  # MeeBot wallet address
PRIVATE_KEY=your_private_key_here
PORT=3000
```

### 3. Start the Server

**Development mode:**
```bash
npm run api:dev
```

**Production mode:**
```bash
npm run api:start
```

Server will be available at: `http://localhost:3000`

## 🧪 Test the API

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": 1234567890,
  "service": "MeeBot Web3 Backend"
}
```

### Confirm Replay

```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x1234567890123456789012345678901234567890",
    "action": "replay",
    "amountBNB": "0.01"
  }'
```

### Trigger Supply

```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x1234567890123456789012345678901234567890",
    "action": "supply"
  }'
```

### Process Refund

```bash
curl -X POST http://localhost:3000/api/meechain/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x1234567890123456789012345678901234567890",
    "action": "refund"
  }'
```

## 📝 Example Code

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/meechain/trigger';

async function confirmReplay(userAddress: string, amount: string) {
  const response = await axios.post(API_URL, {
    userAddress,
    action: 'replay',
    amountBNB: amount
  });
  console.log('TX Hash:', response.data.txHash);
}

confirmReplay('0x1234567890123456789012345678901234567890', '0.01');
```

### React

```tsx
import React, { useState } from 'react';
import axios from 'axios';

function SupplyButton({ userAddress }: { userAddress: string }) {
  const [loading, setLoading] = useState(false);

  const handleSupply = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/meechain/trigger',
        { userAddress, action: 'supply' }
      );
      alert(`✅ Success! TX: ${response.data.txHash}`);
    } catch (error: any) {
      alert(`❌ Error: ${error.response?.data?.error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSupply} disabled={loading}>
      {loading ? 'Processing...' : 'Trigger Supply'}
    </button>
  );
}
```

## 🔄 Complete Workflow

1. **User initiates replay verification** (off-chain)
2. **Confirm replay on blockchain**
   ```bash
   POST /api/meechain/trigger
   { userAddress: "0x...", action: "replay", amountBNB: "0.01" }
   ```
3. **User claims tokens** (frontend button click)
4. **Trigger supply on blockchain**
   ```bash
   POST /api/meechain/trigger
   { userAddress: "0x...", action: "supply" }
   ```
5. **Tokens transferred to user** ✅

### If Replay Fails

1. **Process refund**
   ```bash
   POST /api/meechain/trigger
   { userAddress: "0x...", action: "refund" }
   ```
2. **Tokens returned to user** ✅

## 📚 Learn More

- **Full Documentation**: [MEEBOT_WEB3_BACKEND_GUIDE.md](./MEEBOT_WEB3_BACKEND_GUIDE.md)
- **API Reference**: [api/README.md](./api/README.md)
- **Integration Examples**: [examples/api-integration-demo.ts](./examples/api-integration-demo.ts)
- **Tests**: Run `npm test tests/meebotAPI.test.ts`

## 🐛 Troubleshooting

### Server won't start?
- Check `.env` file has all required variables
- Verify RPC endpoint is accessible
- Ensure port 3000 is not in use

### Transactions fail?
- Verify contract address is correct
- Check wallet has sufficient BNB for gas
- Ensure MEEBOT_WALLET_ADDRESS matches contract's meeBot address

### Need help?
- Read [MEEBOT_WEB3_BACKEND_GUIDE.md](./MEEBOT_WEB3_BACKEND_GUIDE.md)
- Check [api/README.md](./api/README.md)
- Review test cases in `tests/meebotAPI.test.ts`

## 🎉 Success!

You're all set! The MeeBot Web3 Backend is now ready to handle:
- ✅ Replay confirmations
- ✅ Token supply triggers
- ✅ Refund processing
- ✅ Transaction monitoring

Happy coding! 🚀

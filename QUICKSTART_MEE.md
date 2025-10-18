# MeeChain Token (MEE) - Quick Start Guide

## 🚀 For Developers

### 1. Deploy Smart Contract

**Option A: Remix IDE (Easiest)**
1. Open https://remix.ethereum.org/
2. Create `MeeChainToken.sol` and paste contract code from `contracts/MeeChainToken.sol`
3. Compile with Solidity 0.8.20
4. Deploy to BSC Testnet
5. Copy contract address

**Option B: Hardhat**
```bash
npm install --save-dev hardhat @openzeppelin/contracts dotenv
cp hardhat.config.example.js hardhat.config.js
cp .env.example .env
# Edit .env with your PRIVATE_KEY
npx hardhat run scripts/deployMEEToken.js --network bscTestnet
```

### 2. Configure Frontend

Update contract address in BOTH files:
- `viewer/config/contracts.ts`
- `viewer/src/config/contracts.ts`

```typescript
export const MEE_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE";
```

### 3. Run Development Server

```bash
cd viewer
npm install
npm run dev
```

Open http://localhost:5173

## 👥 For End Users

### How to Swap T2P → MEE

1. **Connect Wallet**
   - Click "เชื่อมต่อกระเป๋าเงิน"
   - Approve MetaMask connection

2. **Enter Amount**
   - Type T2P amount to swap
   - See MEE amount you'll receive (10 T2P = 1 MEE)

3. **Swap**
   - Click "แลกเลยครับ"
   - Approve T2P spending in MetaMask
   - Wait for transaction confirmation
   - Receive MEE tokens

4. **Check Balance**
   - View MEE in MetaMask
   - Add MEE token contract if needed

## 📚 Full Documentation

- **Comprehensive Guide:** [MEECHAIN_TOKEN_GUIDE.md](MEECHAIN_TOKEN_GUIDE.md)
- **Implementation Details:** [SWAP_IMPLEMENTATION_SUMMARY.md](SWAP_IMPLEMENTATION_SUMMARY.md)
- **Smart Contract:** [contracts/MeeChainToken.sol](contracts/MeeChainToken.sol)

## 🔗 Important Links

- **BSC Testnet Faucet:** https://testnet.bnbchain.org/faucet-smart
- **BSC Testnet Explorer:** https://testnet.bscscan.com
- **BSC Mainnet Explorer:** https://bscscan.com
- **Remix IDE:** https://remix.ethereum.org

## ⚠️ Security Notes

- Never share your private key
- Test on testnet first
- Verify contract addresses
- Use small amounts for initial testing
- Smart contract audit recommended for mainnet

## 🆘 Troubleshooting

**Wallet won't connect?**
- Install MetaMask browser extension
- Switch to BSC network in MetaMask

**Transaction failed?**
- Check BNB balance for gas fees
- Verify sufficient T2P balance
- Try increasing gas price

**MEE not showing?**
- Add MEE token to MetaMask using contract address
- Check transaction on BscScan explorer

---

Need help? Check the full guides or create an issue on GitHub.

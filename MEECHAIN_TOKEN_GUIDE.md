# MeeChain Token (MEE) Smart Contract และระบบแลก T2P → MEE

## 📋 Overview

โปรเจคนี้ประกอบด้วย:
1. **MeeChainToken.sol** - Smart Contract สำหรับ MEE Token (BEP-20/ERC-20)
2. **SwapT2PtoMEE** - React Component สำหรับแลก T2P เป็น MEE
3. **ABIs และ Config** - ไฟล์สำหรับเชื่อมต่อกับ Smart Contracts

---

## 🚀 Quick Start

### 1. Smart Contract Deployment

#### Prerequisites
- Node.js >= 16
- Hardhat หรือ Remix IDE
- MetaMask wallet with BNB for deployment
- Private key ที่มี BNB สำหรับ gas fees

#### Deploy ด้วย Hardhat

```bash
# Install dependencies
npm install @openzeppelin/contracts

# Create hardhat project (if not exists)
npx hardhat

# Deploy
npx hardhat run scripts/deploy.js --network bscTestnet
```

#### Deploy ด้วย Remix IDE

1. ไปที่ https://remix.ethereum.org/
2. สร้างไฟล์ใหม่ `MeeChainToken.sol` 
3. Copy code จาก `contracts/MeeChainToken.sol`
4. Compile (Solidity 0.8.20)
5. Deploy to BNB Smart Chain (Testnet หรือ Mainnet)
6. Save contract address

---

### 2. Update Contract Addresses

หลังจาก deploy MeeChainToken แล้ว:

**File: `viewer/config/contracts.ts`**
```typescript
export const T2P_ADDRESS = "0x765ddcca3849ef7cf3b8203ca79705bebf864444";
export const MEE_ADDRESS = "0xYOUR_DEPLOYED_MEE_CONTRACT_ADDRESS"; // ⚠️ Update this!
export const EXCHANGE_RATE = 10n; // 10 T2P = 1 MEE
```

**File: `viewer/src/config/contracts.ts`**
```typescript
export const MEE_ADDRESS = "0xYOUR_DEPLOYED_MEE_CONTRACT_ADDRESS"; // ⚠️ Update this!
```

---

### 3. Install Frontend Dependencies

```bash
cd viewer
npm install ethers
npm install
```

---

### 4. Run Development Server

```bash
cd viewer
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

---

## 📁 Project Structure

```
MeeChain_MeeBot/
├── contracts/
│   └── MeeChainToken.sol          # Smart Contract สำหรับ MEE Token
│
├── viewer/
│   ├── abis/                      # Contract ABIs
│   │   ├── MeeChainToken.json
│   │   └── T2P.json
│   │
│   ├── components/
│   │   ├── SwapT2PtoMEE.tsx      # Swap Component (หน้าแลก T2P → MEE)
│   │   └── ConnectWalletButton.tsx
│   │
│   ├── config/
│   │   └── contracts.ts           # Contract addresses & config
│   │
│   ├── services/
│   │   └── blockchainService.ts   # Blockchain interaction layer
│   │
│   └── types/
│       └── global.d.ts            # TypeScript declarations
```

---

## 🔑 Smart Contract Details

### MeeChainToken.sol

**Features:**
- ✅ ERC-20 standard (compatible with BEP-20)
- ✅ Mintable (owner only)
- ✅ Burnable (anyone can burn their own tokens)
- ✅ Initial supply: 1,000,000 MEE
- ✅ 18 decimals

**Key Functions:**

```solidity
// Mint MEE tokens (owner only)
function mint(address to, uint256 amount) external onlyOwner

// Burn MEE tokens
function burn(uint256 amount) external

// Standard ERC-20 functions
function transfer(address to, uint256 amount) external returns (bool)
function approve(address spender, uint256 amount) external returns (bool)
function transferFrom(address from, address to, uint256 amount) external returns (bool)
```

---

## 🔄 Swap Flow (T2P → MEE)

### User Journey:

1. **Connect Wallet** - ผู้ใช้เชื่อมต่อ MetaMask
2. **Enter Amount** - กรอกจำนวน T2P ที่ต้องการแลก
3. **Preview** - ระบบแสดงจำนวน MEE ที่จะได้รับ (อัตรา 10:1)
4. **Approve** - อนุมัติให้ contract ใช้ T2P
5. **Transfer** - โอน T2P ไปยัง MEE contract
6. **Mint** - ได้รับ MEE เข้า wallet

### Technical Flow:

```typescript
1. Check T2P balance
2. Approve T2P transfer
3. Transfer T2P to MEE contract
4. Mint MEE to user (requires owner permission in production)
```

---

## 🎨 UI Component

### SwapT2PtoMEE

**Props:** None (uses Web3 context)

**States:**
- `amount` - จำนวน T2P ที่ต้องการแลก
- `status` - สถานะการทำรายการ
- `isLoading` - สถานะ loading

**Features:**
- ✅ Real-time MEE calculation
- ✅ Balance validation
- ✅ Transaction status updates
- ✅ Error handling
- ✅ Thai language support

---

## ⚙️ Configuration

### Exchange Rate

แก้ไขอัตราแลกเปลี่ยนที่ `viewer/config/contracts.ts`:

```typescript
export const EXCHANGE_RATE = 10n; // 10 T2P = 1 MEE
```

### Network Configuration

ตรวจสอบให้แน่ใจว่า MetaMask เชื่อมต่อกับ network ที่ถูกต้อง:

**BNB Smart Chain Testnet:**
- Network Name: BSC Testnet
- RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
- Chain ID: 97
- Symbol: BNB
- Block Explorer: https://testnet.bscscan.com

**BNB Smart Chain Mainnet:**
- Network Name: BSC Mainnet
- RPC URL: https://bsc-dataseed.binance.org/
- Chain ID: 56
- Symbol: BNB
- Block Explorer: https://bscscan.com

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Deploy MeeChainToken to testnet
- [ ] Update contract addresses in config
- [ ] Connect MetaMask to testnet
- [ ] Get test BNB from faucet
- [ ] Get test T2P tokens
- [ ] Test swap functionality
- [ ] Verify MEE balance after swap
- [ ] Test error cases (insufficient balance, rejected transaction)

### Automated Tests

เพิ่มทีหลังถ้าต้องการ:

```bash
npm run test
```

---

## 🔐 Security Considerations

### Production Deployment

⚠️ **Important:** ระบบ swap ปัจจุบันเป็น simplified version

สำหรับ production ควรมี:

1. **Swap Contract** - Contract แยกสำหรับจัดการ swap logic
2. **Rate Oracle** - ระบบกำหนดอัตราแลกเปลี่ยนแบบ dynamic
3. **Liquidity Pool** - Pool สำหรับเก็บ tokens
4. **Access Control** - จำกัดสิทธิ์ mint เฉพาะ swap contract
5. **Pause Mechanism** - ระบบหยุดฉุกเฉิน
6. **Audit** - ตรวจสอบโดยผู้เชี่ยวชาญก่อน deploy mainnet

### Current Limitations

- ❌ Swap ไม่ได้ทำงานอัตโนมัติ 100% (ต้องมี owner mint ให้)
- ❌ ยังไม่มี rate oracle
- ❌ ยังไม่มี liquidity management

**สำหรับ Production:**
สร้าง Swap Contract แยก:

```solidity
contract T2PtoMEESwap {
    IERC20 public t2pToken;
    MeeChainToken public meeToken;
    uint256 public rate = 10;
    
    function swap(uint256 t2pAmount) external {
        require(t2pToken.transferFrom(msg.sender, address(this), t2pAmount));
        uint256 meeAmount = t2pAmount / rate;
        meeToken.mint(msg.sender, meeAmount);
    }
}
```

---

## 📝 TODO

- [ ] สร้าง Swap Contract แยก
- [ ] เพิ่ม unit tests
- [ ] เพิ่ม integration tests
- [ ] Audit smart contracts
- [ ] เพิ่ม rate oracle
- [ ] Dashboard แสดงยอด T2P/MEE
- [ ] ระบบ badge เมื่อแลกสำเร็จ
- [ ] Multi-language support (EN, TH)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📞 Support

หากมีปัญหาหรือคำถาม:
- GitHub Issues: https://github.com/T1ADIPT4/MeeChain_MeeBot/issues
- Email: support@meechain.com

---

## 📄 License

MIT License - ดูรายละเอียดใน LICENSE file

---

## 🎯 MeeBot Integration

### Flow: `exchange_thai_v1`

**Step:** "แลก T2P เพื่อรับ MEE"

**Fallback Message:**
```
ยังไม่ได้เชื่อมต่อกระเป๋าเงินเลยครับ ลองใหม่อีกครั้งนะครับ 🙏
```

**Success Message:**
```
✅ แลกสำเร็จแล้วครับ! คุณได้รับ X MEE
```

---

สร้างโดย MeeChain Team 🚀

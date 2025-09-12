
# 🚀 MeeChain DApp

Frontend application สำหรับ MeeChain Web3 ecosystem ที่พัฒนาด้วย React + TypeScript + Tailwind CSS

## ✨ Features

- 🔗 **Web3 Integration**: เชื่อมต่อกับ MetaMask และ Fuse Network
- 🤖 **MeeBot AI**: ผู้ช่วย AI ที่คอยแนะนำการใช้งาน
- 🏆 **NFT System**: ระบบ Badge NFT และการอัปเกรด
- 💰 **Token Management**: จัดการ MeeToken และรับรางวัล
- 🎯 **Quest System**: ภารกิจและกิจกรรมรับรางวัล
- 🛍️ **Marketplace**: ซื้อขาย NFT และ collectibles

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI
- **Web3**: Ethers.js + MetaMask
- **State**: React Query + Context API
- **Routing**: Wouter (lightweight router)

## 🏃‍♂️ Quick Start

```bash
# ติดตั้ง dependencies
cd meechain-dapp
npm install

# คัดลอกและตั้งค่า environment variables
cp .env.example .env

# เริ่ม development server
npm run dev

# เข้าถึงแอปได้ที่ http://localhost:3000
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # UI components (Radix + Tailwind)
│   ├── web3/           # Web3 related components
│   └── meebot/         # MeeBot AI components
├── hooks/              # Custom React hooks
├── pages/              # Page components (routes)
├── assets/             # Static assets
└── types/              # TypeScript type definitions
```

## 🔧 Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌍 Environment Variables

ตั้งค่าในไฟล์ `.env`:

- `VITE_MEE_TOKEN_ADDRESS`: Smart contract address ของ MeeToken
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_FUSE_RPC_URL`: Fuse Network RPC endpoint

## 🚀 Deployment

สำหรับ production deployment บน Replit:

1. ตั้งค่า environment variables ใน Replit Secrets
2. Build project: `npm run build`
3. Deploy ผ่าน Replit deployment system

## 🤝 Contributing

1. Fork repository
2. สร้าง feature branch
3. Commit การเปลี่ยนแปลง
4. สร้าง Pull Request

---

พัฒนาโดยทีม MeeChain 🐻⛓️

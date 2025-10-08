# MeeChain MeeBot - Build & Deploy Workflow

โครงสร้าง workflow ที่ชัดเจนสำหรับ build และ deploy โปรเจกต์ MeeChain พร้อม fallback-aware logic

---

## 🧩 1. โครงสร้างโปรเจกต์

```
MeeChain_MeeBot/
├─ src/                      # Backend - Quest System (TypeScript)
│   ├─ QuestManager.ts       # Main orchestrator
│   ├─ verifiers/            # Quest verification logic
│   ├─ minting/              # Badge minting with fallback
│   ├─ utils/                # Logger and utilities
│   ├─ example.ts            # Usage examples
│   └─ test.ts               # Test suite
│
├─ src-frontend/             # Frontend - React App (TypeScript)
│   ├─ components/           # UI components
│   │   ├─ MeeBot.tsx        # MeeBot sprite component
│   │   ├─ StatusMessage.tsx # Status display component
│   │   └─ Navigation.tsx    # Navigation menu
│   ├─ pages/                # Page components
│   │   ├─ HomePage.tsx
│   │   ├─ MintBadgePage.tsx
│   │   ├─ NFTFootballPage.tsx
│   │   ├─ SettingsPage.tsx
│   │   └─ SupportPage.tsx
│   ├─ hooks/                # Custom React hooks (สำหรับ useMeeBotSpeech, etc.)
│   ├─ utils/                # Frontend utilities (fallbackAwareMint.ts, etc.)
│   ├─ assets/               # รูปภาพ, sprite, icon
│   ├─ routes.tsx            # Route definitions
│   ├─ App.tsx               # Main App component
│   ├─ main.tsx              # Entry point
│   └─ index.html            # HTML template
│
├─ public/                   # Static assets
├─ dist/                     # Backend build output
├─ dist-frontend/            # Frontend build output (สำหรับ deploy)
├─ vite.config.ts            # Vite configuration
├─ tsconfig.json             # TypeScript root config
├─ tsconfig.backend.json     # Backend TS config
├─ tsconfig.app.json         # Frontend TS config
├─ .eslintrc.cjs             # ESLint configuration
└─ package.json              # Dependencies & scripts
```

---

## ⚙️ 2. Build Workflow

### 🔹 ติดตั้ง Dependencies

```bash
npm install
```

> ✅ ติดตั้งทั้ง backend และ frontend dependencies ครั้งเดียว

### 🔹 Development Mode

```bash
# เปิด dev server สำหรับ React app (พร้อม hot reload)
npm run dev

# หรือ build backend แบบ watch mode
npm run dev:backend
```

### 🔹 Building

#### Build ทั้งหมด

```bash
npm run build
```

> ✅ Build ทั้ง backend (TypeScript) และ frontend (Vite) พร้อมกัน

#### Build แยกส่วน

```bash
# Backend only (Quest System)
npm run build:backend

# Frontend only (React App)
npm run build:frontend
```

### 🔹 Testing & Examples

```bash
# Run backend tests (10 comprehensive tests)
npm test

# Run usage examples
npm run example

# Preview production build
npm run preview
```

### 🔹 ตัวอย่าง Output

```
dist/                     # Backend output
├── QuestManager.js
├── QuestManager.d.ts
├── verifiers/
├── minting/
└── utils/

dist-frontend/            # Frontend output (พร้อม deploy)
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── index.js
```

---

## 🚀 3. Deploy Workflow

### ✅ Option 1: GitHub Pages

```bash
# 1. Build project
npm run build

# 2. Deploy dist-frontend to GitHub Pages
npx gh-pages -d dist-frontend
```

**การตั้งค่าใน vite.config.ts:**

```ts
export default defineConfig({
  base: '/MeeChain_MeeBot/',  // ✅ ตั้งค่า base path สำหรับ GitHub Pages
  // ...
})
```

**การตั้งค่าใน main.tsx:**

```tsx
<BrowserRouter basename="/MeeChain_MeeBot">
  <App />
</BrowserRouter>
```

---

### ✅ Option 2: Vercel

1. Connect GitHub repository to Vercel
2. ตั้งค่า:
   - **Build Command:** `npm run build:frontend`
   - **Output Directory:** `dist-frontend`
   - **Install Command:** `npm install`
3. Deploy จะทำอัตโนมัติทุกครั้งที่ push

> ✅ รองรับ fallback-aware UI และ dynamic routing ได้ดี

---

### ✅ Option 3: Netlify

1. Connect GitHub repository to Netlify
2. ตั้งค่า build settings:
   - **Build command:** `npm run build:frontend`
   - **Publish directory:** `dist-frontend`
3. Deploy automatically on git push

---

## 🧠 4. ตรวจสอบการแสดงผลของแต่ละหน้า/โมดูล

### 🔹 Modular Routing System

```tsx
// src-frontend/routes.tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/mint" element={<MintBadgePage />} />
  <Route path="/nft-football" element={<NFTFootballPage />} />
  <Route path="/settings" element={<SettingsPage />} />
  <Route path="/support" element={<SupportPage />} />
</Routes>
```

### 🔹 Preview แต่ละหน้าใน Development

```bash
# เริ่ม dev server
npm run dev

# เปิดเว็บบราวเซอร์และไปที่:
http://localhost:3000/              # Home
http://localhost:3000/mint          # Mint Badge
http://localhost:3000/nft-football  # NFT Football
http://localhost:3000/settings      # Settings
http://localhost:3000/support       # Support
```

> ✅ แต่ละหน้าเป็น self-contained component ที่แยกจากกันชัดเจน

---

## 📋 5. สรุป Workflow Table

| ขั้นตอน | คำสั่ง | หมายเหตุ |
|---------|--------|-----------|
| ติดตั้ง dependency | `npm install` | ครั้งแรกหลัง clone repo |
| พัฒนาแบบ local (Frontend) | `npm run dev` | เปิด Vite dev server (port 3000) |
| พัฒนาแบบ local (Backend) | `npm run dev:backend` | TypeScript watch mode |
| ตรวจสอบแต่ละหน้า | เปิด `/mint`, `/support`, `/settings` | ผ่าน React Router |
| Build backend | `npm run build:backend` | Output: `dist/` |
| Build frontend | `npm run build:frontend` | Output: `dist-frontend/` |
| Build ทั้งหมด | `npm run build` | Build ทั้ง backend และ frontend |
| Run tests | `npm test` | 10 comprehensive tests |
| Run examples | `npm run example` | Usage examples |
| Preview production | `npm run preview` | Preview built frontend |
| Deploy to GitHub Pages | `npx gh-pages -d dist-frontend` | ต้องตั้งค่า base path |
| Deploy to Vercel/Netlify | ผ่าน UI | Auto deploy on push |

---

## 🎯 6. Fallback-Aware Features

### Backend (Quest System)

- ✅ **Automatic fallback minting**: ถ้า primary chain ล้มเหลว จะ mint ที่ fallback chain ทันที
- ✅ **Event logging**: ทุกขั้นตอนมี log พร้อม context
- ✅ **Type-safe**: Full TypeScript implementation

### Frontend (React App)

- ✅ **MeeBot component**: แสดง emotion ตาม status (neutral, happy, confused)
- ✅ **StatusMessage component**: แสดงสถานะของการ mint
- ✅ **Responsive design**: รองรับทั้ง desktop และ mobile
- ✅ **Modular pages**: แยก logic และ UI ของแต่ละหน้าชัดเจน

---

## 🛠️ 7. Development Tips

### สร้าง Custom Hook

```tsx
// src-frontend/hooks/useMeeBotSpeech.ts
import { useState } from 'react'

export function useMeeBotSpeech() {
  const [speaking, setSpeaking] = useState(false)

  const speak = (text: string) => {
    setSpeaking(true)
    // Implement TTS logic here
    console.log(`🔊 MeeBot: ${text}`)
    setTimeout(() => setSpeaking(false), 2000)
  }

  return { speak, speaking }
}
```

### สร้าง Utility Function

```tsx
// src-frontend/utils/fallbackAwareMint.ts
import { handleQuestCompletion } from '@backend/QuestManager'

export async function fallbackAwareMint(userId: string, questId: string) {
  try {
    const result = await handleQuestCompletion(userId, questId)
    
    if (result.success) {
      return {
        success: true,
        message: result.fallback 
          ? '⚠️ Badge minted via fallback chain'
          : '✅ Badge minted successfully',
        tx: result.tx
      }
    }
    
    return { success: false, message: '❌ Minting failed' }
  } catch (error) {
    return { success: false, message: `Error: ${error}` }
  }
}
```

---

## 📚 8. Additional Resources

- 📖 [Quest System Overview](QUEST_SYSTEM.md)
- 🔌 [Integration Guide](INTEGRATION.md)
- 🏗️ [Architecture Documentation](ARCHITECTURE.md)
- 📦 [Package.json Scripts Reference](package.json)

---

## ✅ Checklist สำหรับ Production

- [ ] ✅ Build ผ่านโดยไม่มี error
- [ ] ✅ Tests ทั้งหมดผ่าน (10/10)
- [ ] ✅ ตรวจสอบทุกหน้าใน preview mode
- [ ] ✅ ตั้งค่า environment variables (`.env`)
- [ ] ✅ ตรวจสอบ routing ใน production
- [ ] ✅ ทดสอบ fallback mechanism
- [ ] ✅ Review security และ best practices

---

พร้อมลุยให้ระบบของคุณ robust, modular และ delightful ทุกเควส! 🚀

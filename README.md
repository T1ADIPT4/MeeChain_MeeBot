# MeeChain_MeeBot

MeeChain เป็นแพลตฟอร์ม Web3 ที่ออกแบบมาเพื่อสร้างประสบการณ์ที่สนุกและปลอดภัยผ่านระบบ NFT, Quest, และ MeeBot ที่มีอารมณ์ตอบสนองแบบเรียลไทม์

## 🔧 Features

- ✅ Fallback-aware multi-chain minting
- 🌐 Multi-chain contract registry (Ethereum, Polygon, Arbitrum)
- 🤖 MeeBot sprite + TTS feedback
- 🏆 Quest tracker & badge system
- 🎨 NFT Football & Productivity collections
- 🛡️ Admin panel for contract authorization
- 📊 Dashboard with badge provenance & fallback logs
- ⚙️ Settings page with modular toggles
- 🆘 Support page with FAQ system

## 📦 Tech Stack

- React + TypeScript
- Smart Contracts (Solidity)
- Replit + GitHub
- TailwindCSS
- Firebase (optional)
- Gemini TTS API

## 🚀 Getting Started

```bash
git clone https://github.com/TLADPT14/MeeChain_MeeBot.git
cd MeeChain_MeeBot
npm install
npm run dev
```

### ⚠️ Note on Environment Variables (Vite)

If you use Firebase or any environment variable in the frontend (React/Vite), you must prefix the variable with `VITE_` in your `.env.production` or `.env` file. For example:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
```

Then, access it in code as `import.meta.env.VITE_FIREBASE_API_KEY` (frontend) or `process.env.VITE_FIREBASE_API_KEY` (Node/build).

## 🎯 Quest System

The MeeChain Quest System is a production-ready, fallback-aware quest verification and badge minting system featuring:

- **Modular Architecture**: Separated verification, minting, and logging
- **Automatic Fallback**: Switches to backup chain if primary minting fails
- **Full Auditability**: Comprehensive event logging for all operations
- **Type-Safe**: Complete TypeScript implementation

### Quick Start

```bash
# Build the project
npm run build

# Run examples
npm run example

# Run Settings/Support demo
npm run demo:settings

# Run Deploy Registry demo
npm run demo:deploy-registry

# Run Dashboard Integration demo
npm run demo:dashboard

# Run tests (46 comprehensive tests)
npm test
```

### Documentation

- 📖 [Quest System Overview](QUEST_SYSTEM.md) - Complete API reference and usage guide
- 🌐 [Deploy Registry](DEPLOY_REGISTRY.md) - Multi-chain contract deployment registry
- 📊 [Dashboard Integration](DASHBOARD_INTEGRATION.md) - Dashboard and Admin page integration
- 🔌 [Integration Guide](INTEGRATION.md) - React, Web3, Firebase integration examples
- 🏗️ [Architecture](ARCHITECTURE.md) - System design and data flow diagrams
- ⚙️ [Settings & Support Pages](SETTINGS_SUPPORT.md) - Settings and Support page documentation

### Example Usage

```typescript
import { handleQuestCompletion } from './src/QuestManager'
import { updateUserProgress } from './src/verifiers/questVerifier'

// Update user progress
updateUserProgress('user-001', 'quest-001', 'login', 1)
updateUserProgress('user-001', 'quest-001', 'profile-setup', 1)

// Complete quest with automatic fallback
const result = await handleQuestCompletion('user-001', 'quest-001')

if (result.success) {
  if (result.fallback) {
    console.log('✅ Badge minted via fallback chain')
  } else {
    console.log('✅ Badge minted successfully')
  }
  console.log(`Transaction: ${result.tx?.txHash}`)
}
```

## 🧪 Testing

All 46 tests passing with 100% success rate:
- ✅ Quest verification
- ✅ Primary chain minting
- ✅ Automatic fallback
- ✅ Error handling
- ✅ Progress tracking
- ✅ Event logging
- ✅ TTS quest system (14 tests)
- ✅ Deploy registry (9 tests)
- ✅ Dashboard utilities (13 tests)

## 📁 Project Structure

```
MeeChain_MeeBot/
├── config/
│   └── deploy-registry.json     # Multi-chain contract addresses
├── src/
│   ├── QuestManager.ts          # Main orchestrator
│   ├── config/
│   │   ├── registryTypes.ts     # Deploy registry types
│   │   └── registryLoader.ts    # Registry loader utilities
│   ├── verifiers/
│   │   └── questVerifier.ts     # Quest condition verification
│   ├── minting/
│   │   └── badgeMinter.ts       # Badge minting with fallback
│   ├── utils/
│   │   └── logger.ts            # Event logging system
│   ├── example.ts               # Usage examples
│   └── test.ts                  # Test suite
├── tests/
│   ├── ttsQuest.test.ts         # TTS quest tests
│   └── deployRegistry.test.ts   # Deploy registry tests
├── pages/
│   ├── Settings.tsx             # Settings page
│   ├── Support.tsx              # Support/FAQ page
│   ├── dashboard.tsx            # Dashboard page (badges & logs)
│   └── admin.tsx                # Admin override page
├── components/
│   ├── MeeBot.tsx               # MeeBot sprite/TTS stub
│   ├── SettingToggle.tsx        # Toggle component
│   ├── BadgeList.tsx            # Badge list with provenance
│   └── FallbackLog.tsx          # Fallback log display
├── hooks/
│   ├── useSettings.ts           # Settings hook
│   └── useFAQ.ts               # FAQ hook
├── utils/
│   ├── settingsLoader.ts        # Fallback-aware settings loader
│   ├── fallbackFAQ.ts           # Fallback-aware FAQ loader
│   ├── registry.ts              # Registry utility for UI
│   └── mockData.ts              # Mock data utilities
├── examples/
│   ├── settings-support-demo.ts # Settings/Support demo
│   ├── deploy-registry-demo.ts  # Deploy registry demo
│   └── dashboard-integration-demo.ts  # Dashboard demo
├── QUEST_SYSTEM.md              # Quest system documentation
├── DEPLOY_REGISTRY.md           # Deploy registry documentation
├── DASHBOARD_INTEGRATION.md     # Dashboard integration documentation
├── INTEGRATION.md               # Integration guide
├── ARCHITECTURE.md              # Architecture diagrams
├── SETTINGS_SUPPORT.md          # Settings/Support documentation
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License


---


# ✅ MeeChain_MeeBot Go-Live Checklist: TTS Quest (พร้อมวิธีเช็คแต่ละข้อ)

> สำหรับ Contributor: โปรดตรวจสอบทุกข้อก่อนเปิดใช้งานจริงฟีเจอร์ TTS Quest

---


## 1. 🔗 Integration & Logic

- [ ] ตรวจสอบว่า TTS Quest ใช้ logic จริง (ไม่ใช่ mock)
  - เปิดไฟล์ `src/verifiers/TTSQuestVerifier.ts` และ `src/minting/badgeMinter.ts` ต้อง import production logic (ไม่ใช่ mock)
- [ ] เชื่อมต่อกับ MeeBot flow และ fallback flow ได้ถูกต้อง
  - ทดสอบ trigger TTS ผ่าน Settings และดู MeeBot sprite/เสียงเปลี่ยนตาม flow (เช่น fallback จะพูดข้อความ fallback)
- [ ] มีการตรวจสอบสิทธิ์ผู้ใช้ก่อน trigger TTS
  - ตรวจสอบว่ามีการเช็ค user auth (ดูใน `Settings.tsx` หรือ logic ที่เกี่ยวข้อง)
- [ ] รองรับการ trigger ผ่านหน้า Settings และ fallback flow
  - เปิดหน้า Settings แล้วกด toggle/ปุ่ม TTS ต้องทำงานได้ทั้งกรณีปกติและ fallback

---


## 2. 🔊 TTS Engine & Audio

- [ ] ตั้งค่า TTS engine (เช่น Google Cloud TTS, ElevenLabs, ฯลฯ) ใน `.env.production`
  - ตัวอย่าง `.env.production`:
    ```
    TTS_API_KEY=xxx
    TTS_ENDPOINT=https://api.elevenlabs.io/...
    ```
- [ ] ทดสอบการสร้างเสียงจากข้อความจริง
  - trigger TTS ใน Settings แล้วฟังเสียง MeeBot ว่าตรงกับข้อความ
- [ ] ตรวจสอบว่า MeeBot สามารถตอบกลับด้วยเสียงได้ถูกต้อง
  - MeeBot.speak(...) ต้องเล่นเสียงจริง (ดูใน console หรือ UI)
- [ ] รองรับ fallback กรณี TTS ล้มเหลว (เช่น แสดงข้อความแทนเสียง)
  - ปิดเน็ต/เปลี่ยน endpoint ให้ผิด แล้ว trigger TTS ต้องแสดงข้อความ fallback
- [ ] ทดสอบ fallback TTS ด้วย network error จริง (เช่น ปิดอินเทอร์เน็ต/เปลี่ยน endpoint)
  - ดู log และ UI ว่ามี fallback message

---


## 3. 🧪 UI & UX

- [ ] หน้า `Settings.tsx` มี toggle สำหรับเปิด/ปิด TTS Quest
  - เปิดหน้า Settings ดูว่ามี toggle/ปุ่ม TTS
- [ ] มีปุ่ม trigger TTS ที่ชัดเจน และมี feedback เมื่อกด
  - กดแล้วมี loading/เสียง/ข้อความตอบกลับ
- [ ] แสดงสถานะการทำงานของ TTS (เช่น “กำลังสร้างเสียง…”)
  - ดู UI มีข้อความหรือ indicator ขณะรอเสียง
- [ ] รองรับผู้ใช้ที่ไม่เปิดเสียง (fallback เป็นข้อความ)
  - ปิดเสียง browser แล้ว trigger TTS ต้องเห็นข้อความแทน
- [ ] ตรวจสอบ UX กรณีผู้ใช้ trigger TTS ซ้ำ ๆ (debounce/throttle)
  - กดปุ่มรัว ๆ แล้วระบบไม่ควร trigger ซ้ำเกิน 1 ครั้ง/วินาที
- [ ] ตรวจสอบการแสดง badge/notification หลังสำเร็จ
  - หลัง MeeBot พูดจบ ต้องมี badge/notification แสดงผล
- [ ] ทดสอบกับหลาย browser/device
  - ทดสอบ Chrome, Firefox, Safari, มือถือ

---


## 4. 🔐 Security & Permissions

- [ ] ตรวจสอบว่าไม่มี key จริงใน repo
  - ค้นหา `TTS_API_KEY` หรือ key จริงในโค้ด/commit (`git grep TTS_API_KEY`)
- [ ] ตั้งค่า environment variables สำหรับ production (`TTS_API_KEY`, `TTS_ENDPOINT`, ฯลฯ)
  - ดูใน server/host ว่ามี env ครบ
- [ ] ตรวจสอบสิทธิ์การเข้าถึง TTS API (rate limit, quota)
  - ทดสอบยิง TTS หลายครั้ง ดูว่าไม่โดน block/quota

---


## 5. 📦 Build & Deploy

- [ ] รัน `npm run build` ผ่าน ไม่มี error
  - รันคำสั่งนี้ใน terminal แล้วดูว่าไม่มี error
- [ ] ทดสอบ `npm run preview` หรือ deploy production server
  - เปิด http://localhost:4173 หรือ production URL แล้วทดสอบ TTS Quest
- [ ] ตรวจสอบว่า TTS Quest ทำงานได้ใน production environment
  - ทดสอบทุก flow จริงหลัง deploy

---


## 6. 📊 Logging & Monitoring

- [ ] บันทึก log ทุกครั้งที่มีการ trigger TTS (`logger.ts`)
  - ดู log ในไฟล์/console ว่ามี event `tts-triggered` ทุกครั้ง
- [ ] ตรวจสอบ fallback log กรณี TTS ล้มเหลว
  - ดู log event `tts-fallback` หรือ error log
- [ ] ตรวจสอบ log ว่ามี `userId` และ `questId` ทุกครั้ง
  - log context ต้องมี userId, questId ครบ
- [ ] มีระบบแจ้งเตือนหรือ monitoring สำหรับ TTS quota
  - ตั้ง alert ในระบบ monitoring หรือ log error เมื่อ quota ใกล้เต็ม

---


## 7. 📚 Documentation & Support

- [ ] อัปเดต `README.md` และ `copilot-instructions.md` ให้ครอบคลุม TTS Quest
  - เพิ่ม section/usage/เช็คลิสต์นี้ในไฟล์
- [ ] เพิ่ม FAQ เกี่ยวกับ TTS Quest ในหน้า Support
  - เพิ่มคำถาม/คำตอบใน `hooks/useFAQ.ts` หรือหน้า Support
- [ ] เตรียมคำตอบ MeeBot สำหรับคำถามเกี่ยวกับ TTS
  - เพิ่มข้อความตอบกลับใน MeeBot.speak สำหรับ TTS

---

> 🧠 หมายเหตุ: Contributor สามารถเพิ่ม checklist เพิ่มเติมได้ตามความเหมาะสม เช่น การรองรับภาษาไทย, การแสดง badge หลังจาก TTS สำเร็จ, หรือการเชื่อมต่อกับ quest verifier

---

MIT


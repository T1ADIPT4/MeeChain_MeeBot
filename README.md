# MeeChain MeeBot Viewer & IPFS Integration

ระบบนี้เชื่อมต่อ MeeBot กับ IPFS เพื่อจัดการ badge, metadata, และ milestone อย่างปลอดภัย พร้อม viewer ที่รองรับหลายภาษา (ไทย/อังกฤษ)

## 🔧 Features
copilot/update-readme-with-examples
- อัปโหลด badge ไปยัง IPFS พร้อม fallback-aware CID
- สร้าง metadata สำหรับ NFT badge (ERC-721 compliant)
- บันทึก milestone ใน `milestone.log` เพื่อ trigger MeeBot feedback
- Viewer แบบ interactive รองรับภาษาไทย–อังกฤษ
- Deploy viewer ผ่าน Firebase Hosting หรือ GitHub Pages

## 📁 Key Files
- `copilot/implement-ipfs-uploader/index.js` – สคริปต์อัปโหลด badge
- `copilot/implement-ipfs-uploader/metadata-generator.js` – สร้าง metadata
- `viewer/index.html` – Viewer หน้าหลัก
- `viewer/viewer.js` – Logic การแสดงผลและ i18n
- `milestone.log`, `registry.json`, `metadata/*.json` – ข้อมูลหลักของระบบ

- ✅ **Automated Deploy-Registry System** - Multi-chain contract deployment automation
- ✅ **Interactive Viewer** - React-based viewer with Registry, Milestone & Badge display
- ✅ Fallback-aware multi-chain minting
- 🌐 Multi-chain contract registry (Ethereum, Polygon, Arbitrum)
- 🤖 MeeBot sprite + TTS feedback
- 🏆 Quest tracker & badge system
- 🎨 NFT Football & Productivity collections
- 🛡️ Admin panel for contract authorization
- 📊 Dashboard with badge provenance & fallback logs
- ⚙️ Settings page with modular toggles
- 🌍 **i18n Support** - Full Thai/English translations
- 📤 **Log Export** - JSON/CSV export with provenance
## 📦 Tech Stack

- React + TypeScript
- Smart Contracts (Solidity)
- Replit + GitHub
- TailwindCSS
- Firebase (optional)
- Gemini TTS API

## 🚀 Getting Started
```bash
npm install
npm run ipfs:generate-metadata
npm run verify:meebot
npm run dev
```

## 🌐 Language Support
- ภาษาไทย: `viewer/i18n/th.json`
- ภาษาอังกฤษ: `viewer/i18n/en.json`
- สลับภาษาได้ผ่าน `LanguageToggle` ใน viewer

## 🟢 Milestone ล่าสุด
- ✅ M5: Viewer & MeeBot integration complete
- ✅ M4: Integration test complete  
- ✅ M3: Fallback validation complete
- ✅ M2: Metadata generator ready
- ✅ M1: Uploader scaffolded

## 📊 Commands & Tools

### IPFS & Metadata
```bash
npm run ipfs:generate-metadata   # สร้าง metadata สำหรับ badges
npm run ipfs:upload-demo         # ทดสอบการอัปโหลด IPFS
npm run ipfs:meebot-demo         # ทดสอบ MeeBot milestone integration
```

### Verification
```bash
npm run verify:meebot            # ตรวจสอบระบบ MeeBot ทั้งหมด (41 checks)
```

### i18n & Viewer
```bash
npm run i18n:demo                # ทดสอบระบบหลายภาษา
npm run dev                      # รันโหมด development
```

### Quest System
```bash
npm run build                    # Build TypeScript
npm run test                     # รัน test suite (46 tests)
npm run example                  # รัน quest system examples
```

### Deploy & Registry
```bash
npm run deploy:badge             # Deploy badge contract
npm run registry:validate        # ตรวจสอบ registry integrity
npm run demo:deploy-registry     # ทดสอบ deploy registry system
```

## 📚 Documentation

### สำหรับผู้ใช้ทั่วไป
- [VERIFICATION_GUIDE.md](copilot/VERIFICATION_GUIDE.md) - คู่มือการตรวจสอบระบบ
- [Viewer README](viewer/README.md) - คู่มือการใช้งาน Viewer
- [IPFS Uploader](copilot/README.md) - คู่มือการอัปโหลด badge

### สำหรับนักพัฒนา
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - สรุปการพัฒนาเชิงเทคนิค
- [QUEST_SYSTEM.md](QUEST_SYSTEM.md) - API reference ของ quest system
- [INTEGRATION.md](INTEGRATION.md) - คู่มือการ integrate กับระบบอื่น
- [ARCHITECTURE.md](ARCHITECTURE.md) - สถาปัตยกรรมระบบ

## 🎯 Quick Examples

### สร้าง Metadata สำหรับ Badge
```bash
npm run ipfs:generate-metadata
```

### ตรวจสอบความครบถ้วนของระบบ
```bash
npm run verify:meebot
```
Expected output: `40/41 checks passed (98%)`

### ดู Viewer แบบ local
```bash
cd viewer
# เปิด index.html ใน browser หรือใช้ local server
python -m http.server 8000
# จากนั้นเปิด http://localhost:8000
```

## 🤖 MeeBot Integration

MeeBot จะแสดง sprite feedback ตาม milestone:
- 🟢 M1: "Uploader scaffolded!"
- 🟣 M2: "Metadata ready!"
- 🔵 M3: "Fallback validated!"
- 🟠 M4: "Uploader tested!"
- 🟡 M5: "Uploader live!"

ดูตัวอย่างการใช้งาน:
```bash
npm run ipfs:meebot-demo
**Features:**
- 🔄 Automatic registry updates after deployment
- ✅ Built-in validation system
- 💾 Automatic backups before changes
- 📤 Export logs to JSON/CSV
- 📊 Dashboard integration
- ⚙️ Admin panel for management

See [DEPLOY_AUTOMATION.md](DEPLOY_AUTOMATION.md) for complete documentation.

### 🎨 Interactive Viewer

A React-based interactive viewer for visualizing Registry status, Milestone progress, and Badge information with full Thai-English i18n support.

```bash
# View the standalone demo (no build required)
open viewer/demo-preview.html

# Or serve with HTTP server
cd viewer
python3 -m http.server 8080
# Then open http://localhost:8080/demo-preview.html
```

**Features:**
- 🔍 **Registry Card** - Display deployment registry info (URL, Version, Hash, Status)
- 🎯 **Milestone Chart** - Visual progress bar with completed milestones (M1-M9)
- 🟢 **Badge Status** - Badge display with fallback-aware asset loading
- 🌍 **Language Toggle** - Switch between Thai (🇹🇭) and English (🇬🇧)
- ⌨️ **Keyboard Shortcuts** - Alt+T (Thai) | Alt+E (English)
- 🤖 **MeeBot Integration** - Sprite changes based on milestone progress

**React Components:**
- `RegistryCard.jsx` - Registry status display
- `MilestoneChart.jsx` - Progress visualization
- `BadgeStatus.jsx` - Badge with fallback support
- `LanguageToggle.jsx` - i18n switcher
- `App.jsx` - Main application

See [INTERACTIVE_VIEWER.md](INTERACTIVE_VIEWER.md) for complete documentation.

### Documentation

- 📖 [Quest System Overview](QUEST_SYSTEM.md) - Complete API reference and usage guide
- 🌐 [Deploy Registry](DEPLOY_REGISTRY.md) - Multi-chain contract deployment registry

- 🤖 [Deploy Automation](DEPLOY_AUTOMATION.md) - Automated deployment system guide
      copilot/automate-deploy-registry-json
- 🔌 [Integration Guide](INTEGRATION.md) - React, Web3, Firebase integration examples
- 🏗️ [Architecture](ARCHITECTURE.md) - System design and data flow diagrams
- ⚙️ [Settings & Support Pages](SETTINGS_SUPPORT.md) - Settings and Support page documentation
- ✅ [Implementation Summary](IMPLEMENTATION_COMPLETE.md) - Complete implementation metrics

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

รัน tests ทั้งหมด:
```bash
npm test
```

Test categories:
- ✅ Quest verification (10 tests)
- ✅ TTS quest system (14 tests)
- ✅ Deploy registry (9 tests)
- ✅ Dashboard utilities (13 tests)
- **Total**: 46 tests, 100% passing

## 🛡️ Fallback Strategy

ระบบรองรับ fallback หลายระดับ:
1. **IPFS Upload**: ลองหลาย endpoints (Infura → Pinata → ipfs.io → dweb.link)
2. **Asset Loading**: ใช้ `badge-placeholder.svg` เมื่อไม่พบ badge ที่ระบุ
3. **Metadata**: สร้าง fallback metadata พร้อม local path
4. **Chain Minting**: สลับจาก primary chain → fallback chain อัตโนมัติ

## 📦 Tech Stack

- **Frontend**: React + TypeScript
- **Blockchain**: Solidity contracts, ethers.js
- **Storage**: IPFS (Infura/Pinata), Firebase (optional)
- **i18n**: JSON-based translation files
- **MeeBot**: Sprite system + TTS (Gemini API)
- **Testing**: Jest + ts-jest

## 🤝 Contributing

Contributions are welcome! กรุณา:
1. อ่านคู่มือใน `VERIFICATION_GUIDE.md` ก่อน
2. รัน `npm run verify:meebot` เพื่อตรวจสอบ
3. รัน tests ด้วย `npm test` ให้ผ่านทั้งหมด
4. Submit PR พร้อมคำอธิบายที่ชัดเจน

## 📄 License

MIT - Part of MeeChain MeeBot project


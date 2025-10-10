# MeeChain MeeBot Viewer & IPFS Integration

ระบบนี้เชื่อมต่อ MeeBot กับ IPFS เพื่อจัดการ badge, metadata, และ milestone อย่างปลอดภัย พร้อม viewer ที่รองรับหลายภาษา (ไทย/อังกฤษ)

## 🔧 Features
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


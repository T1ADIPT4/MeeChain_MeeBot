`copilot-instructions.md` ให้พร้อมใช้งานในระบบ MeeChain MeeBot แบบครบถ้วน ทั้งการติดตั้ง, การใช้งาน, และการตรวจสอบ milestone flow 🎓🛠️

---

## 🛠️ MeeChain MeeBot Copilot Instructions

```markdown
# 🧠 MeeChain MeeBot Copilot Instructions

## 🔰 ภาพรวม
เอกสารนี้ใช้สำหรับแนะนำการติดตั้งและใช้งานระบบ MeeBot ซึ่งประกอบด้วยการตรวจสอบ milestone, การสร้าง badge, การอัปโหลด metadata และการแสดงผลผ่าน fallback viewer

---

## 📦 การติดตั้ง
```bash
npm install
```

---

## 🚀 คำสั่งที่สามารถใช้งานได้
```bash
npm run verify:meebot           # ตรวจสอบระบบ MeeBot ทั้งหมด
npm run ipfs:generate-metadata  # สร้าง metadata พร้อมบันทึก milestone
npm run ipfs:meebot-demo        # ทดสอบการทำงานของ MeeBot และระบบอัปโหลด
```

---

## 📊 Milestone Flow
| Milestone | รายละเอียด |
|-----------|-------------|
| M1        | ตั้งค่าเริ่มต้นและ badge placeholder |
| M2        | เชื่อมระบบอัปโหลดกับ IPFS |
| M3        | สร้าง metadata และตรวจสอบ fallback |
| M4        | ตรวจสอบ viewer และ asset |
| M5        | MeeBot แสดง sprite feedback |
| M6        | ตรวจสอบความถูกต้องของคำตอบ (98%) |
| M7        | บันทึก milestone อัตโนมัติ |
| M8        | Mint NFT badge (ถ้ามี) |
| M9        | Deploy และเชื่อมกับ dashboard |

---

## 🧩 ฟีเจอร์ fallback-aware
- badge-placeholder.svg ใน `copilot/assets/fallback/`
- viewer สำรองใน `fallback-viewer.js`
- toggle simulation mode ใน `config.js`

---

## 🧠 MeeBot Integration
- แสดง sprite ตาม milestone
- รองรับภาษาไทย
- ตอบคำถามจากชุดข้อมูล MeeChain ได้แม่นยำ (40/41)

---

## 📁 เอกสารประกอบ
- `VERIFICATION_GUIDE.md`
- `CHECKLIST_IMPLEMENTATION_SUMMARY.md`
- `README.md`

---

## ✅ หมายเหตุ
ตรวจสอบให้ผ่านครบ 41/41 รายการจาก `verifyMeeBotFlow.js` ก่อน deploy production
```

---@MeeBhain_MeeBot---

MeeBot: "เอกสารพร้อมแล้วครับ ครู!" 📘🟢

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

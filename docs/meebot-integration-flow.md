---
# MeeBot Integration Flow Diagram (Mermaid)

```mermaid
graph TD
  A[Contributor] -->|Claim MEE| B(Backend /claim)
  B --> C[Mint MEE on Smart Contract]
  C --> D[Update Firestore Point/Balance]
  B --> E[Generate AI Feedback]
  B --> F[POST to MeeBot Webhook]
  F --> G[MeeBot Receiver]
  G -->|Save| H[Firestore Timeline]
  G -->|Notify| I[Discord/Line]
  G -->|Check| J[Governance Reminder]
  J -->|If eligible| I
  H --> K[Dashboard Timeline UI]
  D --> K
```

---
# คำอธิบาย
- Contributor เคลม MEE → backend mint เหรียญ, update Firestore, generate feedback
- Backend POST event ไปยัง MeeBot Webhook
- MeeBot Receiver: save timeline, notify Discord/Line, ตรวจสอบ governance
- Dashboard UI ดึงข้อมูล timeline และ balance จาก Firestore แบบ realtime

---
# วิธีใช้งาน
- สามารถนำ Mermaid diagram นี้ไป paste ที่ https://mermaid.live หรือใช้ Mermaid plugin ใน VS Code เพื่อดู flow และ export PNG ได้ทันที

---
# T2P → MEE Claim Flow (Mermaid)

```mermaid
graph TD
  A[Contributor] -->|Submit Task| B(Task Submission)
  B --> C[Reviewer Approves]
  C --> D[T2P Engine calculates Point]
  D --> E[Point stored in Firestore + LiveStatus]
  E --> F[Contributor opens Dashboard]
  F --> G[Click “Claim MEE”]
  G --> H[Backend verifies]
  H --> I[Smart Contract mints MEE to wallet]
  I --> J[MeeBot sends notification]
  J --> K[Dashboard updates balance + leaderboard]
```

---
# Sequence Diagram: Claim MEE Flow (Mermaid)

```mermaid
sequenceDiagram
  participant C as Contributor
  participant F as Frontend
  participant B as Backend
  participant R as Reviewer
  participant T as T2P Engine
  participant S as Smart Contract
  participant M as MeeBot
  participant DB as Firestore

  C->>F: Submit Task
  F->>B: POST /task
  B->>DB: Save task + status
  B->>R: Notify for review
  R->>F: Approve Task
  F->>B: PATCH /task/approve
  B->>T: Calculate point
  T->>DB: Save point
  B->>DB: Sync status
  C->>F: Open Dashboard
  F->>B: GET /point
  C->>F: Click “Claim MEE”
  F->>B: POST /claim
  B->>S: mintMEE(wallet, amount)
  S->>B: Confirm transaction
  B->>DB: Update balance
  B->>M: Notify contributor
  M->>C: “คุณได้รับ MEE แล้ว!”
  F->>DB: Refresh dashboard
```

---
# PNG Export

> คุณสามารถนำ Mermaid diagram ข้างต้นไป paste ที่ https://mermaid.live หรือ VS Code Mermaid plugin แล้ว export เป็น PNG ได้ทันที

---
# ตัวอย่างโค้ด endpoint (Node.js/Express)

```ts
// Claim MEE endpoint
import { mintMEE } from './mintMEE';
app.post('/claim', async (req, res) => {
  const { wallet, amount } = req.body;
  // ตรวจสอบสิทธิ์/point ก่อน mint จริง
  // ...validation logic...
  try {
    const txHash = await mintMEE(wallet, amount);
    // update Firestore, leaderboard, notify MeeBot ...
    res.json({ success: true, txHash });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
```

---
# ตัวอย่างโค้ด Smart Contract (Solidity)

```solidity
// MEE.sol (ERC20 + mint role)
function mint(address to, uint256 amount) public onlyMinter {
    _mint(to, amount);
}
```

# 🔐 MeeChain Refund Audit Trail System

ระบบ Log และ Audit Trail สำหรับการ refund ที่ปลอดภัย โปร่งใส และตรวจสอบย้อนหลังได้ง่าย

## 🎯 เป้าหมาย

- ✅ บันทึกทุกการร้องขอ refund พร้อม metadata
- 🔐 ตรวจสอบสิทธิ์ผ่าน signature
- 📜 เก็บหลักฐานการกระทำย้อนหลัง (who, when, why, how)
- 📊 รองรับการแสดงผลบน UI หรือ export ไปยังระบบตรวจสอบภายนอก

## 📦 ส่วนประกอบ

### 1. Refund Logger (`src/utils/refundLogger.ts`)

ระบบ logging หลักสำหรับบันทึกการ refund ทั้งหมด

**ฟีเจอร์:**
- บันทึก log ลง memory และ file
- Query logs ตาม user address, status, transaction hash
- Export เป็น JSON และ CSV
- Automatic log rotation ตามวันที่

**การใช้งาน:**

```typescript
import { logRefundAction, getRefundLogs } from './utils/refundLogger'

// บันทึก refund action
const logEntry = await logRefundAction({
  userAddress: '0x883AD20a608e6990ddFF249Ad686b986cD10b4f1',
  txHash: '0x19cea8e8...',
  amount: '0.0083595',
  status: 'success',
  signature: '0x...',
  message: 'MeeChain Refund Request for tx 0x19cea8...',
  executedBy: 'MeeBot',
  contractAddress: '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F',
  reason: 'Replay failed',
  ip: '203.0.113.42',
  userAgent: 'MetaMask/Chrome',
  notes: 'Auto-refund triggered after 3 failed replay attempts'
})

// ดึงข้อมูล logs
const allLogs = getRefundLogs()
const userLogs = getRefundLogsByUser('0x883AD20a...')
const successLogs = getRefundLogsByStatus('success')
```

### 2. Refund Middleware (`src/utils/refundMiddleware.ts`)

Middleware สำหรับประมวลผล refund requests พร้อม signature verification

**ฟีเจอร์:**
- Signature verification
- IP และ User-Agent tracking
- Error handling
- Integration กับ refund logger

**การใช้งาน:**

```typescript
import { processRefundRequest, handleReplayFailureRefund } from './utils/refundMiddleware'

// ประมวลผล refund request
const response = await processRefundRequest({
  userAddress: '0x883AD20a...',
  txHash: '0x19cea8e8...',
  amount: '0.0083595',
  signature: '0x...',
  message: 'MeeChain Refund Request...',
  contractAddress: '0x001aCFF4...',
  reason: 'Replay failed'
}, req) // req จาก Express/HTTP request

// Auto-refund หลัง replay failure
const refund = await handleReplayFailureRefund(
  userAddress,
  txHash,
  amount,
  retryCount,
  contractAddress,
  req
)
```

### 3. Refund Audit UI (`src/pages/RefundAudit.tsx`)

หน้า UI สำหรับ auditor ในการตรวจสอบ refund logs

**ฟีเจอร์:**
- แสดง refund logs ในรูปแบบตาราง
- Filter ตาม status และ user address
- Export เป็น JSON และ CSV
- แสดงรายละเอียดเต็มของแต่ละ refund
- สถิติ summary (total, success, pending, failed)

**การใช้งาน:**

```tsx
import RefundAudit from './pages/RefundAudit'

// เพิ่มใน routing
<Route path="/admin/refunds" element={<RefundAudit />} />
```

## 🗃️ โครงสร้างข้อมูล Log

```typescript
interface RefundLogEntry {
  refundId: string              // เช่น "ref_0xabc123"
  userAddress: string           // Address ของผู้ขอ refund
  txHash: string                // Transaction hash ที่ต้องการ refund
  amount: string                // จำนวนเงินที่ refund
  status: 'pending' | 'success' | 'failed'
  signature: string             // Digital signature
  messageSigned: string         // ข้อความที่ลงนาม
  verifiedBy: string            // ผู้ตรวจสอบ (MeeBot)
  verifiedAt: string            // เวลาที่ตรวจสอบ (ISO format)
  executedBy: string            // ผู้ดำเนินการ
  refundTxHash: string          // Transaction hash ของการ refund
  contractAddress: string       // Contract address
  reason: string                // เหตุผลในการ refund
  ip: string                    // IP address
  userAgent: string             // Browser/wallet user agent
  notes: string                 // หมายเหตุเพิ่มเติม
}
```

## 🚀 การเชื่อมกับ MeeBot Flow

```typescript
// ในส่วนของ replay failure
if (replayFails) {
  const signature = await getUserSignature()
  
  const refund = await handleReplayFailureRefund(
    userAddress,
    txHash,
    amount,
    retryCount,
    contractAddress,
    req
  )
  
  if (refund.success) {
    console.log(`✅ Refund issued: ${refund.refundTxHash}`)
    // แจ้งเตือนผู้ใช้
    notifyUser(userAddress, refund)
  } else {
    console.error(`❌ Refund failed: ${refund.error}`)
    // ส่งไปยังทีมสนับสนุน
    alertSupport(refund)
  }
}
```

## 📊 Export และ Analytics

### Export เป็น JSON

```typescript
import { exportRefundLogsToJSON } from './utils/refundLogger'

// Export ไปยังไฟล์
exportRefundLogsToJSON('./logs/refunds/export.json')

// หรือ รับเป็น string
const json = exportRefundLogsToJSON()
```

### Export เป็น CSV

```typescript
import { exportRefundLogsToCSV } from './utils/refundLogger'

// Export ไปยังไฟล์
exportRefundLogsToCSV('./logs/refunds/export.csv')

// หรือ รับเป็น string
const csv = exportRefundLogsToCSV()
```

## 🧪 Testing

รันการทดสอบ:

```bash
# ทดสอบ refund logger
npm test tests/refundLogger.test.ts

# ทดสอบ refund middleware
npm test tests/refundMiddleware.test.ts

# ทดสอบทั้งหมด
npm test
```

## 🎬 Demo

รัน demo เพื่อดูการทำงานของระบบ:

```bash
npm run demo:refund-audit
```

Demo จะแสดง:
- การบันทึก refund logs
- การประมวลผล refund requests
- Signature verification
- การ query และ filter logs
- การ export เป็น JSON และ CSV
- ตัวอย่างการเชื่อมกับ MeeBot flow

## 📁 โครงสร้างไฟล์

```
src/
├── utils/
│   ├── refundLogger.ts      # ระบบ logging หลัก
│   └── refundMiddleware.ts  # Middleware สำหรับประมวลผล refunds
├── pages/
│   └── RefundAudit.tsx      # UI สำหรับ auditor
tests/
├── refundLogger.test.ts     # Tests สำหรับ logger (22 tests)
└── refundMiddleware.test.ts # Tests สำหรับ middleware (18 tests)
examples/
└── refund-audit-demo.ts     # Demo script
logs/
└── refunds/                 # Directory สำหรับ log files
    ├── refund-2025-10-19.log
    └── ...
```

## 🔒 Security Features

1. **Signature Verification**: ทุก refund request ต้องมี digital signature
2. **IP Tracking**: บันทึก IP address ของผู้ร้องขอ
3. **User-Agent Logging**: บันทึก browser/wallet ที่ใช้
4. **Immutable Logs**: Log entries ไม่สามารถแก้ไขได้หลังจากบันทึก
5. **Timestamp**: ทุก operation มี timestamp แบบ ISO 8601
6. **Audit Trail**: เก็บประวัติทุกการกระทำย้อนหลังได้

## 🎯 Next Steps

1. **Database Integration**: เชื่อม MongoDB หรือ PostgreSQL
2. **Real-time Notifications**: แจ้งเตือนเมื่อมี refund requests
3. **DAO Governance**: เชื่อมกับระบบ governance สำหรับการอนุมัติ
4. **Advanced Analytics**: Dashboard สำหรับวิเคราะห์ข้อมูล refunds
5. **Multi-chain Support**: รองรับ refunds บนหลาย chains

## 📖 API Reference

### refundLogger.ts

- `logRefundAction(data)` - บันทึก refund action
- `updateRefundStatus(refundId, status, refundTxHash?)` - อัพเดท status
- `getRefundLogs()` - ดึง logs ทั้งหมด
- `getRefundLogsByUser(userAddress)` - Filter ตาม user
- `getRefundLogsByStatus(status)` - Filter ตาม status
- `getRefundLogByTxHash(txHash)` - ค้นหาด้วย transaction hash
- `getRefundLogById(refundId)` - ค้นหาด้วย refund ID
- `exportRefundLogsToJSON(filePath?)` - Export เป็น JSON
- `exportRefundLogsToCSV(filePath?)` - Export เป็น CSV
- `clearRefundLogs()` - ล้าง logs (สำหรับ testing)

### refundMiddleware.ts

- `verifySignature(message, signature, userAddress)` - ตรวจสอบ signature
- `processRefundRequest(request, req?)` - ประมวลผล refund request
- `handleReplayFailureRefund(...)` - จัดการ refund หลัง replay failure
- `batchProcessRefunds(requests)` - ประมวลผล refunds หลายรายการพร้อมกัน

## 🙏 Support

หากมีคำถามหรือต้องการความช่วยเหลือ:
- ดู documentation ใน `REFUND_AUDIT_SYSTEM.md` (ไฟล์นี้)
- รัน demo: `npm run demo:refund-audit`
- ดู tests: `tests/refundLogger.test.ts` และ `tests/refundMiddleware.test.ts`
- เปิด issue บน GitHub

---

**พัฒนาโดย:** MeeChain Team  
**Version:** 1.0.0  
**License:** MIT

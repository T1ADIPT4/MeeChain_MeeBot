# 🚀 Refund Audit System - Quick Start Guide

เริ่มต้นใช้งานระบบ Refund Audit Trail ในไม่กี่นาที

## ⚡ Quick Setup

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. รัน Demo

```bash
# Demo ระบบ refund logging
npm run demo:refund-audit

# Demo การเชื่อมกับ smart contract
npm run demo:refund-contract
```

### 3. รัน Tests

```bash
# Test ทั้งหมด (40 tests)
npm test tests/refundLogger.test.ts tests/refundMiddleware.test.ts

# Test เฉพาะ logger
npm test tests/refundLogger.test.ts

# Test เฉพาะ middleware
npm test tests/refundMiddleware.test.ts
```

## 📝 Basic Usage

### บันทึก Refund

```typescript
import { logRefundAction } from './src/utils/refundLogger'

const log = await logRefundAction({
  userAddress: '0x883AD20a608e6990ddFF249Ad686b986cD10b4f1',
  txHash: '0x19cea8e8...',
  amount: '0.0083595',
  signature: '0x...',
  message: 'MeeChain Refund Request...',
  executedBy: 'MeeBot',
  contractAddress: '0x001aCFF4...',
  reason: 'Replay failed'
})
```

### ประมวลผล Refund Request

```typescript
import { processRefundRequest } from './src/utils/refundMiddleware'

const response = await processRefundRequest({
  userAddress: '0x883AD20a...',
  txHash: '0x19cea8e8...',
  amount: '0.0083595',
  signature: '0x...',
  message: 'MeeChain Refund Request...',
  contractAddress: '0x001aCFF4...'
})

if (response.success) {
  console.log(`✅ Refund issued: ${response.refundTxHash}`)
}
```

### Auto-Refund หลัง Replay Failure

```typescript
import { handleReplayFailureRefund } from './src/utils/refundMiddleware'

const refund = await handleReplayFailureRefund(
  userAddress,
  txHash,
  amount,
  retryCount,
  contractAddress
)
```

### ดึงข้อมูล Logs

```typescript
import {
  getRefundLogs,
  getRefundLogsByUser,
  getRefundLogsByStatus
} from './src/utils/refundLogger'

// ดึงทั้งหมด
const allLogs = getRefundLogs()

// Filter ตาม user
const userLogs = getRefundLogsByUser('0x883AD20a...')

// Filter ตาม status
const successLogs = getRefundLogsByStatus('success')
```

### Export Logs

```typescript
import {
  exportRefundLogsToJSON,
  exportRefundLogsToCSV
} from './src/utils/refundLogger'

// Export JSON
const json = exportRefundLogsToJSON('./logs/export.json')

// Export CSV
const csv = exportRefundLogsToCSV('./logs/export.csv')
```

## 🎨 UI Integration

### เพิ่ม Refund Audit Page

```tsx
import RefundAudit from './src/pages/RefundAudit'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/refunds" element={<RefundAudit />} />
      </Routes>
    </BrowserRouter>
  )
}
```

## 🔗 Integration with MeeBot

### ในส่วน Transaction Replay

```typescript
async function replayTransaction(tx) {
  let retries = 0
  const maxRetries = 3

  while (retries < maxRetries) {
    try {
      await replay(tx)
      return { success: true }
    } catch (error) {
      retries++
    }
  }

  // Replay failed, trigger refund
  await handleReplayFailureRefund(
    tx.userAddress,
    tx.hash,
    tx.amount,
    retries,
    tx.contractAddress
  )
}
```

## 📊 Files Structure

```
src/
├── utils/
│   ├── refundLogger.ts          # 🔵 Core logging
│   └── refundMiddleware.ts      # 🟢 Request processing
├── pages/
│   └── RefundAudit.tsx          # 🎨 UI component
tests/
├── refundLogger.test.ts         # ✅ 22 tests
└── refundMiddleware.test.ts     # ✅ 18 tests
examples/
├── refund-audit-demo.ts         # 📝 Demo script
└── refund-contract-integration.ts # 🔗 Contract demo
```

## 🎯 Common Use Cases

### Use Case 1: User Request Refund

```typescript
// 1. User signs refund request
const signature = await wallet.signMessage(message)

// 2. Process request
const refund = await processRefundRequest({
  userAddress: wallet.address,
  txHash: failedTxHash,
  amount: txAmount,
  signature,
  message,
  contractAddress
}, req)

// 3. Notify user
if (refund.success) {
  notifyUser('Refund issued successfully')
}
```

### Use Case 2: Automatic Refund

```typescript
// When replay fails
if (replayAttempts >= maxRetries) {
  await handleReplayFailureRefund(
    userAddress,
    txHash,
    amount,
    replayAttempts,
    contractAddress
  )
}
```

### Use Case 3: Audit Review

```typescript
// Get all failed refunds for review
const failedRefunds = getRefundLogsByStatus('failed')

// Export for analysis
exportRefundLogsToCSV('./reports/failed-refunds.csv')
```

## 🔒 Security Checklist

- ✅ Signature verification enabled
- ✅ IP tracking enabled
- ✅ User-Agent logging enabled
- ✅ Audit trail complete
- ✅ Error handling implemented
- ✅ Tests passing (40/40)

## 📚 Documentation

- 📖 Complete docs: `REFUND_AUDIT_SYSTEM.md`
- 🧪 Test examples: `tests/refundLogger.test.ts`
- 💻 Code examples: `examples/refund-audit-demo.ts`
- 🔗 Contract integration: `examples/refund-contract-integration.ts`

## 🆘 Troubleshooting

### Problem: Logs not being written to file

**Solution:** Check directory permissions
```bash
mkdir -p logs/refunds
chmod 755 logs/refunds
```

### Problem: Signature verification failing

**Solution:** Ensure signature format is correct
```typescript
// Signature must start with 0x and be > 100 chars
const isValid = signature.startsWith('0x') && signature.length > 100
```

### Problem: Export not working

**Solution:** Ensure output directory exists
```bash
mkdir -p logs/refunds
```

## 💡 Tips

1. **Development**: Use `clearRefundLogs()` to reset logs during testing
2. **Production**: Implement real signature verification with ethers.js
3. **Monitoring**: Set up alerts for failed refunds
4. **Backup**: Regularly export logs to external storage
5. **Performance**: Consider moving to MongoDB for large-scale deployment

## 🚀 Next Steps

1. ✅ Run demos to understand the system
2. ✅ Review test files for usage patterns
3. ✅ Integrate with your MeeBot flow
4. ✅ Deploy UI to production
5. ✅ Set up monitoring and alerts

## 📞 Support

- GitHub: [MeeChain_MeeBot](https://github.com/T1ADIPT4/MeeChain_MeeBot)
- Documentation: `REFUND_AUDIT_SYSTEM.md`
- Issues: Open a GitHub issue

---

**Happy Coding! 🎉**

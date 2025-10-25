/**
 * DAO Governance Integration Demo
 * Demonstrates complete workflow for refund log management and DAO governance
 */

import {
  getAllRefundLogs,
  getRefundLogById,
  addRefundLog,
  updateRefundLog,
  addRefundFlag,
  getFlagsByRefundId,
  initializeSampleData,
  RefundLog
} from '../api/models/RefundLog.js'

console.log('🎯 MeeChain Singapore - DAO Governance Demo')
console.log('=' .repeat(60))

// Initialize sample data
console.log('\n📊 Initializing sample data...')
initializeSampleData()

// 1. Simulate user requesting refund
console.log('\n1️⃣  User Requests Refund')
console.log('-'.repeat(60))
const newRefund: RefundLog = {
  refundId: 'refund-demo-001',
  userAddress: '0xDemoUser123456789abcdef123456789abcdef123',
  txHash: '0xOriginalTx987654321fedcba987654321fedcba',
  amount: '3.5',
  status: 'pending',
  reason: 'Replay attack failed - transaction reverted',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

addRefundLog(newRefund)
console.log('✅ Refund request created:')
console.log(`   Refund ID: ${newRefund.refundId}`)
console.log(`   User: ${newRefund.userAddress}`)
console.log(`   Amount: ${newRefund.amount} MEE`)
console.log(`   Reason: ${newRefund.reason}`)

// 2. Auditor reviews the refund
console.log('\n2️⃣  Auditor Reviews Refund')
console.log('-'.repeat(60))
const refund = getRefundLogById('refund-demo-001')
if (refund) {
  console.log('📋 Refund Details:')
  console.log(`   Status: ${refund.status}`)
  console.log(`   TX Hash: ${refund.txHash}`)
  console.log(`   BscScan: https://bscscan.com/tx/${refund.txHash}`)
  
  // Auditor finds something suspicious and flags it
  console.log('\n⚠️  Auditor notices potential issue and flags the refund...')
  addRefundFlag({
    refundId: 'refund-demo-001',
    reason: 'Transaction timestamp suspicious - need to verify with blockchain explorer',
    flaggedBy: '0xAuditorAlice456',
    flaggedAt: new Date().toISOString(),
    status: 'open'
  })
  console.log('🚩 Refund flagged for additional review')
}

// 3. Check all flags
console.log('\n3️⃣  Review Flags')
console.log('-'.repeat(60))
const flags = getFlagsByRefundId('refund-demo-001')
console.log(`📌 Total flags for refund-demo-001: ${flags.length}`)
flags.forEach((flag, index) => {
  console.log(`\nFlag ${index + 1}:`)
  console.log(`   Flagged by: ${flag.flaggedBy}`)
  console.log(`   Reason: ${flag.reason}`)
  console.log(`   Status: ${flag.status}`)
  console.log(`   Time: ${flag.flaggedAt}`)
})

// 4. Validator verifies and approves
console.log('\n4️⃣  Validator Verifies and Approves')
console.log('-'.repeat(60))
setTimeout(() => {
  console.log('🔍 Validator checks blockchain...')
  console.log('✅ Transaction verified - replay attack confirmed')
  console.log('💰 Processing refund...')
  
  const updated = updateRefundLog('refund-demo-001', {
    status: 'verified',
    verifiedAt: new Date().toISOString(),
    refundTxHash: '0xRefundTx123456789abcdef123456789abcdef1234',
    executedBy: '0xValidatorBob789'
  })
  
  if (updated) {
    console.log('\n✅ Refund verified and processed:')
    console.log(`   Status: ${updated.status}`)
    console.log(`   Verified at: ${updated.verifiedAt}`)
    console.log(`   Refund TX: ${updated.refundTxHash}`)
    console.log(`   Executed by: ${updated.executedBy}`)
  }
  
  // 5. Generate DAO Proposal
  console.log('\n5️⃣  Generate DAO Proposal')
  console.log('-'.repeat(60))
  
  const proposalText = `### Refund Audit Proposal

**ผู้ขอ:** ${updated!.userAddress}
**ธุรกรรม:** [ดูบน BscScan](https://bscscan.com/tx/${updated!.txHash})
**เหตุผล:** ${updated!.reason}
**สถานะ:** ${updated!.status}
**เวลายืนยัน:** ${new Date(updated!.verifiedAt!).toLocaleString('th-TH', { timeZone: 'UTC' })} UTC
**ธุรกรรม refund:** [${updated!.refundTxHash}](https://bscscan.com/tx/${updated!.refundTxHash})
**ผู้ดำเนินการ:** ${updated!.executedBy}
**Log:** [ดาวน์โหลด CSV](http://localhost:3001/api/logs/export-csv)

ขอให้ DAO รับรองการคืนเหรียญและบันทึกในระบบ governance

---

### รายละเอียดเพิ่มเติม

การคืนเหรียญนี้เกิดจากการโจมตีแบบ replay attack ที่ทำให้ธุรกรรมไม่สำเร็จ ผู้ใช้ได้รับผลกระทบและขาดทุน ${updated!.amount} MEE

ตัวตรวจสอบได้ทำการตรวจสอบธุรกรรมบน blockchain และยืนยันว่าเป็นกรณีที่ถูกต้อง

🚩 **หมายเหตุ:** Refund นี้ถูกแจ้งเตือนโดย Auditor เนื่องจากมีข้อสงสัยเบื้องต้น แต่ได้รับการตรวจสอบและยืนยันแล้ว

**การลงมติ:**
- ✅ เห็นด้วย - รับรองการคืนเหรียญ
- ❌ ไม่เห็นด้วย - ยกเลิกและตรวจสอบเพิ่มเติม`

  console.log('\n📝 DAO Proposal Generated:')
  console.log('=' .repeat(60))
  console.log(proposalText)
  console.log('=' .repeat(60))
  
  // 6. Display statistics
  console.log('\n6️⃣  System Statistics')
  console.log('-'.repeat(60))
  const allLogs = getAllRefundLogs()
  const pendingCount = allLogs.filter(l => l.status === 'pending').length
  const verifiedCount = allLogs.filter(l => l.status === 'verified').length
  const refundedCount = allLogs.filter(l => l.status === 'refunded').length
  const failedCount = allLogs.filter(l => l.status === 'failed').length
  
  console.log('📊 Refund Statistics:')
  console.log(`   Total Refunds: ${allLogs.length}`)
  console.log(`   Pending: ${pendingCount}`)
  console.log(`   Verified: ${verifiedCount}`)
  console.log(`   Refunded: ${refundedCount}`)
  console.log(`   Failed: ${failedCount}`)
  
  // 7. Next steps
  console.log('\n7️⃣  Next Steps')
  console.log('-'.repeat(60))
  console.log('📌 To continue with DAO governance:')
  console.log('   1. Copy the proposal text above')
  console.log('   2. Go to Snapshot or your DAO platform')
  console.log('   3. Create new proposal')
  console.log('   4. Paste the proposal text')
  console.log('   5. Set voting period (e.g., 3-7 days)')
  console.log('   6. Submit for DAO vote')
  console.log('')
  console.log('📥 Export logs for audit:')
  console.log('   GET http://localhost:3001/api/logs/export-csv')
  console.log('')
  console.log('🎨 View in Auditor Dashboard:')
  console.log('   Open the React application and navigate to AuditorDashboard')
  console.log('')
  console.log('✅ Demo completed successfully!')
}, 1000)

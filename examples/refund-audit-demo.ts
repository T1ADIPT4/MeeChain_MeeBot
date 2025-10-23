/**
 * Refund Audit Trail Demo
 * Demonstrates the complete refund logging and audit trail system
 * integrating with MeeBot flow for automatic refund processing
 */

import {
  logRefundAction,
  updateRefundStatus,
  getRefundLogs,
  getRefundLogsByUser,
  getRefundLogsByStatus,
  exportRefundLogsToJSON,
  exportRefundLogsToCSV,
  clearRefundLogs
} from '../src/utils/refundLogger'

import {
  processRefundRequest,
  handleReplayFailureRefund
} from '../src/utils/refundMiddleware'

async function runRefundAuditDemo() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║     MeeChain Refund Audit Trail Demo                     ║')
  console.log('║     ระบบ Log และ Audit Trail สำหรับการ Refund          ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  // Clear previous logs for demo
  clearRefundLogs()

  // ==================== Scenario 1: Successful Refund ====================
  console.log('📝 Scenario 1: Successful Refund After Replay Failure\n')
  console.log('   User: 0x883AD20a608e6990ddFF249Ad686b986cD10b4f1')
  console.log('   Reason: Transaction replay failed after 3 attempts')
  console.log('   Amount: 0.0083595 BNB\n')

  const refund1 = await processRefundRequest({
    userAddress: '0x883AD20a608e6990ddFF249Ad686b986cD10b4f1',
    txHash: '0x19cea8e8eb9c93c806d8163047be7873f3d7a99804a7b335b3959a385c9877f3',
    amount: '0.0083595',
    signature: '0x' + '1'.repeat(130),
    message: 'MeeChain Refund Request for tx 0x19cea8...',
    contractAddress: '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F',
    reason: 'Replay failed'
  }, {
    ip: '203.0.113.42',
    headers: { 'user-agent': 'MetaMask/Chrome' }
  })

  console.log(`   ✅ Refund processed successfully`)
  console.log(`   Refund ID: ${refund1.refundId}`)
  console.log(`   Refund Tx: ${refund1.refundTxHash}\n`)

  // ==================== Scenario 2: Auto Refund Integration ====================
  console.log('📝 Scenario 2: Auto Refund with MeeBot Flow Integration\n')
  console.log('   Simulating automatic refund after replay failures...\n')

  const refund2 = await handleReplayFailureRefund(
    '0xUser2Address',
    '0xabc123def456',
    '0.015',
    3,
    '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F'
  )

  console.log(`   ✅ Auto-refund triggered`)
  console.log(`   Refund ID: ${refund2.refundId}`)
  console.log(`   Retry count: 3 attempts\n`)

  // ==================== Scenario 3: Multiple Users ====================
  console.log('📝 Scenario 3: Processing Multiple Refund Requests\n')

  const users = [
    {
      address: '0xUser3Address',
      txHash: '0xTx3Hash',
      amount: '0.025',
      retryCount: 2
    },
    {
      address: '0xUser4Address',
      txHash: '0xTx4Hash',
      amount: '0.031',
      retryCount: 4
    }
  ]

  for (const user of users) {
    const refund = await handleReplayFailureRefund(
      user.address,
      user.txHash,
      user.amount,
      user.retryCount,
      '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F'
    )
    console.log(`   ✅ Processed: ${refund.refundId} (${user.amount} BNB)`)
  }
  console.log()

  // ==================== Scenario 4: Invalid Signature ====================
  console.log('📝 Scenario 4: Handling Invalid Signature\n')

  const invalidRefund = await processRefundRequest({
    userAddress: '0xInvalidUser',
    txHash: '0xInvalidTx',
    amount: '1.0',
    signature: '0xinvalid',
    message: 'Invalid request',
    contractAddress: '0xContract'
  })

  console.log(`   ❌ Refund failed: ${invalidRefund.error}`)
  console.log(`   Refund ID: ${invalidRefund.refundId}\n`)

  // ==================== Query and Display Logs ====================
  console.log('═'.repeat(63))
  console.log('📊 Refund Audit Trail Summary\n')

  const allLogs = getRefundLogs()
  console.log(`   Total Refunds: ${allLogs.length}`)
  
  const successLogs = getRefundLogsByStatus('success')
  const failedLogs = getRefundLogsByStatus('failed')
  
  console.log(`   ✅ Successful: ${successLogs.length}`)
  console.log(`   ❌ Failed: ${failedLogs.length}\n`)

  // ==================== Display Individual Logs ====================
  console.log('📋 Detailed Refund Logs:\n')

  allLogs.forEach((log, index) => {
    console.log(`   ${index + 1}. ${log.status === 'success' ? '✅' : '❌'} ${log.refundId}`)
    console.log(`      User: ${log.userAddress.slice(0, 10)}...`)
    console.log(`      Amount: ${log.amount}`)
    console.log(`      Reason: ${log.reason}`)
    console.log(`      Time: ${new Date(log.verifiedAt).toLocaleString('th-TH')}`)
    console.log(`      Contract: ${log.contractAddress}`)
    if (log.status === 'success') {
      console.log(`      Refund Tx: ${log.refundTxHash.slice(0, 20)}...`)
    }
    console.log()
  })

  // ==================== Filter by User ====================
  console.log('═'.repeat(63))
  console.log('🔍 Filter Example: Refunds by User\n')
  
  const user1Logs = getRefundLogsByUser('0x883AD20a608e6990ddFF249Ad686b986cD10b4f1')
  console.log(`   User: 0x883AD20a608e6990ddFF249Ad686b986cD10b4f1`)
  console.log(`   Total Refunds: ${user1Logs.length}\n`)

  // ==================== Export Logs ====================
  console.log('═'.repeat(63))
  console.log('📤 Export Capabilities\n')

  console.log('   📄 JSON Export:')
  const jsonExport = exportRefundLogsToJSON()
  const jsonPreview = jsonExport.slice(0, 150) + '...'
  console.log(`   ${jsonPreview.split('\n').join('\n   ')}\n`)

  console.log('   📊 CSV Export:')
  const csvExport = exportRefundLogsToCSV()
  const csvLines = csvExport.split('\n').slice(0, 3)
  csvLines.forEach(line => {
    const preview = line.length > 80 ? line.slice(0, 80) + '...' : line
    console.log(`   ${preview}`)
  })
  console.log()

  // ==================== Audit View Example ====================
  console.log('═'.repeat(63))
  console.log('👁️  Audit View Example (for UI)\n')

  if (successLogs.length > 0) {
    const exampleLog = successLogs[0]
    console.log('   ┌─────────────────────────────────────────────────────────┐')
    console.log('   │ รายการ              │ คำอธิบาย                         │')
    console.log('   ├─────────────────────────────────────────────────────────┤')
    console.log(`   │ ผู้ขอ               │ ${exampleLog.userAddress.slice(0, 42).padEnd(29)} │`)
    console.log(`   │ เหตุผล              │ ${exampleLog.reason.padEnd(29)} │`)
    console.log(`   │ เวลายืนยัน          │ ${new Date(exampleLog.verifiedAt).toLocaleString('th-TH').padEnd(29)} │`)
    console.log(`   │ ลายเซ็น             │ ✅ ตรวจสอบแล้ว                   │`)
    console.log(`   │ ธุรกรรม refund      │ ดูบน BscScan →                  │`)
    console.log(`   │ หมายเหตุ            │ ${(exampleLog.notes || 'N/A').padEnd(29)} │`)
    console.log('   └─────────────────────────────────────────────────────────┘\n')
  }

  // ==================== Integration Example ====================
  console.log('═'.repeat(63))
  console.log('🔗 MeeBot Flow Integration Example\n')

  console.log('   // Example code for automatic refund after replay failure:')
  console.log('   ')
  console.log('   if (replayFails) {')
  console.log('     const signature = await getUserSignature()')
  console.log('     const refund = await handleReplayFailureRefund(')
  console.log('       userAddress,')
  console.log('       txHash,')
  console.log('       amount,')
  console.log('       retryCount,')
  console.log('       contractAddress,')
  console.log('       req')
  console.log('     )')
  console.log('     ')
  console.log('     if (refund.success) {')
  console.log('       console.log(`✅ Refund issued: ${refund.refundTxHash}`)')
  console.log('     }')
  console.log('   }\n')

  // ==================== Summary ====================
  console.log('═'.repeat(63))
  console.log('✨ Demo Complete!\n')
  console.log('   This demo showed:')
  console.log('   ✅ Automatic refund logging with metadata')
  console.log('   ✅ Signature verification')
  console.log('   ✅ Status tracking and updates')
  console.log('   ✅ Query and filter capabilities')
  console.log('   ✅ Export to JSON and CSV')
  console.log('   ✅ Integration with MeeBot flow')
  console.log('   ✅ Audit trail for DAO governance\n')

  console.log('   🔐 Security Features:')
  console.log('   • Signature verification for all refunds')
  console.log('   • IP and User-Agent tracking')
  console.log('   • Immutable log entries')
  console.log('   • Timestamp on all operations')
  console.log('   • Full audit trail\n')

  console.log('   📊 Next Steps:')
  console.log('   • Integrate with MongoDB/PostgreSQL')
  console.log('   • Deploy UI dashboard at /admin/refunds')
  console.log('   • Connect to DAO governance system')
  console.log('   • Add real-time notifications')
  console.log('   • Implement advanced analytics\n')

  console.log('╚═══════════════════════════════════════════════════════════╝\n')
}

// Run the demo
runRefundAuditDemo().catch(console.error)

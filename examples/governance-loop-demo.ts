/**
 * Governance Loop Demo
 * Demonstrates the complete DAO governance flow with contributor reputation
 */

import * as mockApi from '../src/api/mockApi';
import { getContributor } from '../src/services/contributorReputationService';

async function demonstrateGovernanceLoop() {
  console.log('🛡️ MeeChain DAO Governance Loop Demo\n');
  console.log('=' .repeat(50));
  console.log('\n');

  // Step 1: Create some refund flags
  console.log('Step 1: Creating refund flags...\n');
  
  const flag1 = await mockApi.createFlag({
    refundId: 'ref_abc123',
    requester: '0x883AD20a...',
    transaction: '0xabc123def456...',
    reason: 'Replay failed',
    flaggedBy: '0xFlagger001',
    signatureVerified: true
  });
  console.log('✅ Flag created:', flag1.data?.refundId);

  const flag2 = await mockApi.createFlag({
    refundId: 'ref_xyz789',
    requester: '0x9a4BC7e2...',
    transaction: '0x789xyz456abc...',
    reason: 'Invalid signature',
    flaggedBy: '0xFlagger001',
    signatureVerified: false
  });
  console.log('✅ Flag created:', flag2.data?.refundId);

  const flag3 = await mockApi.createFlag({
    refundId: 'ref_test456',
    requester: '0x7c3DE89f...',
    transaction: '0x456test789...',
    reason: 'Double spending attempt',
    flaggedBy: '0xFlagger002',
    signatureVerified: true
  });
  console.log('✅ Flag created:', flag3.data?.refundId);

  console.log('\n' + '=' .repeat(50));
  console.log('\nStep 2: DAO/Core reviewing flags...\n');

  // Step 2: DAO confirms flags (approve/reject)
  const confirm1 = await mockApi.confirmFlag({
    refundId: 'ref_abc123',
    approved: true,
    confirmedBy: '0xDAOReviewer',
    notes: 'Valid flag, confirmed by DAO vote #42'
  });
  console.log('✅ Flag approved:', confirm1.data?.refundId);
  console.log('   Status:', confirm1.data?.status);
  console.log('   Notes:', confirm1.data?.notes);

  const confirm2 = await mockApi.confirmFlag({
    refundId: 'ref_xyz789',
    approved: false,
    confirmedBy: '0xDAOReviewer',
    notes: 'Not a valid security issue'
  });
  console.log('❌ Flag rejected:', confirm2.data?.refundId);
  console.log('   Status:', confirm2.data?.status);

  const confirm3 = await mockApi.confirmFlag({
    refundId: 'ref_test456',
    approved: true,
    confirmedBy: '0xDAOReviewer',
    notes: 'Critical security issue confirmed'
  });
  console.log('✅ Flag approved:', confirm3.data?.refundId);

  console.log('\n' + '=' .repeat(50));
  console.log('\nStep 3: Checking contributor reputation...\n');

  // Step 3: Check contributor stats
  const contributor1 = getContributor('0xFlagger001');
  console.log('👤 Contributor: 0xFlagger001');
  console.log('   Score:', contributor1?.score);
  console.log('   Total Flags:', contributor1?.totalFlags);
  console.log('   Validated:', contributor1?.validatedFlags);
  console.log('   Rejected:', contributor1?.rejectedFlags);
  console.log('   Badges:', contributor1?.badges.length || 0);

  const contributor2 = getContributor('0xFlagger002');
  console.log('\n👤 Contributor: 0xFlagger002');
  console.log('   Score:', contributor2?.score);
  console.log('   Total Flags:', contributor2?.totalFlags);
  console.log('   Validated:', contributor2?.validatedFlags);

  console.log('\n' + '=' .repeat(50));
  console.log('\nStep 4: Exporting CSV for Snapshot proposal...\n');

  // Step 4: Export to CSV
  const csv = await mockApi.exportCSV();
  console.log('📄 CSV Export (first 300 chars):');
  console.log(csv.substring(0, 300) + '...\n');

  console.log('=' .repeat(50));
  console.log('\nStep 5: Getting all flags...\n');

  // Step 5: Get all flags
  const allFlags = await mockApi.getAllFlags();
  console.log(`📊 Total flags: ${allFlags.data?.length}`);
  
  const pendingFlags = await mockApi.getAllFlags({ status: 'pending' });
  const approvedFlags = await mockApi.getAllFlags({ status: 'approved' });
  const rejectedFlags = await mockApi.getAllFlags({ status: 'rejected' });
  
  console.log(`   - Pending: ${pendingFlags.data?.length}`);
  console.log(`   - Approved: ${approvedFlags.data?.length}`);
  console.log(`   - Rejected: ${rejectedFlags.data?.length}`);

  console.log('\n' + '=' .repeat(50));
  console.log('\n✨ Demo complete! The governance loop is working:\n');
  console.log('1. ✅ Flags can be created by contributors');
  console.log('2. ✅ DAO can review and confirm/reject flags');
  console.log('3. ✅ Contributor reputation is updated automatically');
  console.log('4. ✅ Badges are evaluated and awarded');
  console.log('5. ✅ CSV export for Snapshot proposals works');
  console.log('\n🎯 Ready to integrate with React dashboard!\n');
}

// Run the demo
demonstrateGovernanceLoop().catch(console.error);

#!/usr/bin/env node

/**
 * Demo script for MeeBot Replay & Supply Flow
 * 
 * This script demonstrates the transaction replay and supply workflow
 * with different user roles and MeeBot personality feedback.
 */

// Role permissions logic (standalone version)
function getUserPermissions(role) {
  switch (role) {
    case 'User':
      return {
        role,
        canSupply: false,
        canRefund: false,
        canViewLogs: false,
        canTriggerActions: false,
      };
    case 'Supplier':
      return {
        role,
        canSupply: true,
        canRefund: false,
        canViewLogs: true,
        canTriggerActions: true,
      };
    case 'RecoveryAgent':
      return {
        role,
        canSupply: false,
        canRefund: true,
        canViewLogs: true,
        canTriggerActions: true,
      };
    case 'Auditor':
      return {
        role,
        canSupply: false,
        canRefund: false,
        canViewLogs: true,
        canTriggerActions: false,
      };
    default:
      return {
        role: 'User',
        canSupply: false,
        canRefund: false,
        canViewLogs: false,
        canTriggerActions: false,
      };
  }
}

console.log('🧩 MeeBot Replay & Supply Flow Demo\n');
console.log('=' .repeat(60));

// Demo 1: Role Permissions
console.log('\n📋 Demo 1: Role-Based Permissions\n');

const roles = ['User', 'Supplier', 'RecoveryAgent', 'Auditor'];

roles.forEach(role => {
  const permissions = getUserPermissions(role);
  console.log(`\n${getRoleIcon(role)} ${role}:`);
  console.log(`  ├─ Can Supply: ${permissions.canSupply ? '✅' : '❌'}`);
  console.log(`  ├─ Can Refund: ${permissions.canRefund ? '✅' : '❌'}`);
  console.log(`  ├─ Can View Logs: ${permissions.canViewLogs ? '✅' : '❌'}`);
  console.log(`  └─ Can Trigger Actions: ${permissions.canTriggerActions ? '✅' : '❌'}`);
});

// Demo 2: Transaction Flow Simulation
console.log('\n\n🔄 Demo 2: Transaction Flow Simulation\n');

const txHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
console.log(`Transaction Hash: ${txHash}\n`);

// Simulate workflow steps
const workflow = [
  { step: 1, status: 'pending', message: '⏳ กำลังตรวจสอบธุรกรรม กรุณารอสักครู่...', mood: 'thinking' },
  { step: 2, status: 'replayed', message: '🎉 เหรียญของคุณพร้อมซัพพลายแล้ว! กดเลยเพื่อปล่อยพลัง MeeChain Singapore', mood: 'celebrate' },
  { step: 3, status: 'supplied', message: '✅ ซัพพลายสำเร็จ! เหรียญถูกส่งไปยังปลายทางแล้ว', mood: 'success' },
];

workflow.forEach(({ step, status, message, mood }) => {
  console.log(`Step ${step}: ${status.toUpperCase()}`);
  console.log(`  Mood: ${getMoodEmoji(mood)} ${mood}`);
  console.log(`  MeeBot: "${message}"\n`);
});

// Demo 3: Failure Recovery
console.log('\n⚠️  Demo 3: Failure Recovery Flow\n');

const failureWorkflow = [
  { step: 1, status: 'pending', message: '⏳ กำลังตรวจสอบธุรกรรม กรุณารอสักครู่...', mood: 'thinking' },
  { step: 2, status: 'failed', message: '😕 ดูเหมือน replay ยังไม่สำเร็จนะครับ รออีกสักครู่หรือกด "ดึงเหรียญกลับ" ถ้าคุณมีสิทธิ์', mood: 'confused' },
  { step: 3, status: 'refunded', message: '↩️ เหรียญถูกดึงกลับแล้ว ตรวจสอบกระเป๋าของคุณนะครับ', mood: 'neutral' },
];

failureWorkflow.forEach(({ step, status, message, mood }) => {
  console.log(`Step ${step}: ${status.toUpperCase()}`);
  console.log(`  Mood: ${getMoodEmoji(mood)} ${mood}`);
  console.log(`  MeeBot: "${message}"\n`);
});

// Demo 4: UI Components
console.log('\n🎨 Demo 4: UI Components Available\n');

const components = [
  { name: 'CoinStatus', description: 'Main transaction status display with role-based actions' },
  { name: 'CoinStatusDemo', description: 'Interactive demo with role switcher' },
  { name: 'MeeBotSprite', description: 'Visual MeeBot feedback with mood expressions' },
];

components.forEach(({ name, description }) => {
  console.log(`  • ${name}`);
  console.log(`    ${description}\n`);
});

console.log('=' .repeat(60));
console.log('\n✅ Demo completed successfully!');
console.log('\n📖 To see the live demo:');
console.log('   1. cd viewer');
console.log('   2. npm install');
console.log('   3. npm run dev');
console.log('   4. Navigate to "Coin Status" tab\n');

// Helper functions
function getRoleIcon(role) {
  const icons = {
    'User': '👤',
    'Supplier': '🚀',
    'RecoveryAgent': '🛡️',
    'Auditor': '📊',
  };
  return icons[role] || '❓';
}

function getMoodEmoji(mood) {
  const emojis = {
    'neutral': '🤖',
    'thinking': '🤔',
    'celebrate': '🎉',
    'confused': '😟',
    'warning': '⚠️',
    'success': '✅',
  };
  return emojis[mood] || '🤖';
}

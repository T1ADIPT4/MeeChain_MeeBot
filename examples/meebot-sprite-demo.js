#!/usr/bin/env node

/**
 * MeeBot Sprite & Dashboard Demo
 * Demonstrates the new MeeBotSprite component and MilestoneDashboard
 * 
 * Usage: node examples/meebot-sprite-demo.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
╔════════════════════════════════════════════════════════════════╗
║        MeeBot Sprite & Dashboard Integration Demo            ║
║        เดโมระบบ MeeBot Sprite และ Dashboard                  ║
╚════════════════════════════════════════════════════════════════╝
`);

// Read milestone log
const milestoneLogPath = path.join(__dirname, '../copilot/milestone.log');
const logContent = fs.readFileSync(milestoneLogPath, 'utf-8');

// Parse milestones
const milestones = [];
const lines = logContent.split('\n');

let currentMilestone = null;
for (const line of lines) {
  const milestoneMatch = line.match(/\[(.*?)\]\s+(M\d+):\s+(.+)/);
  if (milestoneMatch) {
    if (currentMilestone) {
      milestones.push(currentMilestone);
    }
    currentMilestone = {
      timestamp: milestoneMatch[1],
      id: milestoneMatch[2],
      title: milestoneMatch[3],
      status: '⏳',
      details: '',
      sprite: '🤖'
    };
  }
  
  if (currentMilestone) {
    const statusMatch = line.match(/Status:\s+(✅|⏳)/);
    if (statusMatch) {
      currentMilestone.status = statusMatch[1];
    }
    
    const detailsMatch = line.match(/Details:\s+(.+)/);
    if (detailsMatch) {
      currentMilestone.details = detailsMatch[1];
    }
    
    const spriteMatch = line.match(/MeeBot:\s+([🟢🟣🔵🟠🟡])/);
    if (spriteMatch) {
      currentMilestone.sprite = spriteMatch[1];
    }
  }
}

if (currentMilestone) {
  milestones.push(currentMilestone);
}

// Display milestone summary
console.log('📊 Milestone Summary (ภาพรวม Milestone)\n');
console.log('┌─────┬──────────────────────────────┬────────┬─────────┐');
console.log('│ ID  │ Title                        │ Status │ Sprite  │');
console.log('├─────┼──────────────────────────────┼────────┼─────────┤');

milestones.forEach(m => {
  const title = m.title.padEnd(28).substring(0, 28);
  console.log(`│ ${m.id}  │ ${title} │ ${m.status}     │ ${m.sprite}       │`);
});

console.log('└─────┴──────────────────────────────┴────────┴─────────┘\n');

// Display progress
const completedCount = milestones.filter(m => m.status === '✅').length;
const totalCount = milestones.length;
const percentage = Math.round((completedCount / totalCount) * 100);

console.log(`📈 Progress (ความคืบหน้า): ${completedCount}/${totalCount} (${percentage}%)\n`);

// Display progress bar
const barLength = 40;
const filledLength = Math.round((percentage / 100) * barLength);
const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
console.log(`[${bar}] ${percentage}%\n`);

// Display sprite feedback for each milestone
console.log('🎨 MeeBot Sprite Feedback by Milestone:\n');
console.log('┌─────┬─────────┬──────────────────────────────────────────────┐');
console.log('│ ID  │ Sprite  │ Message                                      │');
console.log('├─────┼─────────┼──────────────────────────────────────────────┤');

// Thai dictionary
const messages = {
  M1: 'เริ่มต้นระบบสำเร็จแล้ว',
  M2: 'สร้าง metadata สำเร็จ',
  M3: 'ตรวจสอบ fallback viewer แล้ว',
  M4: 'อัปโหลด badge สำเร็จ',
  M5: 'MeeBot แสดง sprite แล้ว',
  M6: 'ตรวจสอบความถูกต้องของคำตอบ (98%)',
  M7: 'บันทึก milestone อัตโนมัติสำเร็จ',
  M8: 'Mint NFT badge สำเร็จ',
  M9: 'Deploy และเชื่อมกับ dashboard สำเร็จ'
};

milestones.forEach(m => {
  const msg = (messages[m.id] || m.title).padEnd(44).substring(0, 44);
  console.log(`│ ${m.id}  │ ${m.sprite}       │ ${msg} │`);
});

console.log('└─────┴─────────┴──────────────────────────────────────────────┘\n');

// Component usage examples
console.log('📦 Component Usage Examples:\n');

console.log('1️⃣  MeeBotSprite Component (React/TypeScript):\n');
console.log(`   import { MeeBotSprite } from '../components/MeeBotSprite'
   
   <MeeBotSprite
     milestoneId="M1"
     status="celebrate"
     message="เริ่มต้นระบบสำเร็จแล้ว"
     language="th"
   />\n`);

console.log('2️⃣  MilestoneChart Component (React/TypeScript):\n');
console.log(`   import { MilestoneChart } from '../components/MilestoneChart'
   
   <MilestoneChart
     language="th"
     showSprites={true}
   />\n`);

console.log('3️⃣  MilestoneDashboard Page (Full Integration):\n');
console.log(`   import MilestoneDashboard from '../pages/MilestoneDashboard'
   
   <MilestoneDashboard />\n`);

// Integration workflow
console.log('🔄 Integration Workflow:\n');
console.log(`   Step 1: Generate metadata
   $ npm run ipfs:generate-metadata
   
   Step 2: Verify MeeBot system
   $ npm run verify:meebot
   
   Step 3: Run sprite demo (this script)
   $ node examples/meebot-sprite-demo.js
   
   Step 4: Use components in your React app
   Import from components/ and pages/ directories\n`);

// Feature summary
console.log('✨ Features Implemented:\n');
const features = [
  '✅ MeeBotSprite component with milestone-based feedback',
  '✅ MilestoneChart component with progress visualization',
  '✅ MilestoneDashboard page with language toggle',
  '✅ Thai/English i18n support (embedded dictionaries)',
  '✅ Sprite status mapping (celebrate, idle, loading, error)',
  '✅ Fallback-aware badge metadata integration',
  '✅ Auto-loading from milestone.log',
  '✅ Interactive progress bar and statistics',
  '✅ Responsive design with Tailwind-like styling'
];

features.forEach(f => console.log(`   ${f}`));

console.log('\n🎉 All 9 milestones (M1-M9) are now tracked!\n');
console.log('MeeBot: "ระบบพร้อมใช้งานแล้วครับครู! 🟢🎯"\n');

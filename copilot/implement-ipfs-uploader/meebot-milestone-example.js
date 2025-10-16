/**
 * Example: MeeBot Milestone Integration
 * Demonstrates how to read milestone.log and trigger MeeBot sprite feedback
 */

import fs from 'fs';
import { MeeBot } from '../../dist/components/MeeBot.js';

const MILESTONE_LOG = './milestone.log';

/**
 * Read milestone log and trigger MeeBot feedback
 */
function processMilestones() {
  console.log('📖 Reading milestone.log for MeeBot feedback...\n');
  
  if (!fs.existsSync(MILESTONE_LOG)) {
    console.log('⚠️  No milestone.log found. Run metadata generator first:');
    console.log('   npm run ipfs:generate-metadata');
    return;
  }
  
  // Read milestone log
  const logContent = fs.readFileSync(MILESTONE_LOG, 'utf8');
  const milestones = logContent.split('\n').filter(line => line.trim());
  
  console.log(`Found ${milestones.length} milestone(s):\n`);
  
  // Process each milestone
  milestones.forEach((milestone, index) => {
    console.log(`Milestone ${index + 1}: ${milestone}`);
    
    // Trigger MeeBot feedback
    MeeBot.milestoneFeedback(milestone);
    
    console.log(`  Current sprite: ${MeeBot.getCurrentSprite()}`);
    console.log(`  Last message: ${MeeBot.getLastMessage()}`);
    console.log('');
  });
  
  console.log('✅ All milestones processed!\n');
}

/**
 * Example: Monitor milestone.log for changes (production usage)
 * This would watch the file and trigger MeeBot feedback in real-time
 */
function watchMilestones() {
  console.log('👀 Watching milestone.log for changes...\n');
  console.log('Press Ctrl+C to stop\n');
  
  let lastContent = '';
  
  if (fs.existsSync(MILESTONE_LOG)) {
    lastContent = fs.readFileSync(MILESTONE_LOG, 'utf8');
  }
  
  fs.watchFile(MILESTONE_LOG, { interval: 1000 }, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
      const newContent = fs.readFileSync(MILESTONE_LOG, 'utf8');
      const newMilestones = newContent.split('\n').filter(line => {
        return line.trim() && !lastContent.includes(line);
      });
      
      if (newMilestones.length > 0) {
        console.log(`\n🆕 New milestone(s) detected!\n`);
        newMilestones.forEach(milestone => {
          console.log(`📌 ${milestone}`);
          MeeBot.milestoneFeedback(milestone);
          console.log(`   Sprite: ${MeeBot.getCurrentSprite()}`);
          console.log(`   Message: ${MeeBot.getLastMessage()}\n`);
        });
      }
      
      lastContent = newContent;
    }
  });
}

// Example usage
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║          MeeBot Milestone Integration Example           ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Read and process existing milestones
processMilestones();

// Uncomment to watch for new milestones in real-time
// watchMilestones();

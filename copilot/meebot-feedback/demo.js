#!/usr/bin/env node
/**
 * MeeBot Dictionary Demo
 * Demonstrates the i18n dictionary system for MeeBot feedback
 */

// Import dictionaries
import feedbackTH from './th.js';
import feedbackEN from './en.js';

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     MeeBot Dictionary System Demo (i18n-ready)           ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Test Thai dictionary
console.log(`${colors.blue}🇹🇭 Thai Dictionary (th.js):${colors.reset}`);
console.log('─────────────────────────────────────────────────────────────');
console.log(`M1: ${feedbackTH.M1}`);
console.log(`M2: ${feedbackTH.M2}`);
console.log(`M3: ${feedbackTH.M3}`);
console.log(`M4: ${feedbackTH.M4}`);
console.log(`M5: ${feedbackTH.M5}`);
console.log(`M6: ${feedbackTH.M6}`);
console.log(`Fallback: ${feedbackTH.fallback}`);
console.log(`Quest Success: ${feedbackTH.quest_success}`);
console.log(`TTS Enabled: ${feedbackTH.tts_enabled}`);
console.log(`Metadata Ready: ${feedbackTH.metadata_ready}\n`);

// Test English dictionary
console.log(`${colors.green}🇬🇧 English Dictionary (en.js):${colors.reset}`);
console.log('─────────────────────────────────────────────────────────────');
console.log(`M1: ${feedbackEN.M1}`);
console.log(`M2: ${feedbackEN.M2}`);
console.log(`M3: ${feedbackEN.M3}`);
console.log(`M4: ${feedbackEN.M4}`);
console.log(`M5: ${feedbackEN.M5}`);
console.log(`M6: ${feedbackEN.M6}`);
console.log(`Fallback: ${feedbackEN.fallback}`);
console.log(`Quest Success: ${feedbackEN.quest_success}`);
console.log(`TTS Enabled: ${feedbackEN.tts_enabled}`);
console.log(`Metadata Ready: ${feedbackEN.metadata_ready}\n`);

// Simulate MeeBot usage with dictionary
console.log(`${colors.purple}🤖 MeeBot Integration Example:${colors.reset}`);
console.log('─────────────────────────────────────────────────────────────');

function getMeeBotMessage(milestone, lang = 'th') {
  const dict = lang === 'th' ? feedbackTH : feedbackEN;
  return dict[milestone] || dict.fallback;
}

// Test different milestones
const milestones = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
milestones.forEach(milestone => {
  const messageTH = getMeeBotMessage(milestone, 'th');
  const messageEN = getMeeBotMessage(milestone, 'en');
  console.log(`\n${milestone}:`);
  console.log(`  🇹🇭 ${messageTH}`);
  console.log(`  🇬🇧 ${messageEN}`);
});

// Test fallback
console.log(`\n${colors.yellow}Testing fallback message:${colors.reset}`);
console.log(`  🇹🇭 ${getMeeBotMessage('UNKNOWN', 'th')}`);
console.log(`  🇬🇧 ${getMeeBotMessage('UNKNOWN', 'en')}`);

console.log(`\n${colors.green}✅ Dictionary system working correctly!${colors.reset}`);
console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║  MeeBot is ready to communicate in multiple languages!   ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

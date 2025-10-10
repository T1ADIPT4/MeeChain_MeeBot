#!/usr/bin/env node
/**
 * MeeBot Flow Verification Script
 * Automatically verifies all MeeBot checklist requirements:
 * - Milestone log completeness
 * - Badge assets matching milestones
 * - Config with fallback support
 * - Uploader integration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  reset: '\x1b[0m'
};

// Verification results
const results = {
  milestoneLog: [],
  badgeAssets: [],
  config: [],
  uploader: [],
  viewer: [],
  i18n: []
};

/**
 * Check if file exists
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Read file content
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
}

/**
 * Print header
 */
function printHeader(title, emoji) {
  console.log(`\n${emoji} ${colors.blue}${title}${colors.reset}`);
  console.log('='.repeat(60));
}

/**
 * Print check result
 */
function printCheck(passed, message) {
  const icon = passed ? '✅' : '❌';
  const color = passed ? colors.green : colors.red;
  console.log(`${icon} ${color}${message}${colors.reset}`);
}

/**
 * 🟡 1. Milestone Log Verification
 */
function verifyMilestoneLog() {
  printHeader('1. Milestone Log Verification', '🟡');
  
  const milestonePath = path.join(__dirname, 'milestone.log');
  
  // Check if file exists
  const exists = fileExists(milestonePath);
  printCheck(exists, 'milestone.log exists in repo');
  results.milestoneLog.push({ check: 'File exists', passed: exists });
  
  if (!exists) {
    return;
  }
  
  const content = readFile(milestonePath);
  
  // Check for milestones M1-M5
  const milestones = ['M1', 'M2', 'M3', 'M4', 'M5'];
  const foundMilestones = [];
  
  milestones.forEach(milestone => {
    const regex = new RegExp(`${milestone}:`, 'i');
    const found = regex.test(content);
    foundMilestones.push(milestone);
    printCheck(found, `Milestone ${milestone} found in log`);
    results.milestoneLog.push({ check: `${milestone} present`, passed: found });
  });
  
  // Check for MeeBot format
  const hasMeeBot = content.includes('MeeBot');
  printCheck(hasMeeBot, 'MeeBot feedback format present');
  results.milestoneLog.push({ check: 'MeeBot format', passed: hasMeeBot });
  
  // Check for status indicators (emojis)
  const hasStatusEmojis = /[🟢🟣🔵🟠🟡]/.test(content);
  printCheck(hasStatusEmojis, 'Status indicators (colored circles) present');
  results.milestoneLog.push({ check: 'Status emojis', passed: hasStatusEmojis });
  
  // Check for readable format (should have descriptions)
  const hasDescriptions = content.includes('Details:') || content.includes('Status:');
  printCheck(hasDescriptions, 'Milestones have descriptions/status');
  results.milestoneLog.push({ check: 'Milestone descriptions', passed: hasDescriptions });
}

/**
 * 🟣 2. Badge Assets Verification
 */
function verifyBadgeAssets() {
  printHeader('2. Badge Assets Verification', '🟣');
  
  const badgesDir = path.join(__dirname, 'assets', 'badges');
  const fallbackDir = path.join(__dirname, 'assets', 'fallback');
  
  // Check for milestone badge SVGs
  const milestones = ['1', '2', '3', '4', '5'];
  milestones.forEach(num => {
    const badgePath = path.join(badgesDir, `milestone-${num}.svg`);
    const exists = fileExists(badgePath);
    printCheck(exists, `milestone-${num}.svg exists`);
    results.badgeAssets.push({ check: `milestone-${num}.svg`, passed: exists });
    
    // Check if it's a valid SVG
    if (exists) {
      const content = readFile(badgePath);
      const isValidSVG = content && content.includes('<svg');
      const hasMilestoneNumber = content && content.includes(`M${num}`);
      printCheck(isValidSVG && hasMilestoneNumber, `  ↳ Valid SVG with M${num} marker`);
      results.badgeAssets.push({ 
        check: `milestone-${num}.svg valid`, 
        passed: isValidSVG && hasMilestoneNumber 
      });
    }
  });
  
  // Check for fallback assets
  const fallbackExists = fileExists(fallbackDir);
  printCheck(fallbackExists, 'Fallback directory exists');
  results.badgeAssets.push({ check: 'Fallback directory', passed: fallbackExists });
  
  if (fallbackExists) {
    const placeholderPath = path.join(fallbackDir, 'badge-placeholder.svg');
    const placeholderExists = fileExists(placeholderPath);
    printCheck(placeholderExists, 'badge-placeholder.svg exists in fallback/');
    results.badgeAssets.push({ check: 'Fallback placeholder', passed: placeholderExists });
  }
}

/**
 * 🟢 3. Config & Simulation Verification
 */
function verifyConfig() {
  printHeader('3. Config & Simulation Verification', '🟢');
  
  const configPath = path.join(__dirname, 'ipfs-uploader', 'config.js');
  const configCjsPath = path.join(__dirname, 'ipfs-uploader', 'config.cjs');
  
  const configExists = fileExists(configPath) || fileExists(configCjsPath);
  printCheck(configExists, 'config.js exists');
  results.config.push({ check: 'Config file exists', passed: configExists });
  
  if (!configExists) {
    return;
  }
  
  const content = readFile(configPath) || readFile(configCjsPath);
  
  // Check for fallback-aware endpoints
  const hasFallbackEndpoints = content.includes('fallbackEndpoints');
  printCheck(hasFallbackEndpoints, 'Fallback endpoints configured');
  results.config.push({ check: 'Fallback endpoints', passed: hasFallbackEndpoints });
  
  const hasFallbackAssetPath = content.includes('fallbackAssetPath');
  printCheck(hasFallbackAssetPath, 'Fallback asset path configured');
  results.config.push({ check: 'Fallback asset path', passed: hasFallbackAssetPath });
  
  // Check for IPFS configuration
  const hasIPFSEndpoint = content.includes('ipfsEndpoint');
  printCheck(hasIPFSEndpoint, 'IPFS endpoint configured');
  results.config.push({ check: 'IPFS endpoint', passed: hasIPFSEndpoint });
  
  // Check for retry logic
  const hasRetryConfig = content.includes('retry') || content.includes('maxRetries');
  printCheck(hasRetryConfig, 'Retry configuration present');
  results.config.push({ check: 'Retry config', passed: hasRetryConfig });
  
  // Check for comments/TODOs about IPFS integration
  const hasIPFSComments = content.includes('ipfs-http-client') || 
                          content.includes('TODO') || 
                          content.includes('IPFS');
  printCheck(hasIPFSComments, 'IPFS integration comments/TODOs present');
  results.config.push({ check: 'IPFS comments', passed: hasIPFSComments });
}

/**
 * 🔵 4. Uploader & Metadata Verification
 */
function verifyUploader() {
  printHeader('4. Uploader & Metadata Verification', '🔵');
  
  const indexPath = path.join(__dirname, 'ipfs-uploader', 'index.js');
  const metadataPath = path.join(__dirname, 'ipfs-uploader', 'metadata-generator.js');
  const metadataCjsPath = path.join(__dirname, 'ipfs-uploader', 'metadata-generator.cjs');
  
  // Check index.js exists
  const indexExists = fileExists(indexPath);
  printCheck(indexExists, 'index.js exists');
  results.uploader.push({ check: 'index.js exists', passed: indexExists });
  
  // Check metadata-generator exists
  const metadataExists = fileExists(metadataPath) || fileExists(metadataCjsPath);
  printCheck(metadataExists, 'metadata-generator.js exists');
  results.uploader.push({ check: 'metadata-generator exists', passed: metadataExists });
  
  if (!indexExists || !metadataExists) {
    return;
  }
  
  const indexContent = readFile(indexPath);
  const metadataContent = readFile(metadataPath) || readFile(metadataCjsPath);
  
  // Check integration between index and metadata-generator
  const indexImportsMetadata = indexContent.includes('metadata-generator') || 
                                indexContent.includes('generateMetadata');
  printCheck(indexImportsMetadata, 'index.js imports metadata-generator');
  results.uploader.push({ check: 'Index imports metadata', passed: indexImportsMetadata });
  
  // Check for badge upload with hash
  const uploadsBadge = indexContent.includes('uploadBadge') || indexContent.includes('uploadFile');
  printCheck(uploadsBadge, 'Badge upload functionality present');
  results.uploader.push({ check: 'Upload functionality', passed: uploadsBadge });
  
  // Check for fallback on upload failure
  const handlesFallback = indexContent.includes('fallback') && 
                          indexContent.includes('error');
  printCheck(handlesFallback, 'Fallback handling on upload failure');
  results.uploader.push({ check: 'Fallback on error', passed: handlesFallback });
  
  // Check for milestone log trigger
  const triggersMilestone = indexContent.includes('milestone') || 
                           metadataContent.includes('milestone');
  printCheck(triggersMilestone, 'Milestone log triggering capability');
  results.uploader.push({ check: 'Milestone trigger', passed: triggersMilestone });
  
  // Check for ERC-721 compliance
  const isERC721 = metadataContent.includes('ERC') || 
                   (metadataContent.includes('name') && 
                    metadataContent.includes('description') && 
                    metadataContent.includes('image'));
  printCheck(isERC721, 'ERC-721 metadata compliance');
  results.uploader.push({ check: 'ERC-721 compliance', passed: isERC721 });
}

/**
 * 🟠 5. Viewer & MeeBot Integration Verification
 */
function verifyViewer() {
  printHeader('5. Viewer & MeeBot Integration Verification', '🟠');
  
  const viewerPath = path.join(__dirname, 'ipfs-uploader', 'fallback-viewer.js');
  const meebotPath = path.join(__dirname, '..', 'components', 'MeeBot.tsx');
  const meebotExamplePath = path.join(__dirname, 'implement-ipfs-uploader', 'meebot-milestone-example.js');
  
  // Check viewer exists
  const viewerExists = fileExists(viewerPath);
  printCheck(viewerExists, 'Viewer (fallback-viewer.js) exists');
  results.viewer.push({ check: 'Viewer exists', passed: viewerExists });
  
  if (viewerExists) {
    const viewerContent = readFile(viewerPath);
    const loadsBadges = viewerContent.includes('badge') || viewerContent.includes('asset');
    printCheck(loadsBadges, 'Viewer loads badges from assets');
    results.viewer.push({ check: 'Loads badges', passed: loadsBadges });
  }
  
  // Check MeeBot component
  const meebotExists = fileExists(meebotPath);
  printCheck(meebotExists, 'MeeBot component exists');
  results.viewer.push({ check: 'MeeBot component', passed: meebotExists });
  
  if (meebotExists) {
    const meebotContent = readFile(meebotPath);
    
    // Check for sprite functionality
    const hasSprite = meebotContent.includes('sprite');
    printCheck(hasSprite, 'MeeBot has sprite support');
    results.viewer.push({ check: 'Sprite support', passed: hasSprite });
    
    // Check for milestone feedback
    const hasMilestoneFeedback = meebotContent.includes('milestoneFeedback') || 
                                  meebotContent.includes('milestone');
    printCheck(hasMilestoneFeedback, 'MeeBot milestone feedback method');
    results.viewer.push({ check: 'Milestone feedback', passed: hasMilestoneFeedback });
    
    // Check for Thai language support
    const hasThaiSupport = /[\u0E00-\u0E7F]/.test(meebotContent);
    printCheck(hasThaiSupport, 'MeeBot supports Thai language');
    results.viewer.push({ check: 'Thai support', passed: hasThaiSupport });
  }
  
  // Check for MeeBot example integration
  const exampleExists = fileExists(meebotExamplePath);
  printCheck(exampleExists, 'MeeBot milestone integration example exists');
  results.viewer.push({ check: 'Integration example', passed: exampleExists });
}

/**
 * 🌍 6. i18n Dictionary & Viewer Verification
 */
function verifyI18n() {
  printHeader('6. i18n Dictionary & Viewer System Verification', '🌍');
  
  // Check MeeBot dictionary files
  const thDictPath = path.join(__dirname, 'meebot-feedback', 'th.js');
  const enDictPath = path.join(__dirname, 'meebot-feedback', 'en.js');
  
  const thDictExists = fileExists(thDictPath);
  printCheck(thDictExists, 'Thai dictionary (th.js) exists');
  results.i18n.push({ check: 'Thai dictionary', passed: thDictExists });
  
  const enDictExists = fileExists(enDictPath);
  printCheck(enDictExists, 'English dictionary (en.js) exists');
  results.i18n.push({ check: 'English dictionary', passed: enDictExists });
  
  // Check dictionary content
  if (thDictExists && enDictExists) {
    const thContent = readFile(thDictPath);
    const enContent = readFile(enDictPath);
    
    // Check for milestone keys
    const milestones = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
    const thHasMilestones = milestones.every(m => thContent.includes(`${m}:`));
    const enHasMilestones = milestones.every(m => enContent.includes(`${m}:`));
    
    printCheck(thHasMilestones, 'Thai dictionary has all milestone keys');
    results.i18n.push({ check: 'Thai milestone keys', passed: thHasMilestones });
    
    printCheck(enHasMilestones, 'English dictionary has all milestone keys');
    results.i18n.push({ check: 'English milestone keys', passed: enHasMilestones });
    
    // Check for fallback message
    const thHasFallback = thContent.includes('fallback:');
    const enHasFallback = enContent.includes('fallback:');
    
    printCheck(thHasFallback, 'Thai dictionary has fallback message');
    results.i18n.push({ check: 'Thai fallback', passed: thHasFallback });
    
    printCheck(enHasFallback, 'English dictionary has fallback message');
    results.i18n.push({ check: 'English fallback', passed: enHasFallback });
  }
  
  // Check viewer i18n files
  const viewerThPath = path.join(__dirname, '..', 'viewer', 'i18n', 'th.json');
  const viewerEnPath = path.join(__dirname, '..', 'viewer', 'i18n', 'en.json');
  
  const viewerThExists = fileExists(viewerThPath);
  printCheck(viewerThExists, 'Viewer Thai translations (th.json) exist');
  results.i18n.push({ check: 'Viewer Thai i18n', passed: viewerThExists });
  
  const viewerEnExists = fileExists(viewerEnPath);
  printCheck(viewerEnExists, 'Viewer English translations (en.json) exist');
  results.i18n.push({ check: 'Viewer English i18n', passed: viewerEnExists });
  
  // Check viewer.js for i18n support
  const viewerJsPath = path.join(__dirname, '..', 'viewer', 'viewer.js');
  const viewerJsExists = fileExists(viewerJsPath);
  printCheck(viewerJsExists, 'viewer.js exists');
  results.i18n.push({ check: 'viewer.js', passed: viewerJsExists });
  
  if (viewerJsExists) {
    const viewerJsContent = readFile(viewerJsPath);
    
    const hasLoadI18n = viewerJsContent.includes('loadI18n');
    printCheck(hasLoadI18n, 'viewer.js has loadI18n function');
    results.i18n.push({ check: 'loadI18n function', passed: hasLoadI18n });
    
    const hasSwitchLanguage = viewerJsContent.includes('switchLanguage');
    printCheck(hasSwitchLanguage, 'viewer.js has switchLanguage function');
    results.i18n.push({ check: 'switchLanguage function', passed: hasSwitchLanguage });
    
    const hasTranslateFunc = viewerJsContent.includes('function t(');
    printCheck(hasTranslateFunc, 'viewer.js has translation function');
    results.i18n.push({ check: 'Translation function', passed: hasTranslateFunc });
  }
  
  // Check viewer index.html
  const viewerHtmlPath = path.join(__dirname, '..', 'viewer', 'index.html');
  const viewerHtmlExists = fileExists(viewerHtmlPath);
  printCheck(viewerHtmlExists, 'viewer index.html exists');
  results.i18n.push({ check: 'index.html', passed: viewerHtmlExists });
  
  if (viewerHtmlExists) {
    const htmlContent = readFile(viewerHtmlPath);
    
    const hasLangSwitcher = htmlContent.includes('language-switcher') || 
                           htmlContent.includes('switchLanguage');
    printCheck(hasLangSwitcher, 'index.html has language switcher');
    results.i18n.push({ check: 'Language switcher', passed: hasLangSwitcher });
  }
  
  // Check demo scripts
  const demoPath = path.join(__dirname, 'meebot-feedback', 'demo.js');
  const integrationPath = path.join(__dirname, 'meebot-feedback', 'integration-example.js');
  
  const demoExists = fileExists(demoPath);
  printCheck(demoExists, 'Dictionary demo script exists');
  results.i18n.push({ check: 'Demo script', passed: demoExists });
  
  const integrationExists = fileExists(integrationPath);
  printCheck(integrationExists, 'Integration example script exists');
  results.i18n.push({ check: 'Integration example', passed: integrationExists });
}

/**
 * Print summary
 */
function printSummary() {
  printHeader('Summary', '📊');
  
  const categories = [
    { name: '🟡 Milestone Log', results: results.milestoneLog },
    { name: '🟣 Badge Assets', results: results.badgeAssets },
    { name: '🟢 Config & Simulation', results: results.config },
    { name: '🔵 Uploader & Metadata', results: results.uploader },
    { name: '🟠 Viewer & MeeBot', results: results.viewer },
    { name: '🌍 i18n Dictionary & Viewer', results: results.i18n }
  ];
  
  let totalPassed = 0;
  let totalChecks = 0;
  
  categories.forEach(category => {
    const passed = category.results.filter(r => r.passed).length;
    const total = category.results.length;
    totalPassed += passed;
    totalChecks += total;
    
    const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
    const color = percentage === 100 ? colors.green : 
                  percentage >= 80 ? colors.yellow : colors.red;
    
    console.log(`${category.name}: ${color}${passed}/${total} (${percentage}%)${colors.reset}`);
  });
  
  console.log('\n' + '='.repeat(60));
  const overallPercentage = totalChecks > 0 ? Math.round((totalPassed / totalChecks) * 100) : 0;
  const overallColor = overallPercentage === 100 ? colors.green : 
                       overallPercentage >= 80 ? colors.yellow : colors.red;
  
  console.log(`${colors.blue}Overall:${colors.reset} ${overallColor}${totalPassed}/${totalChecks} checks passed (${overallPercentage}%)${colors.reset}\n`);
  
  if (overallPercentage === 100) {
    console.log(`${colors.green}🎉 All MeeBot flow checks passed!${colors.reset}\n`);
  } else if (overallPercentage >= 80) {
    console.log(`${colors.yellow}⚠️  Most checks passed, but some items need attention.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}❌ Several checks failed. Please review the items above.${colors.reset}\n`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║        MeeBot Flow Verification Script                   ║
║        Checklist ตรวจสอบงานนักบิน (MeeChain MeeBot)      ║
╚═══════════════════════════════════════════════════════════╝
`);
  
  verifyMilestoneLog();
  verifyBadgeAssets();
  verifyConfig();
  verifyUploader();
  verifyViewer();
  verifyI18n();
  printSummary();
}

// Run the verification
main();

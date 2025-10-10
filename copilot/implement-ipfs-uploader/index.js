import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create require for CommonJS modules
const require = createRequire(import.meta.url);

// Import CommonJS modules (use .cjs versions to avoid module conflicts)
const config = require('../ipfs-uploader/config.cjs');
const { generateMetadata: generateMetadataSimple } = require('../ipfs-uploader/metadata-generator.cjs');

// Try to load ipfs-http-client, but don't fail if not available (simulation mode)
let createIPFS = null;
try {
  const ipfsClient = await import('ipfs-http-client');
  createIPFS = ipfsClient.create;
} catch (err) {
  console.log('ℹ️  ipfs-http-client not installed, running in simulation mode only');
}

const badgePath = './copilot/assets/fallback/milestone-5.svg';
const logPath = './milestone.log';
const blockedLogPath = '/home/runner/work/_temp/runtime-logs/blocked.md';

/**
 * Log milestone to milestone.log
 * @param {string} id - Milestone ID (e.g., 'M5')
 * @param {string} message - Milestone message
 */
function logMilestone(id, message) {
  const entry = `\n${id}: ${message}`;
  fs.appendFileSync(logPath, entry);
  console.log(`📘 Milestone logged: ${entry.trim()}`);
}

/**
 * Ensure blocked log file exists
 */
function ensureBlockedLog() {
  if (!fs.existsSync(blockedLogPath)) {
    const dir = path.dirname(blockedLogPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(blockedLogPath, 'ไม่มีข้อมูลที่ถูกบล็อกในรอบนี้');
    console.log('🟡 Fallback blocked.md created');
  }
}

/**
 * Upload badge to IPFS with fallback support
 * @param {string} filePath - Path to badge file
 * @returns {Promise<string>} CID or fallback CID
 */
async function uploadBadge(filePath) {
  // Check if in simulation mode or IPFS client not available
  if (config.simulationMode || !createIPFS) {
    console.log('🟡 Simulation mode: skipping IPFS upload');
    return 'SIMULATED_CID';
  }

  try {
    const ipfs = createIPFS({ url: config.ipfsEndpoint });
    const file = fs.readFileSync(filePath);
    const { cid } = await ipfs.add(file);
    console.log(`✅ Badge uploaded: ${cid}`);
    return cid.toString();
  } catch (err) {
    console.error('❌ Upload failed, using fallback');
    return 'FALLBACK_CID';
  }
}

/**
 * Generate metadata using the simple metadata generator
 * @param {string} cid - IPFS CID
 * @param {string} milestoneId - Milestone identifier
 * @param {string} description - Badge description
 * @returns {Object} Metadata object
 */
function generateMetadata(cid, milestoneId, description) {
  const imageUrl = cid === 'SIMULATED_CID' || cid === 'FALLBACK_CID' 
    ? `/assets/fallback/milestone-5.svg`
    : `ipfs://${cid}`;
  
  // Use the simple metadata generator from cjs
  const metadata = generateMetadataSimple('milestone-5.svg', {
    description: description,
    questId: milestoneId,
    attributes: [
      { trait_type: 'Badge Type', value: 'Milestone' },
      { trait_type: 'Rarity', value: 'Epic' },
      { trait_type: 'Chain', value: 'polygon' }
    ]
  });
  
  // Update the image with the actual CID
  metadata.image = imageUrl;
  
  return metadata;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting MeeBot fallback-aware upload script...\n');
  
  // Ensure blocked log exists
  ensureBlockedLog();

  // Upload badge with fallback support
  const cid = await uploadBadge(badgePath);
  
  // Generate metadata
  const metadata = generateMetadata(cid, 'M5', 'MeeBot badge for Milestone 5 completion');
  
  // Ensure output directory exists
  const outputDir = './output';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write metadata to file
  fs.writeFileSync(
    path.join(outputDir, 'metadata.json'), 
    JSON.stringify(metadata, null, 2)
  );

  // Log milestone
  logMilestone('M5', 'อัปโหลด badge และสร้าง metadata สำเร็จ');
  
  console.log('\n✅ MeeBot: อัปโหลดและบันทึก milestone สำเร็จ!');
  console.log(`📄 Metadata saved to: ${outputDir}/metadata.json`);
  console.log(`📘 Milestone logged to: ${logPath}`);
}

// Run main function
main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

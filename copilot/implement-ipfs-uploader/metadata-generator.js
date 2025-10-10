import fs from 'fs';
import path from 'path';

const BADGE_DIR = './assets/badges';
const FALLBACK_DIR = './assets/fallback';
const OUTPUT_DIR = './copilot/implement-ipfs-uploader/metadata';

/**
 * Generate NFT metadata for a badge
 * @param {string} fileName - The badge file name
 * @returns {object} NFT metadata object compliant with ERC-721/ERC-1155
 */
function generateMetadata(fileName) {
  const name = path.basename(fileName, path.extname(fileName));
  const ipfsHash = `ipfs://${name}-hash`; // Placeholder hash - will be replaced after IPFS upload
  const fallbackPath = `${FALLBACK_DIR}/${fileName}`;

  return {
    name: `Badge: ${name}`,
    description: `NFT badge for ${name}`,
    image: ipfsHash,
    fallback_image: fallbackPath,
    attributes: [
      { trait_type: 'Milestone', value: name },
      { trait_type: 'Uploader', value: 'MeeChain' }
    ]
  };
}

/**
 * Verify that fallback asset exists for a badge
 * @param {string} fileName - The badge file name
 * @returns {boolean} True if fallback exists
 */
function verifyFallbackAsset(fileName) {
  const fallbackPath = path.join(FALLBACK_DIR, fileName);
  if (!fs.existsSync(fallbackPath)) {
    console.warn(`⚠️  Warning: Fallback asset not found for ${fileName}`);
    return false;
  }
  return true;
}

/**
 * Write metadata files for all badges
 */
function writeMetadataFiles() {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Check if badge directory exists
  if (!fs.existsSync(BADGE_DIR)) {
    console.error(`❌ Error: Badge directory not found: ${BADGE_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(BADGE_DIR);
  
  if (files.length === 0) {
    console.warn('⚠️  Warning: No badge files found in', BADGE_DIR);
    return;
  }

  let successCount = 0;
  let warningCount = 0;

  files.forEach(file => {
    // Verify fallback asset exists
    if (!verifyFallbackAsset(file)) {
      warningCount++;
    }

    // Generate metadata
    const metadata = generateMetadata(file);
    const outputPath = path.join(OUTPUT_DIR, `${path.basename(file, path.extname(file))}.json`);
    
    // Write metadata file
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ Metadata generated: ${outputPath}`);
    successCount++;
  });

  // Trigger milestone feedback for MeeBot
  const milestoneLog = 'M2 complete: Metadata generator ready 🟣\n';
  fs.appendFileSync('milestone.log', milestoneLog);
  console.log(`\n🎯 Milestone logged: ${milestoneLog.trim()}`);

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ ${successCount} metadata file(s) generated`);
  if (warningCount > 0) {
    console.log(`   ⚠️  ${warningCount} fallback asset(s) missing`);
  }
  console.log(`   📝 Metadata output: ${OUTPUT_DIR}`);
  console.log(`   🟣 MeeBot sprite feedback triggered via milestone.log`);
}

// Run the metadata generator
writeMetadataFiles();

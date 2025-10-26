/**
 * Auto-sync ABI script
 * Copies ABIs from artifacts to multiple locations (backend, frontend, etc.)
 * Usage: node scripts/export-abi.js [contract-name]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Target directories for ABI sync
const ABI_TARGETS = [
  'abi',              // Root abi directory
  'backend/abi',      // Backend service
  'viewer/abis',      // Frontend viewer
  'viewer/src/abis'   // Frontend src
];

/**
 * Extract ABI from Hardhat artifact
 * @param {string} artifactPath - Path to the artifact JSON file
 * @returns {object} ABI object
 */
function extractABI(artifactPath) {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf-8'));
  return {
    _format: artifact._format || 'hh-sol-artifact-1',
    contractName: artifact.contractName,
    sourceName: artifact.sourceName,
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    deployedBytecode: artifact.deployedBytecode,
    linkReferences: artifact.linkReferences,
    deployedLinkReferences: artifact.deployedLinkReferences
  };
}

/**
 * Sync ABI to target directories
 * @param {string} contractName - Name of the contract
 * @param {object} abiData - ABI data to sync
 */
function syncABI(contractName, abiData) {
  let syncCount = 0;
  const abiFileName = `${contractName}.json`;

  ABI_TARGETS.forEach(targetDir => {
    const targetPath = path.join(rootDir, targetDir);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
      console.log(`✅ Created directory: ${targetDir}`);
    }

    // Write ABI file
    const abiFilePath = path.join(targetPath, abiFileName);
    fs.writeFileSync(abiFilePath, JSON.stringify(abiData, null, 2));
    console.log(`✅ Synced to: ${targetDir}/${abiFileName}`);
    syncCount++;
  });

  return syncCount;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const contractName = args[0];

  console.log('🔄 ABI Auto-Sync Tool\n');
  console.log('='.repeat(60));

  if (!contractName) {
    console.log('Usage: node scripts/export-abi.js <contract-name>');
    console.log('\nExample: node scripts/export-abi.js MeeChainSupply');
    console.log('\nAvailable contracts:');
    
    // List available contracts from artifacts
    const artifactsDir = path.join(rootDir, 'artifacts/contracts');
    if (fs.existsSync(artifactsDir)) {
      const contracts = fs.readdirSync(artifactsDir);
      contracts.forEach(contract => {
        console.log(`  - ${contract.replace('.sol', '')}`);
      });
    } else {
      console.log('  No compiled contracts found. Run: npx hardhat compile');
    }
    process.exit(1);
  }

  // Find artifact file
  const artifactPath = path.join(
    rootDir,
    'artifacts/contracts',
    `${contractName}.sol`,
    `${contractName}.json`
  );

  if (!fs.existsSync(artifactPath)) {
    console.error(`❌ Artifact not found: ${artifactPath}`);
    console.log('\nTip: Make sure to compile contracts first:');
    console.log('  npx hardhat compile');
    process.exit(1);
  }

  console.log(`📄 Contract: ${contractName}`);
  console.log(`📦 Artifact: ${artifactPath}\n`);

  // Extract and sync ABI
  const abiData = extractABI(artifactPath);
  const syncCount = syncABI(contractName, abiData);

  console.log('\n' + '='.repeat(60));
  console.log(`✨ Success! Synced ABI to ${syncCount} locations`);
  console.log('\n💡 Tip: Add this to your deployment script:');
  console.log(`   node scripts/export-abi.js ${contractName}`);
}

// Handle errors
main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});

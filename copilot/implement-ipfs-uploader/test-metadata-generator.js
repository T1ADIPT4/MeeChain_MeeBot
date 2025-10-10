/**
 * Test for metadata-generator.js
 * Verifies that metadata generation works correctly
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const METADATA_DIR = './copilot/implement-ipfs-uploader/metadata';
const MILESTONE_LOG = './milestone.log';

function cleanupTestFiles() {
  // Remove generated files
  if (fs.existsSync(METADATA_DIR)) {
    const files = fs.readdirSync(METADATA_DIR);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(METADATA_DIR, file));
      }
    });
  }
  
  // Remove milestone log
  if (fs.existsSync(MILESTONE_LOG)) {
    fs.unlinkSync(MILESTONE_LOG);
  }
}

function testMetadataGeneration() {
  console.log('🧪 Testing Metadata Generator\n');
  
  // Clean up before test
  cleanupTestFiles();
  
  // Run the generator
  console.log('Running metadata generator...');
  try {
    execSync('node copilot/implement-ipfs-uploader/metadata-generator.js', {
      stdio: 'inherit'
    });
  } catch (error) {
    console.error('❌ Failed to run metadata generator');
    process.exit(1);
  }
  
  console.log('\n✅ Metadata generator executed successfully\n');
  
  // Verify metadata files were created
  console.log('Verifying generated files...');
  const expectedFiles = ['first-login.json', 'quest-001.json', 'tts-enabled.json'];
  let allFilesExist = true;
  
  expectedFiles.forEach(file => {
    const filePath = path.join(METADATA_DIR, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file} created`);
      
      // Verify metadata structure
      const metadata = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const requiredFields = ['name', 'description', 'image', 'fallback_image', 'attributes'];
      const hasAllFields = requiredFields.every(field => field in metadata);
      
      if (hasAllFields) {
        console.log(`     ✓ All required fields present`);
        console.log(`     ✓ Name: ${metadata.name}`);
        console.log(`     ✓ IPFS hash format: ${metadata.image.startsWith('ipfs://') ? 'Valid' : 'Invalid'}`);
        console.log(`     ✓ Attributes count: ${metadata.attributes.length}`);
      } else {
        console.log(`     ❌ Missing required fields`);
        allFilesExist = false;
      }
    } else {
      console.log(`  ❌ ${file} not found`);
      allFilesExist = false;
    }
  });
  
  // Verify milestone.log was created
  console.log('\nVerifying milestone.log...');
  if (fs.existsSync(MILESTONE_LOG)) {
    const logContent = fs.readFileSync(MILESTONE_LOG, 'utf8');
    if (logContent.includes('M2 complete') && logContent.includes('🟣')) {
      console.log('  ✅ milestone.log created with correct content');
      console.log(`     Content: ${logContent.trim()}`);
    } else {
      console.log('  ❌ milestone.log has incorrect content');
      allFilesExist = false;
    }
  } else {
    console.log('  ❌ milestone.log not found');
    allFilesExist = false;
  }
  
  // Final result
  console.log('\n' + '='.repeat(60));
  if (allFilesExist) {
    console.log('✅ All tests passed!');
    console.log('='.repeat(60));
    return 0;
  } else {
    console.log('❌ Some tests failed!');
    console.log('='.repeat(60));
    return 1;
  }
}

// Run tests
const exitCode = testMetadataGeneration();
process.exit(exitCode);

/**
 * Test script for IPFS uploader with fallback scenario
 */

const { uploadBadge, saveMetadata } = require('./index.cjs');
const path = require('path');

async function testFallbackScenario() {
  console.log('🧪 Testing Fallback Scenario\n');
  console.log('='.repeat(60));
  
  // Test with non-existent file to trigger fallback
  const nonExistentFile = path.resolve(process.cwd(), 'copilot/assets/badges/non-existent.svg');
  
  console.log('\n📝 Test Case: Upload non-existent file');
  console.log(`File: ${path.basename(nonExistentFile)}`);
  
  try {
    const result = await uploadBadge(nonExistentFile);
    
    console.log('\n📊 Result:');
    console.log(`  Success: ${result.success}`);
    console.log(`  Fallback: ${result.fallback}`);
    console.log(`  Hash: ${result.hash || 'N/A'}`);
    
    if (result.fallback) {
      console.log('  ✅ Fallback mechanism activated correctly!');
      console.log('\n📄 Fallback Metadata:');
      console.log(JSON.stringify(result.metadata, null, 2));
      
      // Save metadata for inspection
      saveMetadata(result.metadata, path.basename(nonExistentFile));
    }
  } catch (err) {
    console.error(`❌ Unexpected error: ${err.message}`);
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run test
testFallbackScenario()
  .then(() => {
    console.log('\n✅ Fallback test completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });

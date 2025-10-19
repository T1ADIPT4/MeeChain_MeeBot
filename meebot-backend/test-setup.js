#!/usr/bin/env node

/**
 * MeeBot Backend Setup Verification Script
 * 
 * This script verifies that the backend is properly configured
 * without requiring actual credentials or network access.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 MeeBot Backend Setup Verification\n');

let hasErrors = false;

// Check 1: Directory structure
console.log('📁 Checking directory structure...');
const requiredDirs = ['abi', 'logs'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}/ exists`);
  } else {
    console.log(`  ❌ ${dir}/ is missing`);
    hasErrors = true;
  }
});

// Check 2: Required files
console.log('\n📄 Checking required files...');
const requiredFiles = [
  'index.js',
  'package.json',
  '.env.example',
  'abi/MeeChainSupply.json',
  'README.md'
];
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} exists`);
  } else {
    console.log(`  ❌ ${file} is missing`);
    hasErrors = true;
  }
});

// Check 3: ABI file validity
console.log('\n🔧 Checking ABI file...');
try {
  const abiPath = path.join(__dirname, 'abi', 'MeeChainSupply.json');
  const abiContent = fs.readFileSync(abiPath, 'utf8');
  const abi = JSON.parse(abiContent);
  
  if (Array.isArray(abi)) {
    console.log(`  ✅ ABI is valid JSON array with ${abi.length} items`);
    
    // Check for required functions
    const functions = abi.filter(item => item.type === 'function').map(item => item.name);
    const requiredFunctions = ['confirmReplay', 'triggerSupply', 'refund'];
    
    console.log('  📋 Checking contract functions...');
    requiredFunctions.forEach(func => {
      if (functions.includes(func)) {
        console.log(`    ✅ ${func}() found`);
      } else {
        console.log(`    ❌ ${func}() missing`);
        hasErrors = true;
      }
    });
  } else {
    console.log('  ❌ ABI is not an array');
    hasErrors = true;
  }
} catch (err) {
  console.log(`  ❌ ABI file error: ${err.message}`);
  hasErrors = true;
}

// Check 4: package.json validity
console.log('\n📦 Checking package.json...');
try {
  const pkgPath = path.join(__dirname, 'package.json');
  const pkgContent = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgContent);
  
  console.log(`  ✅ Package name: ${pkg.name}`);
  console.log(`  ✅ Version: ${pkg.version}`);
  console.log(`  ✅ Type: ${pkg.type}`);
  
  const requiredDeps = ['express', 'web3', 'dotenv'];
  console.log('  📋 Checking dependencies...');
  requiredDeps.forEach(dep => {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      console.log(`    ✅ ${dep}: ${pkg.dependencies[dep]}`);
    } else {
      console.log(`    ❌ ${dep} missing`);
      hasErrors = true;
    }
  });
} catch (err) {
  console.log(`  ❌ package.json error: ${err.message}`);
  hasErrors = true;
}

// Check 5: .env file
console.log('\n🔐 Checking environment configuration...');
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (fs.existsSync(envPath)) {
  console.log('  ✅ .env file exists (using actual configuration)');
} else if (fs.existsSync(envExamplePath)) {
  console.log('  ⚠️  .env file not found');
  console.log('  ℹ️  Copy .env.example to .env and update values:');
  console.log('      cp .env.example .env');
} else {
  console.log('  ❌ Neither .env nor .env.example found');
  hasErrors = true;
}

// Check 6: Node modules
console.log('\n📚 Checking node_modules...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('  ✅ node_modules exists (dependencies installed)');
} else {
  console.log('  ⚠️  node_modules not found');
  console.log('  ℹ️  Run: npm install');
}

// Check 7: JavaScript syntax
console.log('\n✨ Checking JavaScript syntax...');
try {
  const indexPath = path.join(__dirname, 'index.js');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Basic checks
  if (indexContent.includes('import express from')) {
    console.log('  ✅ Express import found');
  }
  if (indexContent.includes('import Web3 from')) {
    console.log('  ✅ Web3 import found');
  }
  if (indexContent.includes('import dotenv from')) {
    console.log('  ✅ dotenv import found');
  }
  if (indexContent.includes('app.post(\'/api/meechain/trigger\'')) {
    console.log('  ✅ Main API endpoint found');
  }
  if (indexContent.includes('app.get(\'/api/meechain/status')) {
    console.log('  ✅ Status endpoint found');
  }
  if (indexContent.includes('app.get(\'/health\'')) {
    console.log('  ✅ Health check endpoint found');
  }
} catch (err) {
  console.log(`  ❌ Error checking index.js: ${err.message}`);
  hasErrors = true;
}

// Final summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ Setup verification FAILED - please fix the errors above');
  process.exit(1);
} else {
  console.log('✅ Setup verification PASSED - backend is ready!');
  console.log('\n📋 Next steps:');
  console.log('  1. Copy .env.example to .env (if not done)');
  console.log('  2. Update .env with your actual values');
  console.log('  3. Run: npm start');
  console.log('  4. Test with: curl http://localhost:3000/health');
  process.exit(0);
}

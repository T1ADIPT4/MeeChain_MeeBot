#!/usr/bin/env ts-node
/**
 * Deploy MeeChain Badge SBT Contract
 * Deploys the badge contract and registers badge catalog
 */

import { ethers } from 'hardhat';
import { BADGE_CATALOG } from '../src/config/contributor-badges.js';

async function main() {
  console.log('\n🚀 Starting MeeChain Badge SBT Deployment...\n');

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log('📝 Deploying contracts with account:', deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log('💰 Account balance:', ethers.formatEther(balance), 'ETH\n');

  // Deploy MeeChainBadgeSBT contract
  console.log('📦 Deploying MeeChainBadgeSBT contract...');
  const MeeChainBadgeSBT = await ethers.getContractFactory('MeeChainBadgeSBT');
  const badgeSBT = await MeeChainBadgeSBT.deploy();
  await badgeSBT.waitForDeployment();

  const badgeAddress = await badgeSBT.getAddress();
  console.log('✅ MeeChainBadgeSBT deployed to:', badgeAddress);

  // Register badge catalog metadata
  console.log('\n📋 Registering badge catalog...');
  
  const badgeIds = Object.keys(BADGE_CATALOG).map(Number);
  let registeredCount = 0;

  for (const badgeId of badgeIds) {
    const badge = BADGE_CATALOG[badgeId];
    try {
      // Set badge URI (metadata)
      const metadataURI = JSON.stringify({
        name: badge.name,
        description: badge.description,
        image: badge.image,
        attributes: [
          { trait_type: 'Category', value: badge.category },
          { trait_type: 'Rarity', value: badge.rarity },
          { trait_type: 'Unlock Type', value: badge.unlockCondition.type },
        ],
      });

      const tx = await badgeSBT.setBadgeURI(badgeId, metadataURI);
      await tx.wait();
      
      registeredCount++;
      console.log(`  ✓ Registered badge ${badgeId}: ${badge.name} (${badge.rarity})`);
    } catch (error) {
      console.error(`  ✗ Failed to register badge ${badgeId}:`, error);
    }
  }

  console.log(`\n✅ Registered ${registeredCount}/${badgeIds.length} badges\n`);

  // Summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 Deployment Summary');
  console.log('═══════════════════════════════════════════════════════');
  console.log('Contract Address:', badgeAddress);
  console.log('Deployer:', deployer.address);
  console.log('Network:', (await deployer.provider.getNetwork()).name);
  console.log('Badges Registered:', registeredCount);
  console.log('═══════════════════════════════════════════════════════\n');

  // Save deployment info
  console.log('💾 Saving deployment information...');
  const deploymentInfo = {
    network: (await deployer.provider.getNetwork()).name,
    chainId: (await deployer.provider.getNetwork()).chainId,
    contractAddress: badgeAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    badgesRegistered: registeredCount,
  };

  console.log('\n📝 Add to your .env file:');
  console.log(`MEECHAIN_BADGE_CONTRACT_ADDRESS=${badgeAddress}`);
  console.log(`MEECHAIN_BADGE_RPC_URL=<your_rpc_url>`);
  console.log(`MEECHAIN_BADGE_PRIVATE_KEY=<your_private_key>`);

  console.log('\n✨ Deployment complete!\n');

  return deploymentInfo;
}

// Execute deployment
main()
  .then((info) => {
    console.log('Deployment info:', info);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });

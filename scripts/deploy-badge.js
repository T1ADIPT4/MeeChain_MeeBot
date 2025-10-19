// @ts-nocheck - Hardhat runtime environment types
/**
 * Deploy MeeChainBadgeSBT contract
 * 
 * Usage:
 *   npx hardhat run scripts/deploy-badge.ts --network bscTestnet
 *   npx hardhat run scripts/deploy-badge.ts --network bscMainnet
 */

const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying MeeChainBadgeSBT contract...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "BNB\n");

  // Deploy contract
  console.log("⏳ Deploying contract...");
  const MeeChainBadgeSBT = await hre.ethers.getContractFactory("MeeChainBadgeSBT");
  const badgeContract = await MeeChainBadgeSBT.deploy();
  
  await badgeContract.waitForDeployment();
  const contractAddress = await badgeContract.getAddress();

  console.log("✅ MeeChainBadgeSBT deployed to:", contractAddress);
  console.log("\n📋 Next steps:");
  console.log("1. Update your .env file with:");
  console.log(`   MEECHAIN_BADGE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n2. Register badge types:");
  console.log(`   - Use registerBadge() function to add badge metadata`);
  console.log("\n3. Verify contract on BscScan:");
  console.log(`   npx hardhat verify --network <network> ${contractAddress}`);
  console.log("\n4. Sync ABI to backend:");
  console.log(`   cp artifacts/contracts/MeeChainBadgeSBT.sol/MeeChainBadgeSBT.json ../meebot-backend/abi/`);
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

// @ts-nocheck
/**
 * Register Badge Types Script
 * 
 * This script registers all badges from the badge catalog into the smart contract.
 * 
 * Usage:
 *   npx hardhat run scripts/register-badges.js --network bscTestnet
 *   npx hardhat run scripts/register-badges.js --network bscMainnet
 */

const hre = require("hardhat");
const { getAllBadges } = require("../src/config/badgeCatalog");

async function main() {
  console.log("🏅 Registering Badge Types...\n");

  // Get contract address from environment or command line
  const contractAddress = process.env.MEECHAIN_BADGE_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("❌ Error: MEECHAIN_BADGE_CONTRACT_ADDRESS not set in .env");
    console.log("\nPlease set the contract address:");
    console.log("  export MEECHAIN_BADGE_CONTRACT_ADDRESS=0x...");
    process.exit(1);
  }

  console.log("📝 Contract Address:", contractAddress);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);
  
  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "BNB\n");

  // Get contract instance
  const badgeContract = await hre.ethers.getContractAt("MeeChainBadgeSBT", contractAddress);

  // Get all badges from catalog
  const badges = getAllBadges();
  console.log(`📋 Found ${badges.length} badges to register\n`);

  // Register each badge
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const badge of badges) {
    try {
      // Check if badge already exists
      const existingBadge = await badgeContract.badges(badge.id);
      
      if (existingBadge.id !== 0n) {
        console.log(`⏭️  Badge ${badge.id} (${badge.name}) already registered, skipping...`);
        skipCount++;
        continue;
      }

      console.log(`⏳ Registering Badge ${badge.id}: ${badge.name}...`);
      
      const tx = await badgeContract.registerBadge(
        badge.id,
        badge.name,
        badge.description,
        badge.imageURI
      );
      
      await tx.wait();
      
      console.log(`✅ Badge ${badge.id} registered successfully`);
      console.log(`   Transaction: ${tx.hash}\n`);
      successCount++;
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Error registering badge ${badge.id}:`, error.message);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 Registration Summary");
  console.log("=".repeat(60));
  console.log(`✅ Successfully registered: ${successCount}`);
  console.log(`⏭️  Skipped (already exist): ${skipCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📋 Total badges: ${badges.length}`);
  console.log("=".repeat(60));

  if (errorCount > 0) {
    console.log("\n⚠️  Some badges failed to register. Please check the errors above.");
    process.exit(1);
  }

  console.log("\n🎉 Badge registration complete!");
  console.log("\n📋 Next steps:");
  console.log("1. Verify badges on block explorer");
  console.log("2. Test minting badges to users");
  console.log("3. Integrate with frontend badge gallery");
}

// Execute registration
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Registration failed:", error);
    process.exit(1);
  });

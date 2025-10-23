/**
 * Deployment script for MeeChainBadge contract
 * Soulbound Badge NFT for MeeChain Singapore
 */

const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying MeeChainBadge contract...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

  // Deploy MeeChainBadge
  console.log("📝 Deploying MeeChainBadge...");
  const MeeChainBadge = await hre.ethers.getContractFactory("MeeChainBadge");
  const badge = await MeeChainBadge.deploy();

  await badge.deployed();

  console.log("✅ MeeChainBadge deployed to:", badge.address);
  console.log("   Issuer:", await badge.issuer());
  console.log("   Owner:", await badge.owner());
  
  // Save deployment information
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: badge.address,
    deployer: deployer.address,
    issuer: await badge.issuer(),
    owner: await badge.owner(),
    timestamp: new Date().toISOString(),
  };

  console.log("\n📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verify contract on block explorer (if not on localhost)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await badge.deployTransaction.wait(6); // Wait for 6 confirmations

    console.log("🔍 Verifying contract on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: badge.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }

  console.log("\n🎉 Deployment complete!");
  console.log("\nNext steps:");
  console.log("1. Update BADGE_CONTRACT_ADDRESS in src/services/badgeMintingService.ts");
  console.log("2. Test badge minting with: npm run demo:badge-system");
  console.log("3. Update deploy-registry.json with new contract address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

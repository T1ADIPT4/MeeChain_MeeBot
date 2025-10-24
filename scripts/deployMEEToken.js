// Deploy script for MeeChainToken
// Usage: npx hardhat run scripts/deployMEEToken.js --network bscTestnet

async function main() {
  console.log("🚀 Deploying MeeChainToken...");

  // Get the contract factory
  const MeeChainToken = await ethers.getContractFactory("MeeChainToken");
  
  // Deploy the contract
  console.log("📝 Deploying contract...");
  const meeToken = await MeeChainToken.deploy();
  
  await meeToken.deployed();
  
  console.log("✅ MeeChainToken deployed to:", meeToken.address);
  console.log("📋 Deployment details:");
  console.log("   - Contract Address:", meeToken.address);
  console.log("   - Deployer:", await meeToken.owner());
  console.log("   - Initial Supply: 1,000,000 MEE");
  console.log("");
  console.log("🔧 Next steps:");
  console.log("   1. Update viewer/config/contracts.ts:");
  console.log(`      export const MEE_ADDRESS = "${meeToken.address}";`);
  console.log("   2. Update viewer/src/config/contracts.ts:");
  console.log(`      export const MEE_ADDRESS = "${meeToken.address}";`);
  console.log("   3. Verify contract on BscScan:");
  console.log(`      npx hardhat verify --network bscTestnet ${meeToken.address}`);
  console.log("");
  console.log("🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

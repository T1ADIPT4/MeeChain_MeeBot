// Deploy script for MeeChainSupply
// Usage: npx hardhat run scripts/deployMeeChainSupply.js --network bscTestnet

async function main() {
  console.log("🚀 Deploying MeeChainSupply...");

  // You need to provide these addresses when deploying
  const MEEBOT_ADDRESS = process.env.MEEBOT_ADDRESS || "0x0000000000000000000000000000000000000000";
  const TOKEN_ADDRESS = process.env.MEE_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000";

  if (MEEBOT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.log("⚠️  Warning: Using default MeeBot address. Set MEEBOT_ADDRESS env variable.");
  }

  if (TOKEN_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.log("⚠️  Warning: Using default token address. Set MEE_TOKEN_ADDRESS env variable.");
  }

  // Get the contract factory
  const MeeChainSupply = await ethers.getContractFactory("MeeChainSupply");
  
  // Deploy the contract
  console.log("📝 Deploying contract...");
  console.log("   - MeeBot Address:", MEEBOT_ADDRESS);
  console.log("   - Token Address:", TOKEN_ADDRESS);
  
  const meeChainSupply = await MeeChainSupply.deploy(MEEBOT_ADDRESS, TOKEN_ADDRESS);
  
  await meeChainSupply.deployed();
  
  console.log("✅ MeeChainSupply deployed to:", meeChainSupply.address);
  console.log("📋 Deployment details:");
  console.log("   - Contract Address:", meeChainSupply.address);
  console.log("   - MeeBot Address:", await meeChainSupply.meeBot());
  console.log("   - Token Address:", await meeChainSupply.token());
  console.log("");
  console.log("🔧 Next steps:");
  console.log("   1. Update viewer/config/contracts.ts:");
  console.log(`      export const MEECHAIN_SUPPLY_ADDRESS = "${meeChainSupply.address}";`);
  console.log("   2. Transfer tokens to this contract for supply operations");
  console.log("   3. Verify contract on BscScan:");
  console.log(`      npx hardhat verify --network bscTestnet ${meeChainSupply.address} "${MEEBOT_ADDRESS}" "${TOKEN_ADDRESS}"`);
  console.log("");
  console.log("🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

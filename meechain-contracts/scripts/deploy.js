
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting MeeChain contracts deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // 1. Deploy MeeToken
  console.log("\n📝 Deploying MeeToken...");
  const MeeToken = await ethers.getContractFactory("MeeToken");
  const meeToken = await MeeToken.deploy();
  await meeToken.deployed();
  console.log("✅ MeeToken deployed to:", meeToken.address);

  // 2. Deploy MembershipNFT
  console.log("\n🎖️ Deploying MembershipNFT...");
  const MembershipNFT = await ethers.getContractFactory("MembershipNFT");
  const membershipNFT = await MembershipNFT.deploy();
  await membershipNFT.deployed();
  console.log("✅ MembershipNFT deployed to:", membershipNFT.address);

  // 3. Deploy BadgeNFT
  console.log("\n🏅 Deploying MeeBadgeNFT...");
  const MeeBadgeNFT = await ethers.getContractFactory("MeeBadgeNFT");
  const badgeNFT = await MeeBadgeNFT.deploy();
  await badgeNFT.deployed();
  console.log("✅ MeeBadgeNFT deployed to:", badgeNFT.address);

  // 4. Deploy QuestManager
  console.log("\n🎯 Deploying QuestManager...");
  const QuestManager = await ethers.getContractFactory("QuestManager");
  const questManager = await QuestManager.deploy(meeToken.address, badgeNFT.address);
  await questManager.deployed();
  console.log("✅ QuestManager deployed to:", questManager.address);

  // 5. Deploy BadgeNFTUpgrade
  console.log("\n⬆️ Deploying BadgeNFTUpgrade...");
  const BadgeNFTUpgrade = await ethers.getContractFactory("BadgeNFTUpgrade");
  const badgeUpgrade = await BadgeNFTUpgrade.deploy(meeToken.address, badgeNFT.address);
  await badgeUpgrade.deployed();
  console.log("✅ BadgeNFTUpgrade deployed to:", badgeUpgrade.address);

  // 6. Set up authorizations
  console.log("\n🔐 Setting up contract authorizations...");
  
  // Authorize QuestManager to mint tokens and badges
  await meeToken.authorizeMinter(questManager.address);
  console.log("✅ QuestManager authorized to mint MeeTokens");
  
  await badgeNFT.authorizeMinter(questManager.address);
  console.log("✅ QuestManager authorized to mint BadgeNFTs");
  
  // Authorize BadgeUpgrade to burn tokens and upgrade badges
  await meeToken.authorizeMinter(badgeUpgrade.address);
  console.log("✅ BadgeUpgrade authorized to burn MeeTokens");
  
  await badgeNFT.authorizeMinter(badgeUpgrade.address);
  console.log("✅ BadgeUpgrade authorized to upgrade BadgeNFTs");

  // 7. Create initial quests
  console.log("\n🎮 Creating initial quests...");
  
  await questManager.createQuest(
    "First Steps",
    "Complete your first wallet transaction",
    ethers.utils.parseEther("10"), // 10 MEE reward
    "First Steps Badge",
    "Your first achievement in MeeChain",
    "https://api.meechain.com/nft/badges/first-steps.json"
  );
  console.log("✅ Created 'First Steps' quest");

  await questManager.createQuest(
    "Explorer",
    "Connect to Fuse Network and explore DeFi",
    ethers.utils.parseEther("25"), // 25 MEE reward
    "Explorer Badge",
    "You've explored the MeeChain ecosystem",
    "https://api.meechain.com/nft/badges/explorer.json"
  );
  console.log("✅ Created 'Explorer' quest");

  // 8. Summary
  console.log("\n🎉 MeeChain deployment completed!");
  console.log("=====================================");
  console.log("📋 Contract Addresses:");
  console.log("MeeToken:", meeToken.address);
  console.log("MembershipNFT:", membershipNFT.address);
  console.log("MeeBadgeNFT:", badgeNFT.address);
  console.log("QuestManager:", questManager.address);
  console.log("BadgeNFTUpgrade:", badgeUpgrade.address);
  console.log("=====================================");
  
  // Save addresses to file for frontend use
  const deploymentInfo = {
    network: network.name,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      MeeToken: meeToken.address,
      MembershipNFT: membershipNFT.address,
      MeeBadgeNFT: badgeNFT.address,
      QuestManager: questManager.address,
      BadgeNFTUpgrade: badgeUpgrade.address
    }
  };
  
  console.log("\n💾 Deployment info saved for frontend integration");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });


const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MeeChain Badge System", function () {
  let meeToken, badgeNFT, questManager, badgeUpgrade;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contracts
    const MeeToken = await ethers.getContractFactory("MeeToken");
    meeToken = await MeeToken.deploy();

    const MeeBadgeNFT = await ethers.getContractFactory("MeeBadgeNFT");
    badgeNFT = await MeeBadgeNFT.deploy();

    const QuestManager = await ethers.getContractFactory("QuestManager");
    questManager = await QuestManager.deploy(meeToken.address, badgeNFT.address);

    const BadgeNFTUpgrade = await ethers.getContractFactory("BadgeNFTUpgrade");
    badgeUpgrade = await BadgeNFTUpgrade.deploy(meeToken.address, badgeNFT.address);

    // Set up authorizations
    await meeToken.authorizeMinter(questManager.address);
    await badgeNFT.authorizeMinter(questManager.address);
    await meeToken.authorizeMinter(badgeUpgrade.address);
    await badgeNFT.authorizeMinter(badgeUpgrade.address);
  });

  describe("MeeToken", function () {
    it("Should have correct name and symbol", async function () {
      expect(await meeToken.name()).to.equal("MeeToken");
      expect(await meeToken.symbol()).to.equal("MEE");
    });

    it("Should allow authorized minters to mint tokens", async function () {
      await meeToken.authorizeMinter(user1.address);
      await meeToken.connect(user1).mint(user2.address, ethers.utils.parseEther("100"));
      
      expect(await meeToken.balanceOf(user2.address)).to.equal(ethers.utils.parseEther("100"));
    });

    it("Should not allow unauthorized addresses to mint", async function () {
      await expect(
        meeToken.connect(user1).mint(user2.address, ethers.utils.parseEther("100"))
      ).to.be.revertedWith("Not authorized to mint");
    });
  });

  describe("MeeBadgeNFT", function () {
    it("Should mint badge NFT with correct properties", async function () {
      await badgeNFT.authorizeMinter(owner.address);
      
      const tokenId = await badgeNFT.connect(owner).mintBadge(
        user1.address,
        "Test Badge",
        "Test Description",
        0, // PRODUCTIVITY
        0, // COMMON
        "https://test.com/badge.json",
        false,
        ""
      );

      const badge = await badgeNFT.badges(0);
      expect(badge.name).to.equal("Test Badge");
      expect(badge.description).to.equal("Test Description");
      expect(badge.badgeType).to.equal(0);
      expect(badge.rarity).to.equal(0);
      expect(await badgeNFT.ownerOf(0)).to.equal(user1.address);
    });

    it("Should track user badges correctly", async function () {
      await badgeNFT.authorizeMinter(owner.address);
      
      await badgeNFT.connect(owner).mintBadge(
        user1.address,
        "Badge 1",
        "Description 1",
        0, 0, "uri1", false, ""
      );
      
      await badgeNFT.connect(owner).mintBadge(
        user1.address,
        "Badge 2", 
        "Description 2",
        1, 1, "uri2", false, ""
      );

      const userBadges = await badgeNFT.getUserBadges(user1.address);
      expect(userBadges.length).to.equal(2);
      expect(userBadges[0]).to.equal(0);
      expect(userBadges[1]).to.equal(1);
    });
  });

  describe("QuestManager", function () {
    beforeEach(async function () {
      // Create a test quest
      await questManager.createQuest(
        "Test Quest",
        "Complete this test quest",
        ethers.utils.parseEther("50"), // 50 MEE reward
        "Test Badge",
        "Badge for completing test quest",
        "https://test.com/quest-badge.json"
      );
    });

    it("Should create quest correctly", async function () {
      const quest = await questManager.quests(0);
      expect(quest.name).to.equal("Test Quest");
      expect(quest.description).to.equal("Complete this test quest");
      expect(quest.rewardAmount).to.equal(ethers.utils.parseEther("50"));
      expect(quest.isActive).to.be.true;
    });

    it("Should complete quest and reward user", async function () {
      await questManager.connect(user1).completeQuest(0);

      // Check MEE token balance
      expect(await meeToken.balanceOf(user1.address)).to.equal(ethers.utils.parseEther("50"));

      // Check badge NFT
      const userBadges = await badgeNFT.getUserBadges(user1.address);
      expect(userBadges.length).to.equal(1);

      // Check quest completion status
      expect(await questManager.completed(user1.address, 0)).to.be.true;
    });

    it("Should not allow completing quest twice", async function () {
      await questManager.connect(user1).completeQuest(0);
      
      await expect(
        questManager.connect(user1).completeQuest(0)
      ).to.be.revertedWith("Already completed");
    });
  });

  describe("BadgeNFTUpgrade", function () {
    let tokenId;

    beforeEach(async function () {
      // Create a quest and complete it to get a badge
      await questManager.createQuest(
        "Upgrade Quest",
        "Get a badge to upgrade",
        ethers.utils.parseEther("100"),
        "Upgradeable Badge",
        "This badge can be upgraded",
        "https://test.com/upgradeable.json"
      );

      await questManager.connect(user1).completeQuest(0);
      const userBadges = await badgeNFT.getUserBadges(user1.address);
      tokenId = userBadges[0];

      // Give user1 enough MEE tokens for upgrades
      await meeToken.mint(user1.address, ethers.utils.parseEther("1000"));
    });

    it("Should upgrade badge from COMMON to RARE", async function () {
      const initialRarity = (await badgeNFT.badges(tokenId)).currentRarity;
      expect(initialRarity).to.equal(0); // COMMON

      await badgeUpgrade.connect(user1).upgradeBadge(tokenId);

      const upgradedRarity = (await badgeNFT.badges(tokenId)).currentRarity;
      expect(upgradedRarity).to.equal(1); // RARE
    });

    it("Should burn correct amount of MEE tokens for upgrade", async function () {
      const initialBalance = await meeToken.balanceOf(user1.address);
      const upgradeCost = await badgeUpgrade.getUpgradeCost(tokenId);

      await badgeUpgrade.connect(user1).upgradeBadge(tokenId);

      const finalBalance = await meeToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance.sub(upgradeCost));
    });

    it("Should not allow upgrade without sufficient MEE tokens", async function () {
      // Burn most of user1's tokens
      const balance = await meeToken.balanceOf(user1.address);
      await meeToken.burn(user1.address, balance.sub(ethers.utils.parseEther("10")));

      await expect(
        badgeUpgrade.connect(user1).upgradeBadge(tokenId)
      ).to.be.revertedWith("Insufficient MEE tokens");
    });

    it("Should not allow non-owner to upgrade badge", async function () {
      await expect(
        badgeUpgrade.connect(user2).upgradeBadge(tokenId)
      ).to.be.revertedWith("Not badge owner");
    });

    it("Should check upgrade eligibility correctly", async function () {
      const [canUpgrade, reason] = await badgeUpgrade.canUpgradeBadge(tokenId, user1.address);
      expect(canUpgrade).to.be.true;
      expect(reason).to.equal("Badge can be upgraded");
    });
  });

  describe("Integration Tests", function () {
    it("Should complete full badge upgrade flow", async function () {
      // 1. Create and complete quest
      await questManager.createQuest(
        "Full Flow Quest",
        "Complete for upgradeable badge",
        ethers.utils.parseEther("200"),
        "Full Flow Badge",
        "Badge for full flow test",
        "https://test.com/fullflow.json"
      );

      await questManager.connect(user1).completeQuest(0);
      
      // 2. Give extra MEE tokens for upgrades
      await meeToken.mint(user1.address, ethers.utils.parseEther("2000"));
      
      const userBadges = await badgeNFT.getUserBadges(user1.address);
      const tokenId = userBadges[0];

      // 3. Upgrade COMMON → RARE
      await badgeUpgrade.connect(user1).upgradeBadge(tokenId);
      expect((await badgeNFT.badges(tokenId)).currentRarity).to.equal(1);

      // 4. Upgrade RARE → EPIC
      await badgeUpgrade.connect(user1).upgradeBadge(tokenId);
      expect((await badgeNFT.badges(tokenId)).currentRarity).to.equal(2);

      // 5. Upgrade EPIC → LEGENDARY
      await badgeUpgrade.connect(user1).upgradeBadge(tokenId);
      expect((await badgeNFT.badges(tokenId)).currentRarity).to.equal(3);

      // 6. Upgrade LEGENDARY → MYTHIC
      await badgeUpgrade.connect(user1).upgradeBadge(tokenId);
      expect((await badgeNFT.badges(tokenId)).currentRarity).to.equal(4);

      // 7. Should not be able to upgrade further
      await expect(
        badgeUpgrade.connect(user1).upgradeBadge(tokenId)
      ).to.be.revertedWith("Badge already at maximum rarity");
    });
  });
});

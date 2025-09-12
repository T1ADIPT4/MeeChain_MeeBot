
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MeeToken.sol";
import "./BadgeNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BadgeNFTUpgrade is Ownable, Pausable, ReentrancyGuard {
    MeeToken public meeToken;
    MeeBadgeNFT public badgeNFT;
    
    // Upgrade costs for each rarity level (in MEE tokens)
    mapping(uint8 => uint256) public upgradeCosts;
    
    // Rarity progression mapping
    mapping(uint8 => uint8) public rarityProgression;
    
    // Events
    event BadgeUpgraded(
        address indexed user,
        uint256 indexed tokenId,
        uint8 fromRarity,
        uint8 toRarity,
        uint256 cost
    );
    event UpgradeCostUpdated(uint8 rarity, uint256 newCost);
    event RarityProgressionUpdated(uint8 fromRarity, uint8 toRarity);
    
    constructor(address _meeToken, address _badgeNFT) {
        meeToken = MeeToken(_meeToken);
        badgeNFT = MeeBadgeNFT(_badgeNFT);
        
        // Set initial upgrade costs (18 decimals for MEE token)
        upgradeCosts[0] = 100 * 10**18;  // COMMON to RARE: 100 MEE
        upgradeCosts[1] = 250 * 10**18;  // RARE to EPIC: 250 MEE
        upgradeCosts[2] = 500 * 10**18;  // EPIC to LEGENDARY: 500 MEE
        upgradeCosts[3] = 1000 * 10**18; // LEGENDARY to MYTHIC: 1000 MEE
        
        // Set rarity progression
        rarityProgression[0] = 1; // COMMON → RARE
        rarityProgression[1] = 2; // RARE → EPIC
        rarityProgression[2] = 3; // EPIC → LEGENDARY
        rarityProgression[3] = 4; // LEGENDARY → MYTHIC
    }
    
    /**
     * @dev Upgrade a badge to the next rarity level
     */
    function upgradeBadge(uint256 tokenId) external nonReentrant whenNotPaused {
        require(badgeNFT.ownerOf(tokenId) == msg.sender, "Not badge owner");
        
        // Get current badge info
        (
            ,
            ,
            ,
            ,
            ,
            ,
            uint8 currentRarity,
            ,
            ,
            ,
            ,
            ,
            ,
            bool isUpgradeable
        ) = badgeNFT.badges(tokenId);
        
        require(isUpgradeable, "Badge not upgradeable");
        require(currentRarity < 4, "Badge already at maximum rarity");
        
        uint8 nextRarity = rarityProgression[currentRarity];
        require(nextRarity > currentRarity, "Invalid rarity progression");
        
        uint256 cost = upgradeCosts[currentRarity];
        require(cost > 0, "Upgrade cost not set");
        
        // Check if user has enough MEE tokens
        require(meeToken.balanceOf(msg.sender) >= cost, "Insufficient MEE tokens");
        
        // Burn MEE tokens for upgrade
        meeToken.burn(msg.sender, cost);
        
        // Upgrade the badge
        badgeNFT.upgradeBadgeRarity(tokenId, nextRarity);
        
        emit BadgeUpgraded(msg.sender, tokenId, currentRarity, nextRarity, cost);
    }
    
    /**
     * @dev Get upgrade cost for current badge rarity
     */
    function getUpgradeCost(uint256 tokenId) external view returns (uint256) {
        (
            ,
            ,
            ,
            ,
            ,
            ,
            uint8 currentRarity,
            ,
            ,
            ,
            ,
            ,
            ,
        ) = badgeNFT.badges(tokenId);
        
        require(currentRarity < 4, "Badge already at maximum rarity");
        return upgradeCosts[currentRarity];
    }
    
    /**
     * @dev Check if a badge can be upgraded
     */
    function canUpgradeBadge(uint256 tokenId, address user) external view returns (bool, string memory) {
        if (badgeNFT.ownerOf(tokenId) != user) {
            return (false, "Not badge owner");
        }
        
        (
            ,
            ,
            ,
            ,
            ,
            ,
            uint8 currentRarity,
            ,
            ,
            ,
            ,
            ,
            ,
            bool isUpgradeable
        ) = badgeNFT.badges(tokenId);
        
        if (!isUpgradeable) {
            return (false, "Badge not upgradeable");
        }
        
        if (currentRarity >= 4) {
            return (false, "Badge already at maximum rarity");
        }
        
        uint256 cost = upgradeCosts[currentRarity];
        if (meeToken.balanceOf(user) < cost) {
            return (false, "Insufficient MEE tokens");
        }
        
        return (true, "Badge can be upgraded");
    }
    
    /**
     * @dev Get rarity name string
     */
    function getRarityName(uint8 rarity) external pure returns (string memory) {
        if (rarity == 0) return "COMMON";
        if (rarity == 1) return "RARE";
        if (rarity == 2) return "EPIC";
        if (rarity == 3) return "LEGENDARY";
        if (rarity == 4) return "MYTHIC";
        return "UNKNOWN";
    }
    
    /**
     * @dev Set upgrade cost for a specific rarity level
     */
    function setUpgradeCost(uint8 rarity, uint256 cost) external onlyOwner {
        require(rarity < 4, "Invalid rarity level");
        upgradeCosts[rarity] = cost;
        emit UpgradeCostUpdated(rarity, cost);
    }
    
    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}

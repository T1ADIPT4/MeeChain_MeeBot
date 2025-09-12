
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MeeBadgeNFT is ERC721URIStorage, Ownable, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Badge categories
    enum BadgeType { PRODUCTIVITY, EXPLORER, SOCIALIZER, ACHIEVER, SPECIAL }
    
    // Badge rarity
    enum Rarity { COMMON, RARE, EPIC, LEGENDARY, MYTHIC }
    
    struct Badge {
        uint256 tokenId;
        string name;
        string description;
        BadgeType badgeType;
        Rarity rarity;
        uint256 mintedAt;
        uint8 currentRarity;
        address originalMinter;
        bool isQuestReward;
        string questId;
        uint256 level;
        uint256 experience;
        uint256 powerScore;
        bool isUpgradeable;
    }
    
    // Mappings
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    mapping(address => mapping(string => bool)) public userHasBadge;
    mapping(address => bool) public authorizedMinters;
    
    // Events
    event BadgeMinted(
        address indexed to,
        uint256 indexed tokenId,
        string name,
        BadgeType badgeType,
        Rarity rarity
    );
    event BadgeUpgraded(
        uint256 indexed tokenId,
        uint8 fromRarity,
        uint8 toRarity
    );
    
    constructor() ERC721("MeeChain Badge NFT", "MEEBADGE") {}
    
    /**
     * @dev Authorize minter
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    /**
     * @dev Mint badge NFT
     */
    function mintBadge(
        address to,
        string memory name,
        string memory description,
        BadgeType badgeType,
        Rarity rarity,
        string memory tokenURI,
        bool isQuestReward,
        string memory questId
    ) external returns (uint256) {
        require(
            authorizedMinters[msg.sender] || msg.sender == owner(),
            "Not authorized to mint"
        );
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        badges[tokenId] = Badge({
            tokenId: tokenId,
            name: name,
            description: description,
            badgeType: badgeType,
            rarity: rarity,
            mintedAt: block.timestamp,
            currentRarity: uint8(rarity),
            originalMinter: to,
            isQuestReward: isQuestReward,
            questId: questId,
            level: 1,
            experience: 0,
            powerScore: 100,
            isUpgradeable: true
        });
        
        userBadges[to].push(tokenId);
        userHasBadge[to][name] = true;
        
        emit BadgeMinted(to, tokenId, name, badgeType, rarity);
        
        return tokenId;
    }
    
    /**
     * @dev Upgrade badge rarity (called by BadgeNFTUpgrade contract)
     */
    function upgradeBadgeRarity(uint256 tokenId, uint8 newRarity) external {
        require(authorizedMinters[msg.sender], "Not authorized to upgrade");
        require(_exists(tokenId), "Badge does not exist");
        
        Badge storage badge = badges[tokenId];
        uint8 oldRarity = badge.currentRarity;
        badge.currentRarity = newRarity;
        badge.powerScore += 50 * newRarity; // Increase power score
        
        emit BadgeUpgraded(tokenId, oldRarity, newRarity);
    }
    
    /**
     * @dev Get user's badges
     */
    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }
    
    /**
     * @dev Get badge rarity name
     */
    function badgeRarity(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "Badge does not exist");
        uint8 rarity = badges[tokenId].currentRarity;
        
        if (rarity == 0) return "COMMON";
        if (rarity == 1) return "RARE";
        if (rarity == 2) return "EPIC";
        if (rarity == 3) return "LEGENDARY";
        if (rarity == 4) return "MYTHIC";
        return "UNKNOWN";
    }
    
    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}

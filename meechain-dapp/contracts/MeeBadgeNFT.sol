
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MeeBadgeNFT is ERC721URIStorage, Ownable, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Badge rarity levels
    enum Rarity { COMMON, RARE, EPIC, LEGENDARY, MYTHIC }
    
    // Badge categories
    enum Category { PRODUCTIVITY, EXPLORER, SOCIALIZER, ACHIEVER, SPECIAL }
    
    struct Badge {
        uint256 tokenId;
        string name;
        string description;
        string power; // Special power like "Focus Boost", "Time Warp"
        uint256 level;
        uint256 maxLevel;
        Rarity rarity;
        Category category;
        uint256 mintedAt;
        address originalOwner;
        bool isQuestReward;
        string questId;
        uint256 powerBoost; // Percentage boost (e.g., 10 = 10% boost)
        bool isUpgradeable;
    }
    
    struct QuestSet {
        string setId;
        string title;
        string description;
        string[] requiredBadges;
        Badge rewardBadge;
        uint256 completions;
        bool isActive;
        string meeBotQuote;
        uint256 xpReward;
        uint256 tokenReward;
    }
    
    // Mappings
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    mapping(address => mapping(string => bool)) public userHasBadge;
    mapping(string => QuestSet) public questSets;
    mapping(address => mapping(string => bool)) public questSetCompleted;
    mapping(address => uint256) public userXP;
    mapping(address => uint256) public userLevel;
    mapping(string => address[]) public questSetCompletors;
    
    // Quest tracking
    string[] public activeQuestSets;
    mapping(address => bool) public authorizedMinters;
    
    // Events
    event BadgeMinted(
        address indexed to,
        uint256 indexed tokenId,
        string name,
        string power,
        uint256 level,
        Rarity rarity
    );
    event BadgeUpgraded(
        uint256 indexed tokenId,
        uint256 newLevel,
        string enhancedPower
    );
    event QuestSetCompleted(
        address indexed user,
        string setId,
        uint256 rewardTokenId,
        string meeBotQuote
    );
    event QuestSetCreated(string setId, string title);
    event PowerActivated(
        address indexed user,
        uint256 tokenId,
        string power,
        uint256 boostValue
    );
    
    constructor() ERC721("MeeChain Badge NFT", "MEEBADGE") {}
    
    /**
     * @dev Authorize minter
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    /**
     * @dev Create new quest set for collection
     */
    function createQuestSet(
        string memory setId,
        string memory title,
        string memory description,
        string[] memory requiredBadges,
        string memory rewardName,
        string memory rewardDescription,
        string memory rewardPower,
        uint256 rewardPowerBoost,
        Rarity rewardRarity,
        Category rewardCategory,
        string memory rewardTokenURI,
        string memory meeBotQuote,
        uint256 xpReward,
        uint256 tokenReward
    ) external onlyOwner {
        Badge memory rewardBadge = Badge({
            tokenId: 0, // Will be set when minted
            name: rewardName,
            description: rewardDescription,
            power: rewardPower,
            level: 1,
            maxLevel: 5,
            rarity: rewardRarity,
            category: rewardCategory,
            mintedAt: 0,
            originalOwner: address(0),
            isQuestReward: true,
            questId: setId,
            powerBoost: rewardPowerBoost,
            isUpgradeable: true
        });
        
        questSets[setId] = QuestSet({
            setId: setId,
            title: title,
            description: description,
            requiredBadges: requiredBadges,
            rewardBadge: rewardBadge,
            completions: 0,
            isActive: true,
            meeBotQuote: meeBotQuote,
            xpReward: xpReward,
            tokenReward: tokenReward
        });
        
        activeQuestSets.push(setId);
        emit QuestSetCreated(setId, title);
    }
    
    /**
     * @dev Mint badge NFT with power system
     */
    function mintBadge(
        address to,
        string memory name,
        string memory description,
        string memory power,
        uint256 powerBoost,
        Rarity rarity,
        Category category,
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
            power: power,
            level: 1,
            maxLevel: getRarityMaxLevel(rarity),
            rarity: rarity,
            category: category,
            mintedAt: block.timestamp,
            originalOwner: to,
            isQuestReward: isQuestReward,
            questId: questId,
            powerBoost: powerBoost,
            isUpgradeable: true
        });
        
        userBadges[to].push(tokenId);
        userHasBadge[to][name] = true;
        
        // Award XP for earning badge
        userXP[to] += getRarityXPReward(rarity);
        _updateUserLevel(to);
        
        emit BadgeMinted(to, tokenId, name, power, 1, rarity);
        
        // Check quest set completion
        if (!isQuestReward) {
            _checkAndCompleteQuestSets(to);
        }
        
        return tokenId;
    }
    
    /**
     * @dev Upgrade badge level and enhance power
     */
    function upgradeBadge(uint256 tokenId) external {
        require(_exists(tokenId), "Badge does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not badge owner");
        
        Badge storage badge = badges[tokenId];
        require(badge.isUpgradeable, "Badge not upgradeable");
        require(badge.level < badge.maxLevel, "Badge at max level");
        
        // Upgrade requirements (could be XP, tokens, or quest completion)
        uint256 requiredXP = badge.level * 100;
        require(userXP[msg.sender] >= requiredXP, "Insufficient XP");
        
        badge.level += 1;
        badge.powerBoost += 5; // Increase power boost by 5% per level
        
        // Deduct XP
        userXP[msg.sender] -= requiredXP;
        
        string memory enhancedPower = string(abi.encodePacked(badge.power, " L", _toString(badge.level)));
        
        emit BadgeUpgraded(tokenId, badge.level, enhancedPower);
    }
    
    /**
     * @dev Activate badge power (for quest system integration)
     */
    function activatePower(uint256 tokenId) external {
        require(_exists(tokenId), "Badge does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not badge owner");
        
        Badge memory badge = badges[tokenId];
        emit PowerActivated(msg.sender, tokenId, badge.power, badge.powerBoost);
    }
    
    /**
     * @dev Upgrade badge rarity (only authorized upgrader)
     */
    function upgradeBadgeRarity(uint256 tokenId, uint8 newRarity) external {
        require(
            authorizedMinters[msg.sender] || msg.sender == owner(),
            "Not authorized to upgrade"
        );
        require(_exists(tokenId), "Badge does not exist");
        require(newRarity <= 4, "Invalid rarity level");
        
        Badge storage badge = badges[tokenId];
        require(badge.isUpgradeable, "Badge not upgradeable");
        require(newRarity > uint8(badge.rarity), "New rarity must be higher");
        
        uint8 oldRarity = uint8(badge.rarity);
        badge.rarity = Rarity(newRarity);
        
        // Increase power boost based on new rarity
        badge.powerBoost += (newRarity - oldRarity) * 10; // +10% per rarity level
        
        // Update max level based on new rarity
        badge.maxLevel = getRarityMaxLevel(badge.rarity);
        
        emit BadgeUpgraded(tokenId, badge.level, badge.power);
    }
    
    /**
     * @dev Check and complete quest sets
     */
    function _checkAndCompleteQuestSets(address user) internal {
        for (uint i = 0; i < activeQuestSets.length; i++) {
            string memory setId = activeQuestSets[i];
            QuestSet storage questSet = questSets[setId];
            
            if (!questSet.isActive || questSetCompleted[user][setId]) {
                continue;
            }
            
            // Check if user has all required badges
            bool hasAllBadges = true;
            for (uint j = 0; j < questSet.requiredBadges.length; j++) {
                if (!userHasBadge[user][questSet.requiredBadges[j]]) {
                    hasAllBadges = false;
                    break;
                }
            }
            
            if (hasAllBadges) {
                // Complete quest set and mint reward
                questSetCompleted[user][setId] = true;
                questSet.completions++;
                questSetCompletors[setId].push(user);
                
                // Mint quest set reward badge
                uint256 rewardTokenId = _tokenIdCounter.current();
                _tokenIdCounter.increment();
                
                _safeMint(user, rewardTokenId);
                _setTokenURI(rewardTokenId, ""); // Set appropriate URI
                
                Badge memory rewardBadge = questSet.rewardBadge;
                rewardBadge.tokenId = rewardTokenId;
                rewardBadge.mintedAt = block.timestamp;
                rewardBadge.originalOwner = user;
                
                badges[rewardTokenId] = rewardBadge;
                userBadges[user].push(rewardTokenId);
                userHasBadge[user][rewardBadge.name] = true;
                
                // Award quest set rewards
                userXP[user] += questSet.xpReward;
                _updateUserLevel(user);
                
                emit QuestSetCompleted(user, setId, rewardTokenId, questSet.meeBotQuote);
            }
        }
    }
    
    /**
     * @dev Update user level based on XP
     */
    function _updateUserLevel(address user) internal {
        uint256 currentLevel = userLevel[user];
        uint256 newLevel = userXP[user] / 1000; // 1000 XP per level
        
        if (newLevel > currentLevel) {
            userLevel[user] = newLevel;
        }
    }
    
    /**
     * @dev Get max level based on rarity
     */
    function getRarityMaxLevel(Rarity rarity) public pure returns (uint256) {
        if (rarity == Rarity.COMMON) return 3;
        if (rarity == Rarity.RARE) return 5;
        if (rarity == Rarity.EPIC) return 7;
        if (rarity == Rarity.LEGENDARY) return 10;
        if (rarity == Rarity.MYTHIC) return 15;
        return 3;
    }
    
    /**
     * @dev Get XP reward based on rarity
     */
    function getRarityXPReward(Rarity rarity) public pure returns (uint256) {
        if (rarity == Rarity.COMMON) return 50;
        if (rarity == Rarity.RARE) return 100;
        if (rarity == Rarity.EPIC) return 200;
        if (rarity == Rarity.LEGENDARY) return 500;
        if (rarity == Rarity.MYTHIC) return 1000;
        return 50;
    }
    
    /**
     * @dev Get user's badges with power info
     */
    function getUserBadgesWithPowers(address user) external view returns (Badge[] memory) {
        uint256[] memory tokenIds = userBadges[user];
        Badge[] memory userBadgeList = new Badge[](tokenIds.length);
        
        for (uint i = 0; i < tokenIds.length; i++) {
            userBadgeList[i] = badges[tokenIds[i]];
        }
        
        return userBadgeList;
    }
    
    /**
     * @dev Get quest set progress for user
     */
    function getQuestSetProgress(address user, string memory setId) 
        external view returns (
            uint256 completed, 
            uint256 total, 
            bool isCompleted,
            string memory meeBotQuote
        ) 
    {
        QuestSet memory questSet = questSets[setId];
        total = questSet.requiredBadges.length;
        completed = 0;
        
        for (uint i = 0; i < questSet.requiredBadges.length; i++) {
            if (userHasBadge[user][questSet.requiredBadges[i]]) {
                completed++;
            }
        }
        
        isCompleted = questSetCompleted[user][setId];
        meeBotQuote = questSet.meeBotQuote;
    }
    
    /**
     * @dev Get all active quest sets
     */
    function getActiveQuestSets() external view returns (string[] memory) {
        return activeQuestSets;
    }
    
    /**
     * @dev Convert uint to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
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

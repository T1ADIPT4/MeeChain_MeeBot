
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
        address originalMinter;
        bool isQuestReward;
        string questId;
    }
    
    struct Quest {
        string questId;
        string title;
        string description;
        string[] requiredBadges;
        string rewardBadgeName;
        BadgeType rewardType;
        Rarity rewardRarity;
        string rewardTokenURI;
        bool isActive;
        uint256 completions;
    }
    
    // Mappings
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    mapping(address => mapping(string => bool)) public userHasBadge;
    mapping(string => Quest) public quests;
    mapping(address => mapping(string => bool)) public questCompleted;
    mapping(address => bool) public authorizedMinters;
    
    // Quest tracking
    string[] public activeQuests;
    mapping(string => address[]) public questCompletors;
    
    // Events
    event BadgeMinted(
        address indexed to,
        uint256 indexed tokenId,
        string name,
        BadgeType badgeType,
        Rarity rarity
    );
    event QuestCompleted(
        address indexed user,
        string questId,
        uint256 rewardTokenId
    );
    event QuestCreated(string questId, string title);
    
    constructor() ERC721("MeeChain Badge NFT", "MEEBADGE") {}
    
    /**
     * @dev Authorize minter
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    /**
     * @dev Create new quest
     */
    function createQuest(
        string memory questId,
        string memory title,
        string memory description,
        string[] memory requiredBadges,
        string memory rewardBadgeName,
        BadgeType rewardType,
        Rarity rewardRarity,
        string memory rewardTokenURI
    ) external onlyOwner {
        quests[questId] = Quest({
            questId: questId,
            title: title,
            description: description,
            requiredBadges: requiredBadges,
            rewardBadgeName: rewardBadgeName,
            rewardType: rewardType,
            rewardRarity: rewardRarity,
            rewardTokenURI: rewardTokenURI,
            isActive: true,
            completions: 0
        });
        
        activeQuests.push(questId);
        emit QuestCreated(questId, title);
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
            originalMinter: to,
            isQuestReward: isQuestReward,
            questId: questId
        });
        
        userBadges[to].push(tokenId);
        userHasBadge[to][name] = true;
        
        emit BadgeMinted(to, tokenId, name, badgeType, rarity);
        
        // Check quest completion
        if (!isQuestReward) {
            _checkAndCompleteQuests(to);
        }
        
        return tokenId;
    }
    
    /**
     * @dev Check and complete quests for user
     */
    function _checkAndCompleteQuests(address user) internal {
        for (uint i = 0; i < activeQuests.length; i++) {
            string memory questId = activeQuests[i];
            Quest storage quest = quests[questId];
            
            if (!quest.isActive || questCompleted[user][questId]) {
                continue;
            }
            
            // Check if user has all required badges
            bool hasAllBadges = true;
            for (uint j = 0; j < quest.requiredBadges.length; j++) {
                if (!userHasBadge[user][quest.requiredBadges[j]]) {
                    hasAllBadges = false;
                    break;
                }
            }
            
            if (hasAllBadges) {
                // Complete quest and mint reward
                questCompleted[user][questId] = true;
                quest.completions++;
                questCompletors[questId].push(user);
                
                // Mint quest reward badge
                uint256 rewardTokenId = _tokenIdCounter.current();
                _tokenIdCounter.increment();
                
                _safeMint(user, rewardTokenId);
                _setTokenURI(rewardTokenId, quest.rewardTokenURI);
                
                badges[rewardTokenId] = Badge({
                    tokenId: rewardTokenId,
                    name: quest.rewardBadgeName,
                    description: quest.description,
                    badgeType: quest.rewardType,
                    rarity: quest.rewardRarity,
                    mintedAt: block.timestamp,
                    originalMinter: user,
                    isQuestReward: true,
                    questId: questId
                });
                
                userBadges[user].push(rewardTokenId);
                userHasBadge[user][quest.rewardBadgeName] = true;
                
                emit QuestCompleted(user, questId, rewardTokenId);
            }
        }
    }
    
    /**
     * @dev Get user's badges
     */
    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }
    
    /**
     * @dev Get quest progress for user
     */
    function getQuestProgress(address user, string memory questId) 
        external view returns (uint256 completed, uint256 total, bool isCompleted) 
    {
        Quest storage quest = quests[questId];
        total = quest.requiredBadges.length;
        completed = 0;
        
        for (uint i = 0; i < quest.requiredBadges.length; i++) {
            if (userHasBadge[user][quest.requiredBadges[i]]) {
                completed++;
            }
        }
        
        isCompleted = questCompleted[user][questId];
    }
    
    /**
     * @dev Get all active quests
     */
    function getActiveQuests() external view returns (string[] memory) {
        return activeQuests;
    }
    
    /**
     * @dev Check if user can mint specific badge
     */
    function canMintBadge(address user, string memory badgeName) external view returns (bool) {
        return !userHasBadge[user][badgeName];
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

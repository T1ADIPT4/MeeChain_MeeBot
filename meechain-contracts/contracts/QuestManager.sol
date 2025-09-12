
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MeeToken.sol";
import "./BadgeNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract QuestManager is Ownable {
    struct Quest {
        string name;
        string description;
        uint256 rewardAmount;
        string badgeName;
        string badgeDescription;
        string badgeTokenURI;
        bool isActive;
        uint256 completions;
    }

    mapping(uint256 => Quest) public quests;
    mapping(address => mapping(uint256 => bool)) public completed;
    uint256 public questCounter;

    MeeToken public meeToken;
    MeeBadgeNFT public badgeNFT;
    
    event QuestCreated(uint256 indexed questId, string name);
    event QuestCompleted(address indexed user, uint256 indexed questId, uint256 rewardAmount);

    constructor(address _meeToken, address _badgeNFT) {
        meeToken = MeeToken(_meeToken);
        badgeNFT = MeeBadgeNFT(_badgeNFT);
        questCounter = 0;
    }

    /**
     * @dev Create a new quest (only owner)
     */
    function createQuest(
        string memory name,
        string memory description,
        uint256 rewardAmount,
        string memory badgeName,
        string memory badgeDescription,
        string memory badgeTokenURI
    ) external onlyOwner returns (uint256) {
        uint256 questId = questCounter;
        questCounter++;
        
        quests[questId] = Quest({
            name: name,
            description: description,
            rewardAmount: rewardAmount,
            badgeName: badgeName,
            badgeDescription: badgeDescription,
            badgeTokenURI: badgeTokenURI,
            isActive: true,
            completions: 0
        });
        
        emit QuestCreated(questId, name);
        return questId;
    }
    
    /**
     * @dev Complete a quest - mint tokens and badge
     */
    function completeQuest(uint256 questId) public {
        require(quests[questId].isActive, "Quest inactive");
        require(!completed[msg.sender][questId], "Already completed");

        // Check authorization before attempting to mint
        require(meeToken.isMinter(address(this)), "QuestManager not authorized to mint MeeTokens");
        require(badgeNFT.authorizedMinters(address(this)), "QuestManager not authorized to mint BadgeNFTs");

        Quest storage quest = quests[questId];
        completed[msg.sender][questId] = true;
        quest.completions++;
        
        // Mint MeeToken reward
        meeToken.mint(msg.sender, quest.rewardAmount);
        
        // Mint Badge NFT
        badgeNFT.mintBadge(
            msg.sender,
            quest.badgeName,
            quest.badgeDescription,
            MeeBadgeNFT.BadgeType.ACHIEVER,
            MeeBadgeNFT.Rarity.COMMON,
            quest.badgeTokenURI,
            true,
            uintToString(questId)
        );
        
        emit QuestCompleted(msg.sender, questId, quest.rewardAmount);
    }
    
    /**
     * @dev Check if this contract is properly authorized
     */
    function checkAuthorization() external view returns (bool isAuthorized, bool tokenAuthorized, bool badgeAuthorized) {
        tokenAuthorized = meeToken.isMinter(address(this));
        badgeAuthorized = badgeNFT.authorizedMinters(address(this));
        isAuthorized = tokenAuthorized && badgeAuthorized;
        return (isAuthorized, tokenAuthorized, badgeAuthorized);
    }

    /**
     * @dev Get contract addresses for external authorization setup
     */
    function getContractAddresses() external view returns (address meeTokenAddress, address badgeNFTAddress, address questManagerAddress) {
        return (address(meeToken), address(badgeNFT), address(this));
    }
    
    /**
     * @dev Convert uint256 to string
     */
    function uintToString(uint256 value) internal pure returns (string memory) {
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
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MeeToken.sol";
import "./BadgeNFT.sol";
import "./FootballNFT.sol"; // Import FootballNFT contract
import "@openzeppelin/contracts/access/Ownable.sol";

contract QuestManager is Ownable {
    struct Quest {
        string name;
        string description;
        uint256 rewardAmount;
        string rewardType; // "badge", "player", etc.
        string badgeName;
        string badgeDescription;
        string badgeTokenURI;
        // Fields for player NFT rewards
        string playerName;
        string playerPosition;
        uint256 playerRating;
        string playerNationality;
        bool isLegendary;
        bool isActive;
        uint256 completions;
    }

    mapping(uint256 => Quest) public quests;
    mapping(address => mapping(uint256 => bool)) public completed;
    uint256 public questCounter;

    MeeToken public meeToken;
    BadgeNFT public badgeNFT;
    FootballNFT public footballNFT; // Add FootballNFT contract instance

    event QuestCreated(uint256 indexed questId, string name, string rewardType);
    event QuestCompleted(address indexed user, uint256 indexed questId, uint256 rewardAmount);

    constructor(address _meeToken, address _badgeNFT, address _footballNFT) {
        meeToken = MeeToken(_meeToken);
        badgeNFT = BadgeNFT(_badgeNFT);
        footballNFT = FootballNFT(_footballNFT); // Initialize FootballNFT
        questCounter = 0;
    }

    /**
     * @dev Create a new quest (only owner)
     */
    function createQuest(
        string memory name,
        string memory description,
        uint256 rewardAmount,
        string memory rewardType, // Specify reward type
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
            rewardType: rewardType,
            badgeName: badgeName,
            badgeDescription: badgeDescription,
            badgeTokenURI: badgeTokenURI,
            playerName: "", // Default empty for non-player rewards
            playerPosition: "",
            playerRating: 0,
            playerNationality: "",
            isLegendary: false,
            isActive: true,
            completions: 0
        });

        emit QuestCreated(questId, name, rewardType);
        return questId;
    }

    /**
     * @dev Create a new quest with player reward details (only owner)
     */
    function createQuestWithPlayerReward(
        string memory name,
        string memory description,
        uint256 rewardAmount,
        string memory playerName,
        string memory playerPosition,
        uint256 playerRating,
        string memory playerNationality,
        bool isLegendary,
        string memory playerTokenURI // This will be the tokenURI for the player NFT
    ) external onlyOwner returns (uint256) {
        uint256 questId = questCounter;
        questCounter++;

        quests[questId] = Quest({
            name: name,
            description: description,
            rewardAmount: rewardAmount,
            rewardType: "player", // Set reward type to player
            badgeName: "", // Not used for player rewards
            badgeDescription: "",
            badgeTokenURI: playerTokenURI, // Store player NFT URI here
            playerName: playerName,
            playerPosition: playerPosition,
            playerRating: playerRating,
            playerNationality: playerNationality,
            isLegendary: isLegendary,
            isActive: true,
            completions: 0
        });

        emit QuestCreated(questId, name, "player");
        return questId;
    }


    /**
     * @dev Complete a quest - mint tokens and reward
     */
    function completeQuest(uint256 questId) public {
        require(quests[questId].isActive, "Quest inactive");
        require(!completed[msg.sender][questId], "Already completed");

        // Check authorization before attempting to mint
        require(meeToken.isMinter(address(this)), "QuestManager not authorized to mint MeeTokens");

        Quest storage quest = quests[questId];
        completed[msg.sender][questId] = true;
        quest.completions++;

        // Mint MeeToken reward
        meeToken.mint(msg.sender, quest.rewardAmount);

        // Handle different reward types
        if (keccak256(bytes(quest.rewardType)) == keccak256(bytes("player"))) {
            // Mint Football Player NFT
            require(address(footballNFT) != address(0), "FootballNFT not set");
            footballNFT.mintPlayer(
                msg.sender,
                quest.playerName,
                quest.playerPosition,
                quest.playerRating,
                quest.playerNationality,
                quest.isLegendary,
                quest.badgeTokenURI // Using badgeTokenURI to store player NFT URI
            );
        } else if (keccak256(bytes(quest.rewardType)) == keccak256(bytes("badge"))) {
            // Default: Mint Badge NFT
            require(badgeNFT.authorizedMinters(address(this)), "QuestManager not authorized to mint BadgeNFTs");
            badgeNFT.mintBadge(
                msg.sender,
                quest.badgeName,
                quest.badgeDescription,
                MeeBadgeNFT.BadgeType.ACHIEVER, // Assuming ACHIEVER for quest badges
                MeeBadgeNFT.Rarity.COMMON,    // Assuming COMMON rarity
                quest.badgeTokenURI,
                true,                         // isQuestReward
                uintToString(questId)         // questId as string
            );
        }
        // Add other reward types as needed

        emit QuestCompleted(msg.sender, questId, quest.rewardAmount);
    }

    /**
     * @dev Check if this contract is properly authorized to mint tokens and badges
     * @return isAuthorized True if all necessary minting are authorized
     * @return tokenAuthorized True if this contract can mint MeeTokens
     * @return badgeAuthorized True if this contract can mint BadgeNFTs
     * @return footballNFTAuthorized True if this contract can mint Football NFTs
     */
    function checkAuthorization() external view returns (bool isAuthorized, bool tokenAuthorized, bool badgeAuthorized, bool footballNFTAuthorized) {
        tokenAuthorized = meeToken.isMinter(address(this));
        badgeAuthorized = badgeNFT.authorizedMinters(address(this));
        footballNFTAuthorized = footballNFT.isAuthorizedMinter(address(this)); // Check authorization for FootballNFT
        isAuthorized = tokenAuthorized && badgeAuthorized && footballNFTAuthorized;
        return (isAuthorized, tokenAuthorized, badgeAuthorized, footballNFTAuthorized);
    }

    /**
     * @dev Get contract addresses for external authorization setup
     */
    function getContractAddresses() external view returns (address meeTokenAddress, address badgeNFTAddress, address footballNFTAddress, address questManagerAddress) {
        return (address(meeToken), address(badgeNFT), address(footballNFT), address(this));
    }

    /**
     * @dev Deactivate a quest
     */
    function deactivateQuest(uint256 questId) external onlyOwner {
        require(quests[questId].isActive, "Quest already inactive");
        quests[questId].isActive = false;
    }

    /**
     * @dev Get quest details
     */
    function getQuest(uint256 questId) external view returns (Quest memory) {
        return quests[questId];
    }

    /**
     * @dev Check if user has completed quest
     */
    function hasCompletedQuest(address user, uint256 questId) external view returns (bool) {
        return completed[user][questId];
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
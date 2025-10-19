// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MeeChainBadgeSBT
 * @dev Soulbound Token (SBT) for MeeChain badges - non-transferable achievement NFTs
 */
contract MeeChainBadgeSBT is ERC721, Ownable {
    // Badge metadata
    struct Badge {
        uint256 id;
        string name;
        string description;
        string imageURI;
        uint256 timestamp;
    }

    // Token ID counter
    uint256 private _tokenIdCounter;

    // Mapping from token ID to badge ID
    mapping(uint256 => uint256) public tokenBadgeId;

    // Mapping from user address to array of token IDs they own
    mapping(address => uint256[]) private _userTokens;

    // Mapping from badge ID to metadata
    mapping(uint256 => Badge) public badges;

    // Events
    event BadgeMinted(address indexed to, uint256 indexed tokenId, uint256 indexed badgeId);
    event BadgeMetadataUpdated(uint256 indexed badgeId);

    constructor() ERC721("MeeChain Badge", "MEEBADGE") Ownable(msg.sender) {
        _tokenIdCounter = 1;
    }

    /**
     * @dev Mint a badge to a user
     * @param to Address to mint badge to
     * @param badgeId ID of the badge type
     */
    function mintBadge(address to, uint256 badgeId) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(badges[badgeId].id != 0, "Badge type does not exist");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        tokenBadgeId[tokenId] = badgeId;
        _userTokens[to].push(tokenId);

        emit BadgeMinted(to, tokenId, badgeId);
    }

    /**
     * @dev Batch mint badges to multiple users
     * @param recipients Array of addresses to mint badges to
     * @param badgeIds Array of badge IDs corresponding to each recipient
     */
    function batchMintBadges(address[] calldata recipients, uint256[] calldata badgeIds) external onlyOwner {
        require(recipients.length == badgeIds.length, "Array length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Cannot mint to zero address");
            require(badges[badgeIds[i]].id != 0, "Badge type does not exist");
            
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;

            _safeMint(recipients[i], tokenId);
            tokenBadgeId[tokenId] = badgeIds[i];
            _userTokens[recipients[i]].push(tokenId);

            emit BadgeMinted(recipients[i], tokenId, badgeIds[i]);
        }
    }

    /**
     * @dev Register a new badge type
     * @param badgeId Unique badge ID
     * @param name Badge name
     * @param description Badge description
     * @param imageURI IPFS URI or URL for badge image
     */
    function registerBadge(
        uint256 badgeId,
        string memory name,
        string memory description,
        string memory imageURI
    ) external onlyOwner {
        require(badges[badgeId].id == 0, "Badge already exists");
        
        badges[badgeId] = Badge({
            id: badgeId,
            name: name,
            description: description,
            imageURI: imageURI,
            timestamp: block.timestamp
        });

        emit BadgeMetadataUpdated(badgeId);
    }

    /**
     * @dev Update existing badge metadata
     * @param badgeId Badge ID to update
     * @param name New badge name
     * @param description New badge description
     * @param imageURI New badge image URI
     */
    function updateBadgeMetadata(
        uint256 badgeId,
        string memory name,
        string memory description,
        string memory imageURI
    ) external onlyOwner {
        require(badges[badgeId].id != 0, "Badge does not exist");
        
        badges[badgeId].name = name;
        badges[badgeId].description = description;
        badges[badgeId].imageURI = imageURI;

        emit BadgeMetadataUpdated(badgeId);
    }

    /**
     * @dev Get all badge IDs owned by an address
     * @param owner Address to query
     * @return Array of badge IDs
     */
    function getBadgesOf(address owner) external view returns (uint256[] memory) {
        uint256[] memory tokenIds = _userTokens[owner];
        uint256[] memory badgeIds = new uint256[](tokenIds.length);
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            badgeIds[i] = tokenBadgeId[tokenIds[i]];
        }
        
        return badgeIds;
    }

    /**
     * @dev Get all token IDs owned by an address
     * @param owner Address to query
     * @return Array of token IDs
     */
    function getTokensOf(address owner) external view returns (uint256[] memory) {
        return _userTokens[owner];
    }

    /**
     * @dev Check if user has a specific badge
     * @param owner Address to check
     * @param badgeId Badge ID to check for
     * @return bool True if user has the badge
     */
    function hasBadge(address owner, uint256 badgeId) external view returns (bool) {
        uint256[] memory tokenIds = _userTokens[owner];
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenBadgeId[tokenIds[i]] == badgeId) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * @dev Get badge metadata
     * @param badgeId Badge ID
     * @return Badge struct
     */
    function getBadgeMetadata(uint256 badgeId) external view returns (Badge memory) {
        require(badges[badgeId].id != 0, "Badge does not exist");
        return badges[badgeId];
    }

    /**
     * @dev Override transfer functions to make tokens soulbound (non-transferable)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        // Reject all other transfers
        if (from != address(0) && to != address(0)) {
            revert("SBT: Tokens are soulbound and cannot be transferred");
        }
        
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Override approve to prevent approvals
     */
    function approve(address, uint256) public virtual override {
        revert("SBT: Approvals are not allowed for soulbound tokens");
    }

    /**
     * @dev Override setApprovalForAll to prevent approvals
     */
    function setApprovalForAll(address, bool) public virtual override {
        revert("SBT: Approvals are not allowed for soulbound tokens");
    }
}

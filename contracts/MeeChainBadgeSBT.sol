// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MeeChainBadgeSBT
 * @dev Soulbound Token (SBT) implementation for contributor badges
 * Features:
 * - Non-transferable (soulbound) tokens
 * - Role-based minting
 * - Efficient badge lookup
 * - Multiple badges per address
 */
contract MeeChainBadgeSBT is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 private _tokenIdCounter;
    
    // Mapping from address to array of badge IDs they own
    mapping(address => uint256[]) private _userBadges;
    
    // Mapping from token ID to badge type
    mapping(uint256 => uint256) private _tokenBadgeType;
    
    // Mapping to check if user has specific badge type
    mapping(address => mapping(uint256 => bool)) private _hasBadgeType;
    
    // Badge metadata URIs
    mapping(uint256 => string) private _badgeURIs;
    
    event BadgeMinted(address indexed to, uint256 indexed tokenId, uint256 indexed badgeType);
    event BadgeURIUpdated(uint256 indexed badgeType, string uri);

    constructor() ERC721("MeeChain Contributor Badge", "MEEBADGE") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Mint a badge to an address
     * @param to Address to mint badge to
     * @param badgeType Type of badge to mint
     */
    function mintBadge(address to, uint256 badgeType) external onlyRole(MINTER_ROLE) {
        require(to != address(0), "Cannot mint to zero address");
        require(!_hasBadgeType[to][badgeType], "User already has this badge type");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _tokenBadgeType[tokenId] = badgeType;
        _userBadges[to].push(tokenId);
        _hasBadgeType[to][badgeType] = true;
        
        emit BadgeMinted(to, tokenId, badgeType);
    }

    /**
     * @dev Batch mint multiple badges to an address
     * @param to Address to mint badges to
     * @param badgeTypes Array of badge types to mint
     */
    function batchMintBadges(address to, uint256[] calldata badgeTypes) external onlyRole(MINTER_ROLE) {
        require(to != address(0), "Cannot mint to zero address");
        
        for (uint256 i = 0; i < badgeTypes.length; i++) {
            uint256 badgeType = badgeTypes[i];
            if (!_hasBadgeType[to][badgeType]) {
                uint256 tokenId = _tokenIdCounter;
                _tokenIdCounter++;
                
                _safeMint(to, tokenId);
                _tokenBadgeType[tokenId] = badgeType;
                _userBadges[to].push(tokenId);
                _hasBadgeType[to][badgeType] = true;
                
                emit BadgeMinted(to, tokenId, badgeType);
            }
        }
    }

    /**
     * @dev Get all badge IDs owned by an address
     * @param user Address to query
     * @return Array of token IDs
     */
    function getBadgesOf(address user) external view returns (uint256[] memory) {
        return _userBadges[user];
    }

    /**
     * @dev Get badge type for a token ID
     * @param tokenId Token ID to query
     * @return Badge type
     */
    function getBadgeType(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenBadgeType[tokenId];
    }

    /**
     * @dev Check if user has a specific badge type
     * @param user Address to check
     * @param badgeType Badge type to check for
     * @return True if user has badge type
     */
    function hasBadgeType(address user, uint256 badgeType) external view returns (bool) {
        return _hasBadgeType[user][badgeType];
    }

    /**
     * @dev Set URI for a badge type
     * @param badgeType Badge type
     * @param uri Metadata URI
     */
    function setBadgeURI(uint256 badgeType, string calldata uri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _badgeURIs[badgeType] = uri;
        emit BadgeURIUpdated(badgeType, uri);
    }

    /**
     * @dev Get URI for a token
     * @param tokenId Token ID
     * @return Metadata URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        uint256 badgeType = _tokenBadgeType[tokenId];
        return _badgeURIs[badgeType];
    }

    /**
     * @dev Override transfer functions to make tokens soulbound (non-transferable)
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0), "Soulbound: tokens are non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev Check if token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev See {IERC165-supportsInterface}
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

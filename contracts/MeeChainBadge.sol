// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MeeChainBadge
 * @dev Soulbound Token (SBT) implementation for MeeChain contributor badges
 * Badges are non-transferable NFTs that represent achievements and contributions
 */
contract MeeChainBadge is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MeeChainBadge
 * @dev Soulbound Badge NFT for MeeChain Singapore
 * Non-transferable tokens that represent contributor achievements
 */
contract MeeChainBadge is ERC721URIStorage, Ownable {
    address public issuer;
    uint256 private _tokenIdCounter;

    // Mapping from token ID to badge type
    mapping(uint256 => string) public badgeTypes;
    
    // Mapping from user address to array of badge IDs they own
    mapping(address => uint256[]) private _userBadges;
    
    // Mapping to track if a token exists
    mapping(uint256 => bool) private _tokenExists;

    event BadgeMinted(address indexed recipient, uint256 indexed tokenId, string badgeType);
    event BadgeRevoked(address indexed owner, uint256 indexed tokenId);

    constructor() ERC721("MeeChain Badge", "MEEBADGE") Ownable(msg.sender) {}

    /**
     * @dev Mint a new badge to a user
     * @param to Address to mint the badge to
     * @param badgeType Type of badge (e.g., "Watchdog", "Pioneer", "Quest Master")
     */
    function mintBadge(address to, string memory badgeType) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        badgeTypes[tokenId] = badgeType;
        _userBadges[to].push(tokenId);
        _tokenExists[tokenId] = true;

        emit BadgeMinted(to, tokenId, badgeType);
        return tokenId;
    }

    /**
     * @dev Check if a user has a specific badge
     * @param user Address to check
     * @param badgeId Badge token ID to check
     * @return bool True if user owns the badge
     */
    function hasBadge(address user, uint256 badgeId) external view returns (bool) {
        if (!_tokenExists[badgeId]) {
            return false;
        }
        return ownerOf(badgeId) == user;
    }

    /**
     * @dev Get all badges owned by a user
     * @param user Address to query
     * @return uint256[] Array of badge token IDs
     */
    function getBadges(address user) external view returns (uint256[] memory) {
        return _userBadges[user];
    // Mapping from address to token IDs owned
    mapping(address => uint256[]) public userBadges;

    event BadgeMinted(address indexed to, uint256 indexed tokenId, string badgeType, string uri);

    constructor() ERC721("MeeChainBadge", "MCB") Ownable(msg.sender) {
        issuer = msg.sender;
    }

    /**
     * @dev Mint a new badge to a contributor
     * @param to Address of the badge recipient
     * @param badgeType Type of badge (e.g., "Watchdog", "Contributor", "Pioneer")
     * @param uri IPFS URI pointing to badge metadata
     */
    function mintBadge(address to, string memory badgeType, string memory uri) external {
        require(msg.sender == issuer, "Not authorized");
        require(to != address(0), "Invalid recipient");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        badgeTypes[tokenId] = badgeType;
        userBadges[to].push(tokenId);

        emit BadgeMinted(to, tokenId, badgeType, uri);
    }

    /**
     * @dev Override transfer functions to make badges soulbound (non-transferable)
     * Only allow minting (from address(0))
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0), "Soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Get all badge token IDs owned by a user
     * @param user Address to query
     */
    function getBadgesByUser(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }

    /**
     * @dev Get badge type by token ID
     * @param tokenId Badge token ID
     * @return string Badge type name
     */
    function getBadgeType(uint256 tokenId) external view returns (string memory) {
        require(_tokenExists[tokenId], "Badge does not exist");
     * @param tokenId Token ID to query
     */
    function getBadgeType(uint256 tokenId) external view returns (string memory) {
        return badgeTypes[tokenId];
    }

    /**
     * @dev Get total number of badges minted
     * @return uint256 Total supply of badges
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Override transfer functions to make badges soulbound (non-transferable)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        // Disallow transfers between addresses
        require(
            from == address(0) || to == address(0),
            "MeeChainBadge: Badges are soulbound and cannot be transferred"
        );
        
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Revoke a badge (only owner)
     * @param tokenId Badge token ID to revoke
     */
    function revokeBadge(uint256 tokenId) external onlyOwner {
        require(_tokenExists[tokenId], "Badge does not exist");
        address owner = ownerOf(tokenId);
        
        // Remove from user's badge array
        uint256[] storage userBadgeArray = _userBadges[owner];
        for (uint256 i = 0; i < userBadgeArray.length; i++) {
            if (userBadgeArray[i] == tokenId) {
                userBadgeArray[i] = userBadgeArray[userBadgeArray.length - 1];
                userBadgeArray.pop();
                break;
            }
        }
        
        _burn(tokenId);
        _tokenExists[tokenId] = false;
        
        emit BadgeRevoked(owner, tokenId);
     * @dev Update issuer address (only owner)
     * @param newIssuer New issuer address
     */
    function updateIssuer(address newIssuer) external onlyOwner {
        require(newIssuer != address(0), "Invalid issuer");
        issuer = newIssuer;
    }

    /**
     * @dev Get total number of badges minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}

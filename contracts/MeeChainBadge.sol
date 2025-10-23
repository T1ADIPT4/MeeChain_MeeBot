// SPDX-License-Identifier: MIT
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
     * @param tokenId Token ID to query
     */
    function getBadgeType(uint256 tokenId) external view returns (string memory) {
        return badgeTypes[tokenId];
    }

    /**
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

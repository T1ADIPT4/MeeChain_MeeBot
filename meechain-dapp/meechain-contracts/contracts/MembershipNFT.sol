
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IERC721Mintable {
    function mintReward(address to, uint256 tokenId, uint8 tier) external;
    function hasTierNFT(address user, uint8 tier) external view returns (bool);
    function getUserHighestTier(address user) external view returns (uint8);
}

contract MembershipNFT is ERC721, ERC721URIStorage, Ownable, Pausable, IERC721Mintable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Tier names and metadata
    mapping(uint8 => string) public tierNames;
    mapping(uint8 => string) public tierURIs;
    
    // User tier tracking
    mapping(address => mapping(uint8 => bool)) public userHasTier;
    mapping(address => uint8) public userHighestTier;
    mapping(uint256 => uint8) public tokenTier;
    
    // Authorized minters (Token contract)
    mapping(address => bool) public authorizedMinters;
    
    // Events
    event TierNFTMinted(address indexed to, uint256 indexed tokenId, uint8 tier);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    event TierMetadataUpdated(uint8 tier, string name, string uri);
    
    constructor() ERC721("MeeChain Membership", "MEEM") {
        // Initialize tier metadata
        _initializeTiers();
    }
    
    /**
     * @dev Initialize tier metadata
     */
    function _initializeTiers() internal {
        tierNames[1] = "Bronze Member";
        tierNames[2] = "Silver Member";
        tierNames[3] = "Gold Member";
        tierNames[4] = "Platinum Member";
        
        // Default metadata URIs (can be updated later)
        tierURIs[1] = "https://api.meechain.com/nft/bronze.json";
        tierURIs[2] = "https://api.meechain.com/nft/silver.json";
        tierURIs[3] = "https://api.meechain.com/nft/gold.json";
        tierURIs[4] = "https://api.meechain.com/nft/platinum.json";
    }
    
    /**
     * @dev Add authorized minter (only owner)
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }
    
    /**
     * @dev Remove authorized minter
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }
    
    /**
     * @dev Mint NFT reward (only authorized minters)
     */
    function mintReward(address to, uint256 tokenId, uint8 tier) external override {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        require(tier >= 1 && tier <= 4, "Invalid tier");
        require(!userHasTier[to][tier], "User already has this tier NFT");
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tierURIs[tier]);
        
        userHasTier[to][tier] = true;
        tokenTier[tokenId] = tier;
        
        if (tier > userHighestTier[to]) {
            userHighestTier[to] = tier;
        }
        
        emit TierNFTMinted(to, tokenId, tier);
    }
    
    /**
     * @dev Check if user has NFT for specific tier
     */
    function hasTierNFT(address user, uint8 tier) external view override returns (bool) {
        return userHasTier[user][tier];
    }
    
    /**
     * @dev Get user's highest tier
     */
    function getUserHighestTier(address user) external view override returns (uint8) {
        return userHighestTier[user];
    }
    
    /**
     * @dev Override required by Solidity
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * @dev Override required by Solidity
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    /**
     * @dev Override required by Solidity
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override to prevent transfers (soulbound NFTs)
     */
    function _transfer(address from, address to, uint256 tokenId) internal pure override {
        revert("Membership NFTs are non-transferable");
    }
}

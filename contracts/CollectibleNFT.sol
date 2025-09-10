
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CollectibleNFT is ERC721, ERC721URIStorage, Ownable, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Collectible categories
    enum CollectibleType { BADGE, MASCOT, MISSION, ACHIEVEMENT, SPECIAL }
    
    // Rarity levels
    enum Rarity { COMMON, RARE, EPIC, LEGENDARY, MYTHIC }
    
    struct Collectible {
        uint256 tokenId;
        CollectibleType collectibleType;
        Rarity rarity;
        string name;
        string description;
        uint256 mintedAt;
        bool isTransferable;
        address originalMinter;
    }
    
    // Mappings
    mapping(uint256 => Collectible) public collectibles;
    mapping(address => uint256[]) public userCollectibles;
    mapping(address => mapping(CollectibleType => uint256)) public userTypeCount;
    mapping(address => bool) public authorizedMinters;
    
    // Collection stats
    mapping(Rarity => uint256) public rarityCount;
    mapping(CollectibleType => uint256) public typeCount;
    
    // Events
    event CollectibleMinted(
        address indexed to,
        uint256 indexed tokenId,
        CollectibleType collectibleType,
        Rarity rarity,
        string name
    );
    event CollectibleTransferred(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    
    constructor() ERC721("MeeChain Collectibles", "MEEC") {}
    
    /**
     * @dev Authorize minter
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    /**
     * @dev Revoke minter
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
    }
    
    /**
     * @dev Mint collectible NFT
     */
    function mintCollectible(
        address to,
        CollectibleType collectibleType,
        Rarity rarity,
        string memory name,
        string memory description,
        string memory tokenURI,
        bool isTransferable
    ) external returns (uint256) {
        require(
            authorizedMinters[msg.sender] || msg.sender == owner(),
            "Not authorized to mint"
        );
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        collectibles[tokenId] = Collectible({
            tokenId: tokenId,
            collectibleType: collectibleType,
            rarity: rarity,
            name: name,
            description: description,
            mintedAt: block.timestamp,
            isTransferable: isTransferable,
            originalMinter: to
        });
        
        userCollectibles[to].push(tokenId);
        userTypeCount[to][collectibleType]++;
        rarityCount[rarity]++;
        typeCount[collectibleType]++;
        
        emit CollectibleMinted(to, tokenId, collectibleType, rarity, name);
        
        return tokenId;
    }
    
    /**
     * @dev Get user's collectibles
     */
    function getUserCollectibles(address user) external view returns (uint256[] memory) {
        return userCollectibles[user];
    }
    
    /**
     * @dev Get collectible details
     */
    function getCollectible(uint256 tokenId) external view returns (Collectible memory) {
        return collectibles[tokenId];
    }
    
    /**
     * @dev Get user's collection stats
     */
    function getUserStats(address user) external view returns (
        uint256 totalCollectibles,
        uint256 badges,
        uint256 mascots,
        uint256 missions,
        uint256 achievements,
        uint256 specials
    ) {
        totalCollectibles = userCollectibles[user].length;
        badges = userTypeCount[user][CollectibleType.BADGE];
        mascots = userTypeCount[user][CollectibleType.MASCOT];
        missions = userTypeCount[user][CollectibleType.MISSION];
        achievements = userTypeCount[user][CollectibleType.ACHIEVEMENT];
        specials = userTypeCount[user][CollectibleType.SPECIAL];
    }
    
    /**
     * @dev Override transfer to check if transferable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        if (from != address(0) && to != address(0)) {
            require(
                collectibles[tokenId].isTransferable,
                "This collectible is soulbound"
            );
        }
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

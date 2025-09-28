
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FootballNFT is ERC721, Ownable {
    using Strings for uint256;
    
    struct Player {
        string name;
        string position;
        uint256 rating;
        string nationality;
        uint256 mintedAt;
        bool isLegendary;
    }
    
    mapping(uint256 => Player) public players;
    mapping(address => bool) public authorizedMinters;
    mapping(string => bool) public playerExists;
    
    uint256 public nextTokenId = 1;
    string private _baseTokenURI;
    
    event PlayerMinted(address indexed to, uint256 indexed tokenId, string name, uint256 rating);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}
    
    /**
     * @dev Authorize an address to mint NFTs
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }
    
    /**
     * @dev Revoke minting authorization
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }
    
    /**
     * @dev Mint a football player NFT
     */
    function mintPlayer(
        address to,
        string memory name,
        string memory position,
        uint256 rating,
        string memory nationality,
        bool isLegendary,
        string memory tokenURI
    ) external onlyMinter returns (uint256) {
        require(!playerExists[name], "Player already exists");
        require(rating <= 100, "Rating cannot exceed 100");
        
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        
        players[tokenId] = Player({
            name: name,
            position: position,
            rating: rating,
            nationality: nationality,
            mintedAt: block.timestamp,
            isLegendary: isLegendary
        });
        
        playerExists[name] = true;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit PlayerMinted(to, tokenId, name, rating);
        return tokenId;
    }
    
    /**
     * @dev Get player details
     */
    function getPlayer(uint256 tokenId) external view returns (Player memory) {
        require(_exists(tokenId), "Player does not exist");
        return players[tokenId];
    }
    
    /**
     * @dev Get user's players
     */
    function getUserPlayers(address user) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory playerIds = new uint256[](balance);
        uint256 currentIndex = 0;
        
        for (uint256 tokenId = 1; tokenId < nextTokenId; tokenId++) {
            if (_exists(tokenId) && ownerOf(tokenId) == user) {
                playerIds[currentIndex] = tokenId;
                currentIndex++;
            }
        }
        
        return playerIds;
    }
    
    /**
     * @dev Set base URI for metadata
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Override tokenURI to return metadata
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 
            ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
            : "";
    }
    
    /**
     * @dev Internal function to get base URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Check if token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId < nextTokenId && _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @dev Set token URI for specific token
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        // In a real implementation, you might want to store custom URIs per token
        // For now, we rely on the base URI + tokenId pattern
    }
}

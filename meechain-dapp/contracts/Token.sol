
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/IERC721Mintable.sol";

contract MeeToken is ERC20, Ownable, Pausable {
    IERC721Mintable public membershipNFT;
    
    // Tier requirements (in tokens with 18 decimals)
    uint256 public constant BRONZE_THRESHOLD = 100 * 10**18;   // 100 MEE
    uint256 public constant SILVER_THRESHOLD = 500 * 10**18;   // 500 MEE
    uint256 public constant GOLD_THRESHOLD = 1000 * 10**18;    // 1,000 MEE
    uint256 public constant PLATINUM_THRESHOLD = 5000 * 10**18; // 5,000 MEE
    
    // Tracking user rewards
    mapping(address => uint256) public totalEarned;
    mapping(address => uint8) public userTier;
    
    // Events
    event TierUpgraded(address indexed user, uint8 newTier);
    event NFTRewardMinted(address indexed user, uint8 tier, uint256 tokenId);
    event MembershipNFTSet(address indexed nftContract);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Set the membership NFT contract address
     */
    function setMembershipNFT(address _membershipNFT) external onlyOwner {
        membershipNFT = IERC721Mintable(_membershipNFT);
        emit MembershipNFTSet(_membershipNFT);
    }
    
    /**
     * @dev Mint tokens to user and check for tier upgrades
     */
    function mintReward(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        totalEarned[to] += amount;
        _checkAndUpgradeTier(to);
    }
    
    /**
     * @dev Check and upgrade user tier based on total earned
     */
    function _checkAndUpgradeTier(address user) internal {
        uint8 currentTier = userTier[user];
        uint8 newTier = _calculateTier(totalEarned[user]);
        
        if (newTier > currentTier) {
            userTier[user] = newTier;
            emit TierUpgraded(user, newTier);
            
            // Mint NFT reward if membership contract is set and user doesn't have it
            if (address(membershipNFT) != address(0) && 
                !membershipNFT.hasTierNFT(user, newTier)) {
                uint256 tokenId = uint256(keccak256(abi.encodePacked(user, newTier, block.timestamp)));
                membershipNFT.mintReward(user, tokenId, newTier);
                emit NFTRewardMinted(user, newTier, tokenId);
            }
        }
    }
    
    /**
     * @dev Calculate tier based on total earned amount
     */
    function _calculateTier(uint256 earned) internal pure returns (uint8) {
        if (earned >= PLATINUM_THRESHOLD) return 4; // Platinum
        if (earned >= GOLD_THRESHOLD) return 3;     // Gold
        if (earned >= SILVER_THRESHOLD) return 2;   // Silver
        if (earned >= BRONZE_THRESHOLD) return 1;   // Bronze
        return 0; // No tier
    }
    
    /**
     * @dev Get user's current tier
     */
    function getUserTier(address user) external view returns (uint8) {
        return userTier[user];
    }
    
    /**
     * @dev Check if user qualifies for tier upgrade
     */
    function checkTierEligibility(address user) external view returns (uint8) {
        return _calculateTier(totalEarned[user]);
    }
    
    /**
     * @dev Pause contract (emergency)
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
    
    /**
     * @dev Override transfer to include pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}

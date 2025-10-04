
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC721Mintable {
    /**
     * @dev Mint NFT to specified address
     * @param to Address to mint NFT to
     * @param tokenId Token ID to mint
     * @param tier Membership tier (1=Bronze, 2=Silver, 3=Gold, 4=Platinum)
     */
    function mintReward(address to, uint256 tokenId, uint8 tier) external;
    
    /**
     * @dev Check if address has minted NFT for specific tier
     * @param user User address to check
     * @param tier Tier to check (1-4)
     */
    function hasTierNFT(address user, uint8 tier) external view returns (bool);
    
    /**
     * @dev Get user's highest tier
     * @param user User address
     */
    function getUserHighestTier(address user) external view returns (uint8);
}

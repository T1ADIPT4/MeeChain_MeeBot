
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MeeToken is ERC20, Ownable {
    mapping(address => bool) public authorizedMinters;
    
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount, address indexed minter);
    event TokensBurned(address indexed from, uint256 amount, address indexed burner);

    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }

    constructor() ERC20("MeeToken", "MEE") {}

    /**
     * @dev Authorize an address to mint tokens
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }

    /**
     * @dev Revoke minting authorization from an address
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }

    /**
     * @dev Check if address is authorized to mint
     */
    function isMinter(address account) external view returns (bool) {
        return authorizedMinters[account] || account == owner();
    }

    /**
     * @dev Mint tokens to specified address
     */
    function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
        emit TokensMinted(to, amount, msg.sender);
    }

    /**
     * @dev Burn tokens from specified address
     */
    function burn(address from, uint256 amount) public onlyMinter {
        _burn(from, amount);
        emit TokensBurned(from, amount, msg.sender);
    }

    /**
     * @dev Burn tokens from caller's balance
     */
    function burnFrom(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount, msg.sender);
    }
}

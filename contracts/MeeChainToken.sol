// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MeeChainToken is ERC20, Ownable {
    constructor() ERC20("MeeChain Token", "MEE") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // Mint 1M MEE to deployer
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}

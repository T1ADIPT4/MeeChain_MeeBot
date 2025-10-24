// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract MeeChainSupply {
    address public meeBot;
    IERC20 public token;

    mapping(address => bool) public replayConfirmed;
    mapping(address => uint256) public pendingSupply;

    event ReplayConfirmed(address indexed user, uint256 amount);
    event SupplyTriggered(address indexed user, uint256 amount);
    event RefundIssued(address indexed user, uint256 amount);

    modifier onlyMeeBot() {
        require(msg.sender == meeBot, "Not authorized");
        _;
    }

    constructor(address _meeBot, address _token) {
        meeBot = _meeBot;
        token = IERC20(_token);
    }

    // Called by MeeBot after off-chain replay verification
    function confirmReplay(address user, uint256 amount) external onlyMeeBot {
        replayConfirmed[user] = true;
        pendingSupply[user] = amount;
        emit ReplayConfirmed(user, amount);
    }

    // Called by MeeBot or Supplier role to trigger supply
    function triggerSupply(address user) external onlyMeeBot {
        require(replayConfirmed[user], "Replay not confirmed");
        uint256 amount = pendingSupply[user];
        require(amount > 0, "No supply pending");

        pendingSupply[user] = 0;
        token.transfer(user, amount);
        emit SupplyTriggered(user, amount);
    }

    // Optional: Called by RecoveryAgent if replay fails
    function refund(address user) external onlyMeeBot {
        require(!replayConfirmed[user], "Replay already confirmed");
        uint256 amount = pendingSupply[user];
        require(amount > 0, "No refund pending");

        pendingSupply[user] = 0;
        token.transfer(user, amount);
        emit RefundIssued(user, amount);
    }
}

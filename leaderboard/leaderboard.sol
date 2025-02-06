// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Leaderboard {
    address public owner; 
    mapping(address => bool) public authorizedUsers;
    mapping(address => PlayerScore) public leaderboard; // Stores player scores

    event ScoreSubmitted(address indexed player, uint256 score, uint256 reward, uint256 timestamp);
    event PrizePoolFunded(address indexed sender, uint256 amount);
    event RewardWithdrawn(address indexed player, uint256 amount);

    struct PlayerScore {
        uint256 score;
        uint256 reward;
    }

    constructor() {
        owner = msg.sender;
    }

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Not authorized.");
        _;
    }

    function setAuthorizedUser(address user) public {
        require(msg.sender == owner, "Only owner can set authorized users.");
        authorizedUsers[user] = true;
    }

    function submitScore(uint256 _score, uint256 _reward) public onlyAuthorized {
        require(_score > 0, "Score must be greater than 0");

        uint256 old_reward = leaderboard[msg.sender].reward;

        leaderboard[msg.sender] = PlayerScore({
            score: _score,
            reward: _reward + old_reward
        });

        emit ScoreSubmitted(msg.sender, _score, _reward, block.timestamp);
    }

    function fundPrizePool() external payable {
        require(msg.value > 0, "Must send ETH to fund the prize pool");
        emit PrizePoolFunded(msg.sender, msg.value);
    }

    function withdrawReward() external {
        uint256 reward = leaderboard[msg.sender].reward;
        require(reward > 0, "No rewards available for withdrawal");
        require(address(this).balance >= reward, "Not enough funds");

        leaderboard[msg.sender].reward = 0;
        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "Withdraw failed");

        emit RewardWithdrawn(msg.sender, reward);
    }

    receive() external payable {
        emit PrizePoolFunded(msg.sender, msg.value); // Log funding for The Graph
    }
}
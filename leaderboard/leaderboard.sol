// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Leaderboard {
    address public owner; 
    mapping(address => PlayerScore) public leaderboard;

    event ScoreSubmitted(address indexed player, uint256 score, uint256 reward, uint256 timestamp);
    event PrizePoolFunded(address indexed sender, uint256 amount);
    event RewardWithdrawn(address indexed player, uint256 amount);

    struct PlayerScore {
        uint256 score;
        uint256 reward;
    }

    constructor() payable{
        require(msg.value > 0.05 ether, "Must send ETH to fund the prize pool");
        owner = msg.sender;

        emit PrizePoolFunded(msg.sender, msg.value);
    }

    function submitScore(uint256 _score) public {
        require(_score > 0 && _score < 1000, "Score must be greater than 0");
        uint256 _reward = _score * address(this).balance / 10**6;
        leaderboard[msg.sender] = PlayerScore({
            score: _score,
            reward: _reward
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

        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "Withdraw failed");
        leaderboard[msg.sender].reward = 0;
        emit RewardWithdrawn(msg.sender, reward);
    }

    receive() external payable {
        emit PrizePoolFunded(msg.sender, msg.value);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Leaderboard {
    address public owner; 
    mapping(address => bool) public authorizedUsers;
    event ScoreSubmitted(address indexed player, uint256 score, uint256 timestamp);

    struct PlayerScore {
        address player;
        uint256 score;
    }

    constructor() {
        owner = msg.sender;
    }

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "You are not authorized to update scores.");
        _;
    }

    function setAuthorizedUser(address user) public {
        require(msg.sender == owner, "Only the owner can set authorized users.");
        authorizedUsers[user] = true;
    }

    PlayerScore[] public leaderboard;

    

    function submitScore(address user, uint256 _score) public onlyAuthorized {
        require(_score > 0, "Score must be greater than 0");

        leaderboard.push(PlayerScore({
            player: user,
            score: _score
        }));

        emit ScoreSubmitted(msg.sender, _score, block.timestamp);
    }
}


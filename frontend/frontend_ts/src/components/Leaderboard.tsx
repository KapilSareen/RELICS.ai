import React, { useState, useEffect } from "react";
import "./Leaderboard.css";

const Leaderboard = ({ isOpen, onClose }) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch("https://your-api.com/leaderboard") // Replace with actual API URL
        .then((res) => res.json())
        .then((data) => {
          // Sort by highest score first
          const sortedData = data.sort((a, b) => b.score - a.score);
          setPlayers(sortedData);
        })
        .catch((err) => console.error("Error fetching leaderboard:", err));
    }
  }, [isOpen]); // Fetch data only when the modal is opened

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="leaderboard-overlay" onClick={onClose}>
      <div className="leaderboard-container" onClick={(e) => e.stopPropagation()}>
        <h2>Leaderboard</h2>
        <button className="close-btn" onClick={onClose}>✖</button>
        <ul>
          {players.map((player, index) => (
            <li key={index}>
              <span className="rank">#{index + 1}</span>
              <span className="name">{player.name}</span>
              <span className="score">{player.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;

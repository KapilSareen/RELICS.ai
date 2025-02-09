import React from "react";
import "./Leaderboard.css";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

const query = gql`
  {
    players(first: 10, orderDirection: desc, orderBy: score) {
      id
      reward
      score
    }
  }
`;

const url =
  "https://api.studio.thegraph.com/query/103275/hacking-leaderboard/version/latest";

const Leaderboard = ({ isOpen, onClose }) => {
  // Fetch data using useQuery
  const { data, isLoading, error } = useQuery({
    queryKey: ["players"],
    queryFn: async () => request(url, query),
  });

  // Handle loading and error states
  if (!isOpen) return null; // Don't render if modal is closed
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching leaderboard.</p>;

  return (
    <div className="leaderboard-overlay" onClick={onClose}>
      <div
        className="leaderboard-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Leaderboard</h2>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {/* Table Header */}
        <div className="leaderboard-header">
          <span className="rank">Rank</span>
          <span className="id">Address</span>
          <span className="score">Score</span>
          <span className="reward">Reward</span>
        </div>

        {/* Leaderboard Entries */}
        <ul className="leaderboard-list">
          {data.players.map((player, index) => (
            <li key={player.id} className="leaderboard-item">
              <span className="rank">#{index + 1}</span>
              <span className="id">{player.id.slice(0, 6)}...</span>
              <span className="score">{player.score}</span>
              <span className="reward">{player.reward}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;


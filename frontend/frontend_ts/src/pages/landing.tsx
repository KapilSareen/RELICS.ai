import React from 'react'
import './landing.css'
import Navbar from  '../components/Navbar'
import { useNavigate } from 'react-router-dom'
function landing() {
  const navigate = useNavigate()
  return (
    <div className='landing'>
        <Navbar/>
        <div className='Cover'></div>
        <img src='/bg2.webp'></img>
        <h1> WELCOME TO RELICS.ai</h1>
        <p>Only your prompt engeneering skill can solve blockchain puzzles</p>
        <button className='btn' onClick={()=>navigate("/story")}>
        <h3>Get Started</h3>
          {/* <img src='/arrow.svg'></img> */}
        </button>
        <h2>How it works?</h2>
        <ul>
        <li>Solve Blockchain Challenges – Use AI-driven prompts to decipher puzzles hidden in smart contracts, DeFi exploits, and cryptographic riddles.</li>
        <li>Compete & Earn – Outperform other players, secure top spots, and win crypto rewards for solving problems efficiently.</li>
        <li> AI-Powered Gameplay – Our AgentKit-powered AI adapts to your playstyle, offering dynamic hints, interactive storytelling, and real-time blockchain simulations.</li>
        <li>Level Up & Unlock – Progress through multiple difficulty levels, from beginner-friendly blockchain concepts to advanced smart contract hacking and forensics.</li>
        </ul>
    </div>
  )
}

export default landing
import React, {useEffect} from 'react'
import './landing.css'
import Navbar from  '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import useStore from '../../Store'
function landing() {
  const navigate = useNavigate()
  const index = useStore((state) => state.index); // ✅ This will force a re-render
  const setIndex = useStore((state) => state.setIndex);
  const { stories, setStories, } = useStore();
  const { stories2, setStories2} = useStore();
  const story = async() =>{
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER}/first`);
    const data = await response.json();
    setStories(data);
} 
const story2 = async() =>{
  const response = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER}/second`);
  const data = await response.json();
  setStories2(data);
} 
  const genIndex = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER}/index`);
      const data = await response.json();
      await setIndex(data.index);
    } catch (error) {
      console.error("Error fetching index:", error);
    }
  }
  useEffect(()=>{
    story()
    story2()
    genIndex()
    // console.log("index", index)
  }, [])
  useEffect(() => {
    console.log("Updated Zustand index:", index);
  }, [index]);
  useEffect(() => {
    console.log("Updated Zustand story:", stories);
  }, [stories]);
  useEffect(() => {
    console.log("Updated Zustand story2:", stories2);
  }, [stories2]);
  return (
    <div className='landing'>
        <Navbar/>
        <div className='Cover'></div>
        <img src={`bg${index}.webp`}></img>
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
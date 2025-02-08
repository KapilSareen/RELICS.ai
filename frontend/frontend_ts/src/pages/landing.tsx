import React, {useEffect, useState} from 'react'
import './landing.css'
import Navbar from  '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import useStore from '../../Store'
import Leaderboard from '../components/Leaderboard'; // Import the Leaderboard component

function landing() {
  const navigate = useNavigate()
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false); // ✅ Controls leaderboard visibility

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
        <div className='content'>
        <h1>RELICS: The Lost Protocol</h1>
        <p>Outsmart AI agents in a series of smart contract hacking puzzles. Are you ready to challenge the future of blockchain security?</p>
        <div className='btns'>
        <button className='btn' onClick={()=>navigate("/story")}>
        <h3>Get Started</h3>
        </button>
        <button className='btn2' onClick={() => setIsLeaderboardOpen(true)}>Leaderboard</button>
        </div></div>
        {isLeaderboardOpen && <Leaderboard isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />}

    </div>
  )
}

export default landing
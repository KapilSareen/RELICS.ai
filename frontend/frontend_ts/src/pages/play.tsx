import React from 'react'
import Navbar from '../components/Navbar'
import Agent from '../components/guide'
import './play.css'
import Chat from '../components/chat'
function play() {
  return (
    <div className='play'>
    <Navbar/>
    <div className='Cover2'></div>
    <img src='/bg1.webp'></img>
    <div className='Left'>
        <h2>LEVEL 0</h2>
        <h3>Challenge Guide</h3>
        <Agent/>
     
    </div>
    <div className='down'>
       <h3 >Have you solved this challenge?</h3>
        <button className='sol-btn'>Solved</button></div>
    <Chat/>
</div>
  )
}

export default play
import React from 'react'
import Navbar from '../components/Navbar'
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
        <div>
            <div></div>
            Agent</div>
        <h3>Do you think you have solved the challenge</h3>
        <button>Yes</button>
    </div>
    <Chat/>
</div>
  )
}

export default play
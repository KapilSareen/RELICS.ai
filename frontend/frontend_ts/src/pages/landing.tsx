import React from 'react'
import './landing.css'
import Navbar from  '../components/Navbar'

function landing() {
  return (
    <div className='landing'>
        <Navbar/>
        <div className='Cover'></div>
        <img src='/bg1.webp'></img>
        <h1></h1>
    </div>
  )
}

export default landing
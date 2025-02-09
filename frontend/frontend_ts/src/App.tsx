import React, { useState } from 'react';
import Landing from './pages/landing';
import {Providers} from './components/Providers'
import Story from './components/StoryComponent'
import Play from './pages/play'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Leaderboard from './components/Leaderboard'
import Chat from './components/chat'


function App() {
  return (
    
    <Providers>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/story" element={<Story />} />
        <Route path="/play" element={<Play/>}/>
      </Routes>
    </Router>
      </Providers>

    
  )
}

export default App

import React, { useState } from 'react';
import Landing from './pages/landing';
import {Providers} from './components/Providers'
import Story from './components/StoryComponent'
import Play from './pages/play'
import Chat from './components/chat'


function App() {
  return (
    
    <Providers>
      {/* <Landing/> */}
      {/* <Story/> */}
      <Play/>
      {/* <Chat/> */}
      </Providers>

    
  )
}

export default App

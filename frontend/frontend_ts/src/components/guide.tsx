import React from 'react'
import './Guide.css'
import useStore from '../../Store'
import { TypeAnimation } from "react-type-animation";

function guide() {
  const story = useStore((state)=>state.stories2) 
  console.log(story)
  return (
    <div className='Guide'>
        <div className='guide_detail'>
            <img src='/p3.jpg' className='guide_img'></img>
            <div>Trinity</div>
        </div>
        <div className='guide_text'>
            <p> 
            <TypeAnimation
                       key={story}
                        sequence={[story]} // No delete effect
                        speed={70} // Typing speed
                        repeat={0}
                    />
            </p>
        </div>
      
    </div>
  )
}

export default guide

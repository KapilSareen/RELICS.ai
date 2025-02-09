    import React, { useState, useEffect, useRef } from 'react';
    import './StoryComponent.css';
    import Navbar from './Navbar'
    import { background } from '@coinbase/onchainkit/theme';
    import Typical from "react-typical";
    import { TypeAnimation } from "react-type-animation";
    import useStore from '../../Store'
    import { useNavigate } from 'react-router-dom'



    const StoryComponent = () => {
        const index = useStore((state)=>state.index)
        const [storyIndex, setStoryIndex] = useState(0);
        const [text, setText] = useState('');
        const [videoSpeed, setVideoSpeed] = useState(1); // Video speed control
        const {stories} = useStore();
        let storyText = stories;
        const navigate = useNavigate()

        console.log("index", index)
        // var Typewriter = new Typewriter('#typewriter', {
        //     strings: ['Hello', 'World'],
        //     autoStart: true,
        //   });
        const videoRef = useRef(null)

        const updateStory = () => {
            setStoryIndex(prevIndex => (prevIndex + 1) % storyText.length);
            
        };
        useEffect(() => {
            const interval = setInterval(updateStory, 10000);
            return () => clearInterval(interval); // Cleanup interval on unmount
        }, []);
        useEffect(() => {
            setText(storyText[storyIndex])
            if (videoRef.current) {
                videoRef.current.load(); // Forces the video to reload
            }
        }, [storyIndex]);


        const handleNext = () => {
            if (storyIndex < storyText.length - 1) {
                setStoryIndex(prevIndex => prevIndex + 1);
            } else if (storyIndex >= 2) {
                navigate("/play")
            }
        }


        return (
            <div className="story-container">
                <Navbar style={{background:"black"}}/>
                <video key={storyIndex} ref={videoRef} className="background-video" autoPlay loop>
                    <source src={`/v${index}${storyIndex}.webm`} type="video/mp4" />
                </video>
                <img src='/box.svg'>
                </img>
                <p className='text'>
                <TypeAnimation
                        key={storyIndex}
                        sequence={[storyText[storyIndex]]} // No delete effect
                        speed={80} // Typing speed
                        
                    />
                </p>
                <button className="next-btn" onClick={handleNext}>Next</button>
                

                {/* <div className="story-content">
                    <p className='text'>{text}</p>
                    <button className="next-btn" onClick={handleNext}>Next</button>
                </div> */}
            </div>
        );
    };

    export default StoryComponent;

    import React, { useState, useEffect, useRef } from 'react';
    import './StoryComponent.css';
    import Navbar from './Navbar'
    import { background } from '@coinbase/onchainkit/theme';
    import Typical from "react-typical";
    import { TypeAnimation } from "react-type-animation";




    const StoryComponent = () => {
        const [storyIndex, setStoryIndex] = useState(1);
        const [text, setText] = useState('');
        const [videoSpeed, setVideoSpeed] = useState(1); // Video speed control
        const storyText = [
            "In the year 2045, AI agents took control of the world, leaving humanity in chaos.",
            "The last hope lies with a rebel who must solve blockchain puzzles to stop the machines.",
            "Each puzzle solved brings them one step closer to reclaiming freedom.",
            "But the journey is fraught with challenges, and the fate of mankind rests in their hands." ,
            "teri maa ki chu",
            " aauuuuu",
            "aur laude",
            "kutte",
        ];
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
            } else {
                setStoryIndex(0); // Optional: Restart story when finished
            }
        }


        return (
            <div className="story-container">
                <Navbar style={{background:"black"}}/>
                <video key={storyIndex} ref={videoRef} className="background-video" autoPlay loop>
                    <source src={`/v${storyIndex}.webm`} type="video/mp4" />
                </video>
                <img src='/box.svg'>
                </img>
                <p className='text'>
                <TypeAnimation
                        key={storyIndex}
                        sequence={[storyText[storyIndex]]} // No delete effect
                        speed={10} // Typing speed
                        
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

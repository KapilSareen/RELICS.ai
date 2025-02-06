import React, { useState, useEffect, useRef } from 'react';
import './StoryComponent.css';

const StoryComponent = () => {
    const [storyIndex, setStoryIndex] = useState(1);
    const [isTyping, setIsTyping] = useState(true);
    const [text, setText] = useState('');
    const [videoSpeed, setVideoSpeed] = useState(1); // Video speed control
    const storyText = [
        "In the year 2045, AI agents took control of the world, leaving humanity in chaos.",
        "The last hope lies with a rebel who must solve blockchain puzzles to stop the machines.",
        "Each puzzle solved brings them one step closer to reclaiming freedom.",
        "But the journey is fraught with challenges, and the fate of mankind rests in their hands."
    ];
    const videoRef = useRef(null)
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
            <video key={storyIndex} ref={videoRef} className="background-video" autoPlay loop muted>
                <source src={`/v${storyIndex}.mp4`} type="video/mp4" />
            </video>
            <div className="story-content">
                <p className='text'>{text}</p>
                <button className="next-btn" onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default StoryComponent;

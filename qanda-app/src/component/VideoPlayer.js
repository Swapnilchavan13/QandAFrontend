import React, { useState, useRef, useEffect } from 'react';

export const VideoPlayer = () => {
  const [videoLinks, setVideoLinks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    // Retrieve video links from localStorage
    const storedVideoLinks = JSON.parse(localStorage.getItem('videoLinks'));

    if (storedVideoLinks && storedVideoLinks.length > 0) {
      setVideoLinks(storedVideoLinks);
    }
  console.log(storedVideoLinks)

  }, []);

  useEffect(() => {
    // Update the video source when currentIndex changes
    if (videoRef.current) {
      videoRef.current.src = videoLinks[currentIndex];
      videoRef.current.load(); // Reload the video element
    }
  }, [currentIndex, videoLinks]);

  const handleVideoEnded = () => {
    // Check if the current index is less than the length before incrementing
    if (currentIndex < videoLinks.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  console.log(videoLinks)

  return (
    <div>
      <h1>Video Player</h1>
      {videoLinks.length > 0 && (
        <div>
          <video
            id="videoElement"
            width="640"
            height="360"
            autoPlay
            controls
            onEnded={handleVideoEnded}
            ref={videoRef}
          >
            <source src={videoLinks[currentIndex]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

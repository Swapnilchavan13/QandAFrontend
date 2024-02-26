import React, { useState, useRef, useEffect } from 'react';

export const VideoPlayer = () => {
  const [videoLinks, setVideoLinks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoID, setVideoID] = useState(null);
  const videoRef = useRef(null);

  const togglefs = () => {
    const e = document.getElementById('videoElement');
    const isFullscreen = document.fullscreenElement;

    console.log(isFullscreen);

    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      e.requestFullscreen();
    }
  };

  useEffect(() => {
    // Retrieve video links from localStorage
    const storedVideoLinks = JSON.parse(localStorage.getItem('videoLinks'));

    if (storedVideoLinks && storedVideoLinks.length > 0) {
      setVideoLinks(storedVideoLinks);
    }
  }, []);

  useEffect(() => {
    // Update the video source when currentIndex changes
    if (videoRef.current) {
      videoRef.current.src = videoLinks[currentIndex];
      videoRef.current.load(); // Reload the video element
    }
  }, [currentIndex, videoLinks]);

  useEffect(() => {
    // Fetch video data from API and compare with the current video URL
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.0.113:8010/api/allVideos');
        const data = await response.json();

        console.log(data.results);
        const matchingVideo = data.results.find(video => video.videoURL === videoLinks[currentIndex]);

        if (matchingVideo) {
          setVideoID(matchingVideo.videoID);
        } else {
          setVideoID(null);
        }
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchData();
  }, [currentIndex, videoLinks]);

  const handleVideoEnded = () => {
    if (currentIndex < videoLinks.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        togglefs();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <h1>Video Player</h1>
      {videoLinks.length > 0 && (
        <div>
          <h1>video src link: {videoLinks[currentIndex]}</h1>
          <h2>Video ID: {videoID}</h2>
          <video
            allow="fullscreen"
            id="videoElement"
            autoPlay
            controls
            allowfullscreen
            onEnded={handleVideoEnded}
            src={`http://192.168.0.113:3000${videoLinks[currentIndex]}`}
          ></video>
          <div onClick={togglefs} id="fullscreenbtn">
            click me
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import '../styles/local.css'; // Import the CSS file

export const LocalPlaylist = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3008/videos')
      .then(response => response.json())
      .then(data => {
        setVideos(data.videos);
      })
      .catch(error => console.error('Error fetching videos:', error));
  }, []);

  useEffect(() => {
    const videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer && autoplay && playing) {
      videoPlayer.play();
    } else if (videoPlayer && !autoplay && !playing) {
      videoPlayer.pause();
    }
  }, [currentVideoIndex, autoplay, playing]);

  useEffect(() => {
    const videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer) {
      if (autoplay && playing) {
        videoPlayer.play();
      }
    }
  }, [currentVideoIndex, videoReady]);

  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  const toggleAutoplay = () => {
    setAutoplay(!autoplay);
    setPlaying(!playing);
  };

  const playAllVideos = () => {
    setAutoplay(true);
    setPlaying(true);
  };

  const handleCanPlayThrough = () => {
    setVideoReady(true);
  };

  const changeVideo = (index) => {
    setVideoReady(false); // Reset video ready state
    setCurrentVideoIndex(index);
  };

  return (
    <div className="local-playlist">
      <h1>Local Playlist</h1>
      <div className="playlist">
        <h2>Playlist</h2>
        <ul>
          {videos.map((video, index) => (
            <li key={index}>
              {video}
              <button onClick={() => changeVideo(index)}>Play</button>
            </li>
          ))}
        </ul>
        <button onClick={playAllVideos}>Play All</button>
      </div>
      {videos.length > 0 && (
        <div className="video-container">
          <video
            id="videoPlayer"
            controls
            onEnded={handleVideoEnd}
            onCanPlayThrough={handleCanPlayThrough}
          >
            <source src={videos[currentVideoIndex]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="controls">
            <p>Currently Playing: {videos[currentVideoIndex]}</p>
            
            <button onClick={toggleAutoplay}>{autoplay ? 'Pause' : 'Play'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

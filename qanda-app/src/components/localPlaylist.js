import React, { useState, useEffect } from 'react';

export const LocalPlaylist = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3008/videos')
      .then(response => response.json())
      .then(data => {
        setVideos(data.videos);
      })
      .catch(error => console.error('Error fetching videos:', error));
  }, []);

  const handleNextVideoButtonClick = () => {
    setCurrentVideoIndex(prevIndex => (prevIndex < videos.length - 1 ? prevIndex + 1 : 0));
  };

  useEffect(() => {
    const videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer) {
      videoPlayer.addEventListener('ended', handleVideoEnd);
      return () => {
        videoPlayer.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [currentVideoIndex]); // Update the event listener when currentVideoIndex changes

  const handleVideoEnd = () => {
    handleNextVideoButtonClick();
  };

  return (
    <div>
      <h1>Local Playlist</h1>
      {videos.length > 0 && (
        <>
          <video style={{width:"350px"}} id="videoPlayer" controls>
            <source src={videos[currentVideoIndex]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p>Currently Playing: {videos[currentVideoIndex]}</p>
          <button onClick={handleNextVideoButtonClick}>Next Video</button>
        </>
      )}
    </div>
  );
};

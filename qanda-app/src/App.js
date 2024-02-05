// App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef();
  const currentTimeButtonRef = useRef(null);

  const fetchAllVideos = async () => {
    try {
      const response = await fetch('http://localhost:8002/api/all-videos');
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching all videos', error);
    }
  };
  
  const fetchCurrentVideo = async () => {
    try {
      const response = await fetch('http://localhost:8002/api/current-video');
      const data = await response.json();
      setCurrentTime(data.currentTime);
      setIsPlaying(data.state === 'true');
    } catch (error) {
      console.error('Error fetching current video', error);
    }
  };
  const handleVideoChange = (videoId) => {
    const newIndex = videos.findIndex(video => video.video_id === videoId);
    if (newIndex !== -1) {
      setCurrentVideoIndex(newIndex);
      setIsPlaying(false);

      const currentVideo = videos[newIndex];
      setCurrentTime(currentVideo?.currentTime || 0);

      // Update video pointer
      if (videoRef.current) {
        videoRef.current.currentTime = currentVideo?.currentTime || 0;
      }

      savePlaybackPosition();

      setTimeout(() => {
        currentTimeButtonRef.current.click();
      }, 2000);
    }
  };

  const handleTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    setCurrentTime(currentTime <= duration ? currentTime : duration);
  };

  const getCurrentTime = () => {
    const currentVideo = videos.find(video => video.video_id === currentVideoIndex + 1);
    if (currentVideo) {
      setCurrentTime(currentVideo.currentTime);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    fetch('http://localhost:8002/api/current-video')
      .then(response => response.json())
      .then(data => {
        fetch('http://localhost:8002/api/update-video-state', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            video_id: videos[currentVideoIndex]?.video_id,
            state: 'false',
            currentTime: videoRef.current.currentTime,
          }),
        })
        .then(response => response.json())
        .then(result => {
          console.log('Video state updated successfully:', result);
        })
        .catch(error => {
          console.error('Error updating video state:', error);
        });
      })
      .catch(error => {
        console.error('Error fetching current video:', error);
      });
  };

  const savePlaybackPosition = () => {
    if (currentVideoIndex !== undefined && videos[currentVideoIndex]) {
      localStorage.setItem(`video_${videos[currentVideoIndex].video_id}`, JSON.stringify({ currentTime, isPlaying }));
    }
  };

  useEffect(() => {
    fetchAllVideos();
  }, []);

  useEffect(() => {
    fetchCurrentVideo();
  }, [currentVideoIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [videoRef]);

  // Additional useEffect to handle initial setup
  useEffect(() => {
    if (videos.length > 0) {
      setCurrentTime(videos[currentVideoIndex]?.currentTime || 0);
    }
  }, [videos, currentVideoIndex]);

  return (
    <div className='maindiv'>
      <h1>All Videos</h1>

      <h1>Current Video</h1>
      <video
        ref={videoRef}
        src={videos[currentVideoIndex]?.video}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
      />
      <div>
      <div>
        <p>Elapsed Time: {formatTime(Math.floor(currentTime))}</p>
        <button style={{display:"none"}} ref={currentTimeButtonRef} onClick={getCurrentTime}>
          Get Current Time
        </button>
      </div>
      
      {videos.map((video) => (
  <button key={video.video_id} onClick={() => handleVideoChange(video.video_id)}>
    {video.video_id} Video
  </button>
))}

      </div>

      {/* <button onClick={handlePrevious}>Previous Video</button> */}
      {/* <button onClick={handleNext}>Next Video</button> */}

    </div>
  );
}

const formatTime = seconds => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default App;

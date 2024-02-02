import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [currentVideo, setCurrentVideo] = useState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef();

  const fetchCurrentVideo = async () => {
    const response = await fetch('http://localhost:8001/api/current-video');
    const data = await response.json();
    setCurrentVideo(data);
  };

  const handleNext = () => {
    savePlaybackPosition();
    fetch('http://localhost:8001/api/next-video')
      .then(response => response.json())
      .then(data => setCurrentVideo(data))
      .catch(error => console.error('Error fetching next video', error));
  };

  const handlePrevious = () => {
    savePlaybackPosition();
    fetch('http://localhost:8001/api/previous-video')
      .then(response => response.json())
      .then(data => setCurrentVideo(data))
      .catch(error => console.error('Error fetching previous video', error));
  };

const handleTimeUpdate = () => {
  const currentTime = videoRef.current.currentTime;
  const duration = videoRef.current.duration;

  setCurrentTime(currentTime <= duration ? currentTime : duration);
};

const getCurrentTime = () => {
  const currentTime = videoRef.current.currentTime;
  const duration = videoRef.current.duration;

  const seekTime = currentVideo.currentTime;
  const newTime = Math.min(seekTime, duration);

  videoRef.current.currentTime = newTime <= duration ? newTime : duration;
};

  const handlePlay = () => {
    setIsPlaying(true);
    window.parent.postMessage({ type: 'videoState', isPlaying: true }, '*');
  };

  const handlePause = () => {
    setIsPlaying(false);
    window.parent.postMessage({ type: 'videoState', isPlaying: false }, '*');
    
    fetch('http://localhost:8001/api/current-video')
      .then(response => response.json())
      .then(data => {
        fetch('http://localhost:8001/api/update-video-state', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            video_id: data.video_id,
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
    if (currentVideo.video_id) {
      localStorage.setItem(`video_${currentVideo.video_id}`, JSON.stringify({ currentTime, isPlaying }));
    }
  };

  useEffect(() => {
    fetchCurrentVideo();
  }, [currentVideo.video_id]);

 useEffect(() => {
    const storedData = localStorage.getItem(`video_${currentVideo.video_id}`);
    if (storedData) {
      const { currentTime: storedTime, isPlaying: storedPlaying } = JSON.parse(storedData);
      setCurrentTime(storedTime || 0);
      setIsPlaying(storedPlaying || false);
    } else {
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [currentVideo.video_id]);

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isPlaying) {
        setCurrentTime(prevTime => prevTime + 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying]);
  
  return (
    <div className='maindiv'>
      <h1>Current Video</h1>
      <video
        ref={videoRef}
        src={currentVideo.video}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleNext}
      />
      <div>
        <p>Elapsed Time: {formatTime(Math.floor(currentTime))}</p>
        <button onClick={getCurrentTime}>Get Current Time</button>
      </div>

      <button onClick={handlePrevious}>Previous Video</button>
      <button onClick={handleNext}>Next Video</button>
    </div>
  );
}

const formatTime = seconds => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};


export default App;

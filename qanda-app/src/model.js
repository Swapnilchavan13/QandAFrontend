// model.js
import { useState, useRef, useEffect } from 'react';

const useVideoModel = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef();

  const fetchAllVideos = async () => {
    try {
      const response = await fetch('http://localhost:8002/api/all-videos');
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching all videos', error);
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

  useEffect(() => {
    if (videos.length > 0) {
      setCurrentTime(videos[currentVideoIndex]?.currentTime || 0);
    }
  }, [videos, currentVideoIndex]);

  return {
    videos,
    currentVideoIndex,
    currentTime,
    isPlaying,
    videoRef,
    fetchAllVideos,
    handleVideoChange,
    handleTimeUpdate,
    getCurrentTime,
    handlePlay,
    handlePause,
    savePlaybackPosition,
  };
};

export default useVideoModel;

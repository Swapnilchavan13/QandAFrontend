// App.js
import React from 'react';
import useVideoController from './controller';

import './App.css';

function App() {
  const {
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
  } = useVideoController();

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
        <button style={{display:"none"}} onClick={getCurrentTime}>
          Get Current Time
        </button>
      </div>
      
      {videos.map((video) => (
  <button key={video.video_id} onClick={() => handleVideoChange(video.video_id)}>
    {video.video_id} Video
  </button>
))}

    </div>
    </div>
  );
}

const formatTime = seconds => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default App;

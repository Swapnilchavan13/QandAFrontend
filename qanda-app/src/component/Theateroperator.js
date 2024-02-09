import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/scheduler.css'; // Ensure the correct path to your CSS file

export const Theateroperator = () => {
  const [schedulerData, setSchedulerData] = useState([]);


  useEffect(() => {
    // Fetch scheduler data from the backend API using fetch
    fetch('http://localhost:8002/api/getSchedulerData')
      .then(response => response.json())
      .then(data => {
        setSchedulerData(data);
      })
      .catch(error => {
        console.error('Error fetching scheduler data:', error);
      });
  }, []);

  const renderSchedulerPlaylist = () => {
    return schedulerData.map(scheduler => (
      <div key={scheduler.id} className="scheduler-playlist-item">
        <h3>{`Scheduler ${scheduler.scheduler_index} - ${new Date(scheduler.start_date).toDateString()}`}</h3>
        <ul>
          {scheduler.selected_videos.map((videoId, index) => (
            <li key={index}>
              {/* Assume there's a function to get video information based on videoId */}
              {`Video ${index + 1}: ${getVideoInfo(videoId).video}`}
            </li>
          ))}
        </ul>
        <button onClick={() => handlePlayButtonClick(scheduler)}>Play</button>
      </div>
    ));
  };

  const handlePlayButtonClick = (scheduler) => {
    // Handle the play button click, e.g., navigate to a video playback page
    console.log('Play button clicked for scheduler:', scheduler);
  };

  const getVideoInfo = (videoId) => {
    // Fetch video information based on videoId or use cached video data
    // Replace this with your actual implementation
    return { video: `Video ${videoId}`, duration: '5:00' };
  };

  return (
    <>
      <h1>Scheduler Playlist</h1>
      
      <div className="scheduler-playlist-wrapper">
        {renderSchedulerPlaylist()}
      </div>
    </>
  );
};

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/theater.css'; // Ensure the correct path to your CSS file

export const Theateroperator = () => {
  const [schedulerData, setSchedulerData] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');

  useEffect(() => {
    // Fetch scheduler data from the backend API using axios
    axios.get('http://localhost:8002/api/allSchedulerData')
      .then(response => {
        setSchedulerData(response.data);
      })
      .catch(error => {
        console.error('Error fetching scheduler data:', error);
      });
  }, []);

  const handlePlayButtonClick = (scheduler) => {
    if (scheduler.selected_videos && Array.isArray(scheduler.selected_videos)) {
      scheduler.selected_videos.forEach(videoId => {
        const videoInfo = getVideoInfo(videoId);
        if (videoInfo) {
          console.log('Playing video:', videoInfo.video);
          playVideo(videoInfo.video);
        }
      });
    } else {
      console.error('No selected videos available for this scheduler.');
    }
  };

  const playVideo = (videoUrl) => {
    console.log('Opening video:', videoUrl);

    // Redirect to the video URL in the same tab
    window.location.href = videoUrl;
  };

  const renderSchedulerPlaylist = () => {
    if (!Array.isArray(schedulerData) || schedulerData.length === 0) {
      return <p>No scheduler data available.</p>;
    }

    // Filter schedulerData based on the selected theater
    const filteredSchedulerData = selectedTheater
      ? schedulerData.filter(scheduler => scheduler.theater_id === parseInt(selectedTheater, 10))
      : schedulerData;

    return filteredSchedulerData.map(scheduler => (
      <div key={scheduler.id} className="scheduler-playlist-item">
        <h3>{`Scheduler ${scheduler.scheduler_index} - ${new Date(scheduler.start_date).toDateString()}`}</h3>
        <ul>
          {Object.keys(scheduler).map(key => {
            if (key.includes('_link') && scheduler[key]) {
              return (
                <li key={key}>
                  <a href={scheduler[key]} target="_blank" rel="noopener noreferrer">
                    {`${key.replace('_link', '')}: View Video`}
                  </a>
                  <br />
                  {/* <video width="200" controls autoPlay="false">
                <source src={scheduler[key]} type="video/mp4"/>
            </video> */}
                  
                </li>
              );
            }
            return null;
          })}
        </ul>
        <button onClick={() => handlePlayButtonClick(scheduler)}>Play All</button>
      </div>
    ));
  };

  const getVideoInfo = (videoId) => {
    // Placeholder function, replace this with actual implementation
    // Fetch video information based on videoId or use cached video data
    return { video: `Video ${videoId}`, duration: '5:00' };
  };

  const theaters = [
    { id: 1, name: 'Theater A' },
    { id: 2, name: 'Theater B' },
    { id: 3, name: 'Theater C' },
    { id: 4, name: 'Theater D' },
    // Add more theaters as needed
  ];

  return (
    <>
      <h1>Operator Playlist</h1>

      <div className='selectt'>
        <label>Select Theater:</label>
        <select
          value={selectedTheater}
          onChange={(e) => setSelectedTheater(e.target.value)}
        >
          <option value="">All Theaters</option>
          {theaters.map(theater => (
            <option key={theater.id} value={theater.id}>
              {theater.name}
            </option>
          ))}
        </select>
      </div>

      <div className="scheduler-playlist-wrapper">
        {renderSchedulerPlaylist()}
      </div>
    </>
  );
};

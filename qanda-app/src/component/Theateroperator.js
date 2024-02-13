import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/theater.css'; // Ensure the correct path to your CSS file

export const Theateroperator = () => {
  const [schedulerData, setSchedulerData] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');

  useEffect(() => {
    // Fetch scheduler data from the backend API using axios
    axios.get('http://localhost:8010/api/allSchedulerData')
      .then(response => {
        setSchedulerData(response.data);
      })
      .catch(error => {
        console.error('Error fetching scheduler data:', error);
      });
  }, []);


  console.log(schedulerData)
  
  const handlePlayButtonClick = (scheduler) => {
    // Extract video links from the scheduler
    const validVideoLinks = scheduler.video_links
      .filter(videoLink => videoLink && Object.values(videoLink)[0])
      .map(videoLink => Object.values(videoLink)[0]);
  
    // Save valid video links to localStorage
    localStorage.setItem('videoLinks', JSON.stringify(validVideoLinks));
  
    // Redirect to the video player page
    window.location.href = 'video-player'; // Change the path as needed
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
      <div key={scheduler.scheduler_id} className="scheduler-playlist-item">
        <h3>{`Scheduler ${scheduler.scheduler_index} - ${new Date(scheduler.start_date).toDateString()}`}</h3>
        <ul>
          {scheduler.video_links
            .filter(videoLink => videoLink && Object.values(videoLink)[0]) // Filter out null or empty links
            .map((videoLink, index) => (
              <li key={index}>
                <a href={Object.values(videoLink)[0]} target="_blank" rel="noopener noreferrer">
                  {`Video ${index + 1}: View Video`}
                </a>
                <br />
              </li>
            ))}
        </ul>
        <button onClick={() => handlePlayButtonClick(scheduler)}>Play All</button>
      </div>
    ));
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

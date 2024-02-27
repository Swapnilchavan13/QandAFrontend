
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/theater.css'; // Ensure the correct path to your CSS file

export const Theateroperator = () => {
  const [schedulerData, setSchedulerData] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');

  useEffect(() => {
    // Fetch scheduler data from the backend API using axios
    axios.get('http://192.168.0.113:8010/api/allSchedulerData')
      .then(response => {
        setSchedulerData(response.data);

        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching scheduler data:', error);
      });
  }, []);
  
  const handlePlayButtonClick = (scheduler) => {
    console.log("scheduler",scheduler)
    console.log("scheduler.video_links",scheduler.video_links)
    console.log("type of scheduler.video_links",typeof(scheduler.video_links))

   
    var validVideoLinks = scheduler.video_links
      .filter(videoLink => videoLink && Object.values(videoLink)[0])
      .map(videoLink => videoLink && Object.values(videoLink)[0]);

      const myArray = Object.values(validVideoLinks);
    localStorage.setItem('videoLinks', JSON.stringify(myArray));
    window.location.href = 'video-player'; 
  };
  
  const playVideo = (videoUrl) => {
    console.log('Opening video:', videoUrl);
    window.location.href = videoUrl;
  };

  const renderSchedulerPlaylist = () => {
    if (!schedulerData.scheduler || schedulerData.scheduler.length === 0) {
      return <p>No scheduler data available.</p>;
    }
  
    // Flatten the nested arrays
    const flattenedSchedulerData = schedulerData.scheduler.flat();
  
    // Use a Set to eliminate duplicates based on scheduler_id
    const uniqueSchedulers = Array.from(new Set(flattenedSchedulerData.map(scheduler => scheduler.scheduler_id)))
      .map(schedulerId => flattenedSchedulerData.find(scheduler => scheduler.scheduler_id === schedulerId));
  
    return uniqueSchedulers.map((scheduler, index) => (
      <div key={index} className="nested-scheduler-container">
        <div className="scheduler-playlist-item">
          <h3>{`Slot ${scheduler.slot_index} - ${new Date(scheduler.start_date).toDateString()}`}</h3>
          <ul>
            {scheduler.video_links
              .filter(videoLink => videoLink && Object.values(videoLink)[0]) // Filter out null or empty links
              .map((videoLink, videoIndex) => (
                <li key={videoIndex}>
                  <a href={Object.values(videoLink)[0]} target="_blank" rel="noopener noreferrer">
                    {`Video ${videoIndex + 1}: View Video`}
                  </a>
                  <br />
                </li>
              ))}
          </ul>
          <button onClick={() => handlePlayButtonClick(scheduler)}>Play All</button>
        </div>
      </div>
    ));
  };
  
  

  const theaters = [
    { id: 1, name: 'Theater A' },
    { id: 2, name: 'Theater B' },
    { id: 3, name: 'Theater C' },
    { id: 4, name: 'Theater D' },
  ];

  return (
    <>
      <h1>Operator Playlist</h1>
      <div className="scheduler-playlist-wrapper">
        {renderSchedulerPlaylist()}
      </div>
    </>
  );
};
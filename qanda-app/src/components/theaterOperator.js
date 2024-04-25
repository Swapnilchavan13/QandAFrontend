import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/theatre.css';
import config from '../config';
const apiUrl = `${config.apiBaseUrl}`;

export const Theateroperator = () => {
  const [schedulerData, setSchedulerData] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');

  const url = 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4';

  fetch(url, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        const sizeInBytes = parseInt(response.headers.get('content-length'), 10);
        const sizeInMB = sizeInBytes  // Convert bytes to megabytes
        console.log('File size:', sizeInMB.toFixed(2), 'MB');
      } else {
        console.error('Failed to retrieve file size:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error fetching file size:', error);
    });
  

  useEffect(() => { // Fetch scheduler data from the backend API using axios
    axios.get(`${apiUrl}/getSchedulerData`)
      .then(response => {
        setSchedulerData(response.data);
        console.log("Response",response.data)
      })
      .catch(error => {
        console.error('Error fetching scheduler data:', error);
      });
  }, []);

 const handlePlayButtonClick = (scheduler) => { 
  if (scheduler.video_links) {
    var validVideoLinks = scheduler.video_links
      .filter(videoLink => videoLink && Object.values(videoLink)[0])
      .map(videoLink => videoLink && Object.values(videoLink)[0]);
  } else {
    console.error('No video links found for the scheduler');
    return; // Exit the function early if there are no video links
  }

    var validVideoLinks = scheduler.video_links
      .filter(videoLink => videoLink && Object.values(videoLink)[0])
      .map(videoLink => videoLink && Object.values(videoLink)[0]);


      const myArray = Object.values(validVideoLinks);//convert object of values - link to array of links
   
      localStorage.setItem('videoLinks', JSON.stringify(myArray));
  
    // Redirect to the video player page
    window.location.href = 'video-player'; // Change the path as needed
  };
  
  const playVideo = (videoUrl) => {
    console.log('Opening video:', videoUrl);

    // Redirect to the video URL in the same tab
    window.location.href = videoUrl;
  };

  const downloadAllVideos = (videoLinks) => {
    const downloadPath = 'D:/'; // Change the path as needed
    videoLinks.forEach((link, index) => {
      const linkKey = Object.keys(link)[0];
      const linkValue = Object.values(link)[0];
      // Create a temporary anchor element to trigger the download
      const anchor = document.createElement('a');
      anchor.href = linkValue;
      anchor.download = `${linkKey}_${index}`;
      anchor.click();
      // Clean up
      URL.revokeObjectURL(anchor.href);
      anchor.remove();
    });
  };

  const renderSchedulerPlaylist = () => {
    if (!schedulerData || schedulerData.length === 0) {
      return <p>No scheduler data available.</p>;
    }
  
    // Flatten the nested arrays
    const flattenedSchedulerData = schedulerData.schedulerData.flat();
  
    // Use a Set to eliminate duplicates based on scheduler_id
    const uniqueSchedulers = Array.from(new Set(flattenedSchedulerData.map(scheduler => scheduler.id)))
      .map(schedulerId => flattenedSchedulerData.find(scheduler => scheduler.id === schedulerId));
  
    return uniqueSchedulers.map((scheduler, index) => (
      <div key={index} className="nested-scheduler-container">
        <div className="scheduler-playlist-item">
          <h3>{`Slot ${scheduler.slotIndex} - ${new Date(scheduler.startDate).toDateString()}`}</h3>
          <ul>
            {JSON.parse(scheduler.videoLinks)
              .filter(videoLink => videoLink && Object.values(videoLink)[0]) // Filter out null or empty links
              .map((videoLink, videoIndex) => {
                const linkKey = Object.keys(videoLink)[0]; // Get the key of the video link
                const linkValue = Object.values(videoLink)[0]; // Get the value of the video link
                const updatedLinkValue = linkValue.replace('localhost:3001', '192.168.0.118:3001');
                return (
                  <li key={videoIndex}>
                    <a href={updatedLinkValue} target="_blank" rel="noopener noreferrer">
                      {`${linkKey}: ${updatedLinkValue}`}
                    </a>
                    <br />
                  </li>
                );
              })}
          </ul>
          <button onClick={() => handlePlayButtonClick(scheduler)}>Play All</button>
          <button onClick={() => downloadAllVideos(JSON.parse(scheduler.videoLinks))}>Download All</button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <h1>Operator Playlist</h1>
      <div className="scheduler-playlist-wrapper">
        {renderSchedulerPlaylist()}
      </div>
    </>
  );
};

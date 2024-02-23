
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
      })
      .catch(error => {
        console.error('Error fetching scheduler data:', error);
      });
  }, []);


  console.log(schedulerData)
  
  const handlePlayButtonClick = (scheduler) => {
    // Extract video links from the scheduler
    console.log("scheduler",scheduler)
    console.log("scheduler.video_links",scheduler.video_links)
    console.log(" type of scheduler.video_links",typeof(scheduler.video_links))

   
    var validVideoLinks = scheduler.video_links
      .filter(videoLink => videoLink && Object.values(videoLink)[0])
      .map(videoLink => videoLink && Object.values(videoLink)[0]);

      const myArray = Object.values(validVideoLinks);//convert object of values - link to array of links

    // Save valid video links to localStorage
   localStorage.setItem('videoLinks', JSON.stringify(myArray));
  // localStorage.setItem('jsonVideoURLLinks', jsonVideoURLLinks );
  
    // Redirect to the video player page
  window.location.href = 'video-player'; // Change the path as needed*/}
  };
  
  const playVideo = (videoUrl) => {
    console.log('Opening video:', videoUrl);

    // Redirect to the video URL in the same tab
    window.location.href = videoUrl;
  };


  const renderSchedulerPlaylist = () => {
    //console.log("schedulerData",schedulerData)
    if (!Array.isArray(schedulerData) || schedulerData.length === 0) {
      return <p>No scheduler data available.</p>;
    }


    console.log("typeof renderSchedulerPlaylist schedulerData ",typeof(schedulerData));
  
    // Filter schedulerData based on the selected theater
    var filteredSchedulerData = selectedTheater
      ? schedulerData.results.filter(scheduler => scheduler.theater_id === parseInt(selectedTheater, 10))
      : schedulerData;
    console.log("type of filteredSchedulerData.video_links",filteredSchedulerData.video_links)
    
    filteredSchedulerData = (filteredSchedulerData).map(item => {
      return {
          ...item,
          video_links: JSON.parse(item.video_links),
          //videoIDURL: JSON.parse(item.videoIDURL),//copy 2nd array as well
      };
  });

    return filteredSchedulerData.map(scheduler => (
      <div key={scheduler.scheduler_id} className="scheduler-playlist-item">
      <h3>{`Slot ${scheduler.scheduler_index} - ${new Date(scheduler.start_date).toDateString()}`}</h3>
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
      <div className="scheduler-playlist-wrapper">
        {renderSchedulerPlaylist()}
      </div>
    </>
  );
};


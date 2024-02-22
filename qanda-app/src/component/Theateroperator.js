
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/theatre.css'; // Ensure the correct path to your CSS file

{/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/theatre.css'; // Ensure the correct path to your CSS file

export const Theateroperator = () => {
  const [schedulerData, setSchedulerData] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');

  useEffect(() => {
    // Fetch scheduler data from the backend API using axios
    axios.get('http://localhost:8010/api/allSchedulerData')
      .then(response => {
        
        setSchedulerData(response.data);

        console.log("response.data",response.data)
      })
      .catch(error => {
        console.error('Error fetching scheduler data:', error);
      });
  }, []);

  const handlePlayButtonClick = (scheduler) => {
    // Extract video links from the scheduler
    const videoLinks = Object.keys(scheduler)
      .filter(key => key.includes('_link') && scheduler[key])
      .map(key => scheduler[key]);
  
    // Save video links to localStorage
    localStorage.setItem('videoLinks', JSON.stringify(videoLinks));
  
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
};*/}

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
    console.log("scheduler",scheduler)
    console.log("scheduler.video_links",scheduler.video_links)
    console.log(" type of scheduler.video_links",typeof(scheduler.video_links))

   
    var validVideoLinks = scheduler.video_links
      .filter(videoLink => videoLink && Object.values(videoLink)[0])
      .map(videoLink => videoLink && Object.values(videoLink)[0]);


      const myArray = Object.values(validVideoLinks);//convert object of values - link to array of links


      //var validVideoIdUrlLinks = (scheduler.videoIDURL).filter(item => Array.isArray(item) && item.length > 0);

      //const jsonVideoURLLinks = JSON.stringify(validVideoIdUrlLinks);


     // const myArray1 = Object.values(validVideoIdUrlLinks);
     {/*console.log("validVideoLinks",validVideoLinks)
          validVideoLinks = validVideoLinks.map(item => {
              return {
                  ...item,
                  video_links: JSON.parse(item.video_links),
              };   
      });  */}



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
    console.log("type of filteredSchedulerData",typeof(filteredSchedulerData))

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

      {/*<div className='selectt'>
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
          </div>*/}

      <div className="scheduler-playlist-wrapper">
        {renderSchedulerPlaylist()}
      </div>
    </>
  );
};


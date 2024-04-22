// Scheduler.js
import React, { useState, useEffect } from 'react';
import '../styles/scheduler.css'; // Ensure the correct path to your CSS file
import config from '../config';  // Adjust the path accordingly
const apiUrl = `${config.apiBaseUrl}`;

const Scheduler = () => {
  const [videos, setVideos] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState(Array(30).fill(Array(15).fill('')).map(innerArray => [...innerArray]));
  const [startDates, setStartDates] = useState([]);
  const [errors, setErrors] = useState(Array(3).fill(null));
  const [schedulerCount, setSchedulerCount] = useState(3); // State to control the number of schedulers
  const slotLimit = 60; // Slot limit in minutes
  const [urlAndVideoID, setUrlAndVideoID] = useState(Array(30).fill(Array(15).fill({})).map(innerArray => [...innerArray]));
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');

  const[movievideo, setMovieVideo] = useState([])

  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(''); // Define selectedScreen state

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedTheater) {
      // Fetch screen details for the selected theater
      fetch('http://192.168.0.118:8012/getScreenDetails')
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setScreens(data.screenTable);
        })
        .catch(error => {
          console.error('Error fetching screen details:', error);
        });
    }
  }, [selectedTheater]);


  useEffect(() => {
    // Fetch theater details
    fetch('http://192.168.0.118:8012/getTheatreDetails')
      .then(response => response.json())
      .then(data => {
        setTheaters(data.theatreTable);
      
      })
      .catch(error => {
        console.error('Error fetching theater details:', error);
      });
  }, []);


  useEffect(() => {
    if(selectedTheater){
    // Fetch videos from the backend API using fetch
    fetch(`${apiUrl}/allContentData`)
      .then(response => response.json())
      .then(data => {
      // Merge advertisements and movies data
      const mergedVideos = [...data.allContentData.advertisements, ...data.allContentData.movies];
      console.log(mergedVideos);
      setVideos(mergedVideos);
    })
      .catch(error => {
        console.error('Error fetching videos:', error);
      }, [selectedTheater]);

    // Set start dates for the next three days
    const currentDate = new Date();
    const nextDates = Array(schedulerCount).fill().map((_, index) => {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + index);
      return nextDate;
    });
    setStartDates(nextDates);
  }
  }, [schedulerCount, selectedTheater ]); // Include schedulerCount in the dependency array

 // Inside handleVideoChange function
const handleVideoChange = (schedulerIndex, slotIndex, video) => {
  const updatedSchedules = [...selectedSchedules];
  if (video) {
    if (typeof video === 'object') { // If it's a movie object
      updatedSchedules[schedulerIndex][slotIndex] = {
        movieID: video.movieID,
        movieName: video.movieName,
        movieURLPartOne: video.movieURLPartOne,
        movieURLPartTwo: video.movieURLPartTwo
      };
    } else { // If it's an ad video link
      updatedSchedules[schedulerIndex][slotIndex] = video;
    }
  } else {
    updatedSchedules[schedulerIndex][slotIndex] = '';
  }
  setSelectedSchedules(updatedSchedules);
};

  const getTotalDuration = (schedulerIndex) => {
    return selectedSchedules[schedulerIndex].reduce((totalDuration, videoID) => {
      const selectedVideo = videos.find(video => video.videoID === videoID);
      return totalDuration + (selectedVideo ? selectedVideo.DurationInMinutes : 0);
    }, 0);
  };

  const validateSlotLimit = (schedulerIndex) => {
    const totalDuration = getTotalDuration(schedulerIndex);
    if (totalDuration > slotLimit) {
      setErrors(errors => {
        const updatedErrors = [...errors];
        updatedErrors[schedulerIndex] = `Total duration exceeds the slot limit of ${slotLimit} minutes.`;
        return updatedErrors;
      });
    } else {
      setErrors(errors => {
        const updatedErrors = [...errors];
        updatedErrors[schedulerIndex] = null;
        return updatedErrors;
      });
    }
  };

  useEffect(() => {
    selectedSchedules.forEach((_, index) => validateSlotLimit(index));
  }, [selectedSchedules]);

  const getAvailableOptions = (schedulerIndex, slotIndex) => {
    var selectedIds = 0;
    if(selectedSchedules){
      selectedIds = selectedSchedules[schedulerIndex].filter((_, index) => index !== slotIndex);
    }
      return videos.filter(video => !selectedIds.includes(video));
    
  };

// Inside handleSaveClick function
const handleSaveClick = async (schedulerIndex) => {
  const schedulerData = {
    theatre_id: selectedTheater,
    start_date: startDates[schedulerIndex].toISOString().slice(0, 19).replace('T', ' '), // Convert to MySQL datetime format
    slot_index: schedulerIndex + 1,
    screen_id: selectedScreen,
    advertisementIDList: "1,2,3",
    movie_id: 1000,    
    video_links: selectedSchedules[schedulerIndex].map((videoLink, index) => {
      if (typeof videoLink === 'object') {
        // If it's a movie object, construct the movie data
        return {
          movie_id: 1000,
          movieURLPartOne: videoLink.movieURLPartOne,
          movieURLPartTwo: videoLink.movieURLPartTwo
        };
      } else {
        // If it's an ad video link, construct the ad data
        return { adVideoLink: videoLink };
      }
    }),
  };

  try {
    const response = await fetch(`${apiUrl}/saveSchedulerData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schedulerData),
    });
    if (response.ok) {
      const data = await response.json();
      alert('Data saved successfully:', data);
    } else {
      console.error('Error saving data:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }
};


// Adjust the rendering logic in renderDropdowns function
const renderDropdowns = (startDate, schedulerIndex) => {
  return Array(15).fill().map((_, slotIndex) => (
    <div key={slotIndex} className="dropdown-container">
      <label>{`Scheduler ${schedulerIndex + 1} - Slot ${slotIndex + 1}`}</label>
      <select
        value={selectedSchedules[schedulerIndex][slotIndex]?.movieName || selectedSchedules[schedulerIndex][slotIndex]}
        onChange={(e) => handleVideoChange(schedulerIndex, slotIndex, e.target.value)}
      >
        <option value="" disabled>Select a video</option>
        {getAvailableOptions(schedulerIndex, slotIndex).map(video => (
          <option key={video.id || video.movieID} value={video.adVideoLink || video.movieName}>
            {video.adVideoLink ? video.adVideoLink : video.movieName}
          </option>
        ))}
      </select>
    </div>
  ));
};


  // console.log(selectedSchedules)

  const renderSchedulers = () => {
    if (videos.length === 0) {
      return (
        <h1>No data added in the slot page.</h1>
      );
    } else {
        return startDates.map((startDate, index) => (
        <div key={index} className="scheduler-container">
          <h2>{`Slot ${index + 1} - ${startDate.toDateString()}`}</h2>
          <div className="date-picker">
            <label>Date:</label>
            <input type="date" value={startDate.toISOString().split('T')[0]} readOnly />
          </div>
          {renderDropdowns(startDate, index)}
          <button onClick={() => handleSaveClick(index)}>Save</button>
          <p className="slot-limit-info">{`Slot limit: ${slotLimit} minutes`}</p>
          {errors[index] && <p className="error-message">{errors[index]}</p>}
        </div>
      ));
    }
  };

  const renderDropdown = () => {
    return (
      <div>
        <h3>Select The Theatre</h3>
        <select
          className='selecttag'
          value={selectedTheater}
          onChange={(e) => setSelectedTheater(e.target.value)}
        >
          <option value="" disabled>Select a theater</option>
          {theaters.map(theater => (
            <option key={theater.id} value={theater.id}>
              {theater.theatreName}
            </option>
          ))}
        </select>
        <br/>
       
        <h3>Select The Screen</h3>
        <select
         className='selecttag'
          value={selectedScreen}
          onChange={(e) => setSelectedScreen(e.target.value)}
        >
          <option value="" disabled>Select a screen</option>
          {screens.map(screen => (
            <option key={screen.id} value={screen.id}>
              {`Screen ${screen.screenNo}`}
            </option>
          ))}
        </select>


        <br/>
        <label>Number of Slots:</label>
        <select
        className='selecttag'
          value={schedulerCount}
          onChange={(e) => setSchedulerCount(parseInt(e.target.value, 10))}
        >
          {[3, 7, 15, 30].map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <>
      <h1>Slot Content</h1>
      {renderDropdown()}
      <div className="scheduler-wrapper">
        {renderSchedulers()}
      </div>
    </>
  );
};

export default Scheduler;

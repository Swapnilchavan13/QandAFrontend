// Scheduler.js
import React, { useState, useEffect } from 'react';
import '../styles/scheduler.css'; // Ensure the correct path to your CSS file

export const Scheduler = () => {
  const [videos, setVideos] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState(Array(30).fill(Array(15).fill('')).map(innerArray => [...innerArray]));
  const [startDates, setStartDates] = useState([]);
  const [errors, setErrors] = useState(Array(3).fill(null));
  const [schedulerCount, setSchedulerCount] = useState(3); // State to control the number of schedulers
  const slotLimit = 60; // Slot limit in minutes

  const [theaters, setTheaters] = useState([
    { theater_id: 1, theater_name: 'Theater A' },
    { theater_id: 2, theater_name: 'Theater B' },
    { theater_id: 3, theater_name: 'Theater C' },
    { theater_id: 4, theater_name: 'Theater D' },
  ]);

  const [selectedTheater, setSelectedTheater] = useState('');
  const [totalDurations, setTotalDurations] = useState(Array(schedulerCount).fill(0));

 
  useEffect(() => {
    if (selectedTheater) {
      // Fetch videos from the backend API using fetch
      fetch('http://192.168.0.113:8010/api/allVideos')
        .then(response => response.json())
        .then(data => {
          setVideos(data.results);
        })
        .catch(error => {
          console.error('Error fetching videos:', error);
        });

      // Set start dates for the next three days
      const currentDate = new Date();
      const nextDates = Array(schedulerCount).fill().map((_, index) => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + index);
        return nextDate;
      });
      setStartDates(nextDates);
    }
  }, [selectedTheater, schedulerCount]); 
  const handleVideoChange = (schedulerIndex, slotIndex, videoID) => {
    const updatedSchedules = [...selectedSchedules];
    updatedSchedules[schedulerIndex][slotIndex] = videoID;
    setSelectedSchedules(updatedSchedules);
    validateSlotLimit(schedulerIndex); // Trigger validation when a video is added
  };

  const getTotalDurationInMinutes = (schedulerIndex) => {
    return selectedSchedules[schedulerIndex].reduce((totalDuration, videoID) => {
      const selectedVideo = videos.find(video => video.videoURL === videoID);
      const durationInMinutes = selectedVideo ? parseInt(selectedVideo.duration, 10) / 60 : 0;
      return totalDuration + durationInMinutes;
    }, 0).toFixed(2);
  };
  

  const validateSlotLimit = (schedulerIndex) => {
    const totalDuration = getTotalDurationInMinutes(schedulerIndex);
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

    // Update the total duration state
    setTotalDurations(durations => {
      const updatedDurations = [...durations];
      updatedDurations[schedulerIndex] = totalDuration;
      return updatedDurations;
    });
  };

  useEffect(() => {
    selectedSchedules.forEach((_, index) => validateSlotLimit(index));
  }, [selectedSchedules]);

  const getAvailableOptions = (schedulerIndex, slotIndex) => {
    const selectedIds = selectedSchedules[schedulerIndex].filter((_, index) => index !== slotIndex);

    return videos.filter(video => !selectedIds.includes(video));
  };

  // Inside handleSaveClick function
  const handleSaveClick = async (schedulerIndex) => {
    const schedulerData = {
      theater_id: selectedTheater,
      start_date: startDates[schedulerIndex].toISOString().slice(0, 19).replace('T', ' '), // Convert to MySQL datetime format
      scheduler_index: schedulerIndex + 1,
      video_links: selectedSchedules[schedulerIndex].map((videoLink, index) => ({
        [`video_${index + 1}_link`]: videoLink || null,
      })),
      errors: errors[schedulerIndex],
    };

    try {
      const response = await fetch('http://localhost:8010/api/saveSchedulerData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schedulerData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Data saved successfully:', data);

        alert('Data saved successfully:')
      } else {
        console.error('Error saving data:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const renderDropdowns = (startDate, schedulerIndex) => {
    return Array(15).fill().map((_, slotIndex) => (
      <div key={slotIndex} className="dropdown-container">
        <label>{`Scheduler ${schedulerIndex + 1} - Slot ${slotIndex + 1}`}</label>
        <select
          value={selectedSchedules[schedulerIndex][slotIndex]}
          onChange={(e) => handleVideoChange(schedulerIndex, slotIndex, e.target.value)}
        >
          <option value="" disabled>Select a video</option>
          {getAvailableOptions(schedulerIndex, slotIndex).map(video => (
            <option key={video.videoID} value={video.videoURL}>
              {video.videoURL}
            </option>
          ))}
        </select>
      </div>
    ));
  };

  const renderSchedulers = () => {
    // Check if there are videos available
    if (videos.length === 0) {
      return <p>No data added from the upload section.</p>;
    }
  
    return startDates.map((startDate, index) => (
      <div key={index} className="scheduler-container">
        <p className="slot-limit-info">{`Slot limit: ${slotLimit} minutes`}</p>
        <h2>{`Scheduler ${index + 1} - ${startDate.toDateString()}`}</h2>
        <div className="date-picker">
          <label>Date:</label>
          <input type="date" value={startDate.toISOString().split('T')[0]} readOnly />
        </div>
        {renderDropdowns(startDate, index)}
        <div>Total Duration: {totalDurations[index]} minutes</div> {/* Display total duration */}
        <button onClick={() => handleSaveClick(index)}>Save</button>
        {errors[index] && <p className="error-message">{errors[index]}</p>}
      </div>
    ));
  };
  

  const renderDropdown = () => {
    return (
      <div>
        <select
          className='selecttag'
          value={selectedTheater}
          onChange={(e) => setSelectedTheater(e.target.value)}
        >
          <option value="" disabled>Select a theater</option>
          <label>Theater Name:</label>
          {theaters.map(theater => (
            <option key={theater.theater_id} value={theater.theater_id}>
              {theater.theater_name}
            </option>
          ))}
        </select>

        <label>Number of Schedulers:</label>
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
      {selectedTheater && renderSchedulers()}
      </div>
    </>
  );
};

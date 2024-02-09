// Scheduler.js

import React, { useState, useEffect } from 'react';
import '../styles/scheduler.css'; // Ensure the correct path to your CSS file

export const Scheduler = () => {
  const [videos, setVideos] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState(Array(30).fill(Array(15).fill('')).map(innerArray => [...innerArray]));
  const [startDates, setStartDates] = useState([]);
  const [errors, setErrors] = useState(Array(3).fill(null));
  const [alldata, setAlldata] = useState([]);
  const [schedulerCount, setSchedulerCount] = useState(3); // State to control the number of schedulers
  const slotLimit = 60; // Slot limit in minutes

  const [theaters, setTheaters] = useState([
    { theater_id: 1, theater_name: 'Theater A' },
    { theater_id: 2, theater_name: 'Theater B' },
    { theater_id: 3, theater_name: 'Theater C' },
    { theater_id: 4, theater_name: 'Theater D' },

  ]);

  const [selectedTheater, setSelectedTheater] = useState('');

  useEffect(() => {
    // Fetch videos from the backend API using fetch
    fetch('http://localhost:8002/api/allVideos')
      .then(response => response.json())
      .then(data => {
        setVideos(data);
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
  }, [schedulerCount]); // Include schedulerCount in the dependency array

  const handleVideoChange = (schedulerIndex, slotIndex, videoID) => {
    const updatedSchedules = [...selectedSchedules];
    updatedSchedules[schedulerIndex][slotIndex] = videoID;
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
    const selectedIds = selectedSchedules[schedulerIndex].filter((_, index) => index !== slotIndex);

    return videos.filter(video => !selectedIds.includes(video));
  };

  const handleSaveClick = (schedulerIndex) => {
    const schedulerData = {
      startDate: startDates[schedulerIndex],
      selectedVideos: selectedSchedules[schedulerIndex],
      errors: errors[schedulerIndex],
    };

    setAlldata(schedulerData);
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
            <option key={video.video_id} value={video.video_id}>
              {video.video}
            </option>
          ))}
        </select>
      </div>
    ));
  };

  const renderSchedulers = () => {
    return startDates.map((startDate, index) => (
      <div key={index} className="scheduler-container">
        <h2>{`Scheduler ${index + 1} - ${startDate.toDateString()}`}</h2>
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
  };

  const renderDropdown = () => {
    return (
      <div>
         <label>Theater Name:</label>
        <select
          className='selecttag'
          value={selectedTheater}
          onChange={(e) => setSelectedTheater(e.target.value)}
        >
          <option value="" disabled>Select a theater</option>
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
      <h1>Scheduling Content</h1>
      {renderDropdown()}
      <div className="scheduler-wrapper">
        {renderSchedulers()}
      </div>
    </>
  );
};

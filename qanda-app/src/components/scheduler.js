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
  const [selectedDate, setSelectedDate] = useState(Array(schedulerCount).fill(''));

  const [selectedTheater, setSelectedTheater] = useState('');

  const [selectetmovie, setselectetMovie] = useState('');

  const [movievideo, setMovieVideo] = useState([])

  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(''); // Define selectedScreen state

  const [theatreandscreen, setThatreandScreen] = useState([]);

  const [selectedMovieName, setSelectedMovieName] = useState('');
  const [showTimes, setShowTimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState('');


  useEffect(() => {
    if (selectedTheater) {
      // Fetch screen details for the selected theater
      fetch(`http://192.168.0.134:8012/getScreenDetails/${selectedTheater}`)
        .then(response => response.json())
        .then(data => {
          console.log("screen" + data);
          setScreens(data.screenTable);
        })
        .catch(error => {
          console.error('Error fetching screen details:', error);
        });
    }
  }, [selectedTheater]);


  useEffect(() => {
    // Fetch theater details
    fetch('http://192.168.0.134:8012/getTheatreDetails')
      .then(response => response.json())
      .then(data => {
        setTheaters(data.theatreTable);
      
      })
      .catch(error => {
        console.error('Error fetching theater details:', error);
      });
  }, []);


  useEffect(() => {
    if (selectedTheater && selectedScreen) { // Ensure selectedDate is not empty
      const url = `http://62.72.59.146:3005/allocatedatafill?theatreId=${selectedTheater}&selectedscreen=${selectedScreen}&date=${selectedDate[0]}`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log("Data for selected theater, screen, and date:", data);
          setThatreandScreen(data);
          // You can process the data further if needed
        })
        .catch(error => {
          console.error('Error fetching allocated data:', error);
        });
    }
  }, [selectedTheater, selectedScreen]); // Include selectedDate in the dependency array
  

  console.log(theatreandscreen)

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
 console.log(videos)



 const handleVideoChange = (schedulerIndex, slotIndex, video) => {
  const updatedSchedules = [...selectedSchedules];
  console.log(video);
  if (video) {
    if (typeof video === 'object') { // If it's a movie object
      console.log(video.movieID); // Log the movieID
      updatedSchedules[schedulerIndex][slotIndex] = {
        movieID: video.movieID,
        movieName: video.movieName,
        movieURLPartOne: video.movieURLPartOne,
        movieURLPartTwo: video.movieURLPartTwo
      };
    } else { // If it's an ad video link
      // Try to find the movie with the given movieURLPartOne
      const movie = videos.find(movie => movie.movieURLPartOne === video);
      if (movie) {
        setselectetMovie(movie.movieID); // Set the movieID if found
        updatedSchedules[schedulerIndex][slotIndex] = video;
      } else {
        console.log("Movie not found with the provided URL.");
        // Pass the video URL as is
        updatedSchedules[schedulerIndex][slotIndex] = video;
      }
    }
  } else {
    updatedSchedules[schedulerIndex][slotIndex] = '';
  }
  setSelectedSchedules(updatedSchedules);
};

console.log(selectedSchedules);

  const getTotalDuration = (schedulerIndex) => {
    return selectedSchedules[0].reduce((totalDuration, videoID) => {
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
      selectedIds = selectedSchedules[0].filter((_, index) => index !== slotIndex);
    }
      return videos.filter(video => !selectedIds.includes(video));
  };

 console.log(selectetmovie)

 function convertTimeToHHMMSS(timeString) {
  const [hoursMinutes, meridiem] = timeString.split(' '); // Split the time string into hours:minutes and meridiem (AM/PM)
  let [hours, minutes] = hoursMinutes.split(':').map(Number); // Extract hours and minutes as numbers
  
  // Adjust hours for PM time
  if (meridiem === 'PM' && hours !== 12) {
      hours += 12;
  }
  
  // Convert to HH:MM:SS format
  const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:00`;
  
  return formattedTime;
}

// Inside handleSaveClick function
const handleSaveClick = async (schedulerIndex) => {
  const schedulerData = {
    theatre_id: selectedTheater,
    premiereDate: startDates[schedulerIndex].toISOString().slice(0, 19).replace('T', ' '), // Convert to MySQL datetime format
    slot_index: schedulerIndex + 1,
    screen_id: selectedScreen,
    advertisementIDList: "1,2,3",
    movie_id: selectetmovie,  // Assign the movieID to movie_id
    premiereTime: convertTimeToHHMMSS(selectedShowtime),
    
    video_links: selectedSchedules[0].map((videoLink, index) => {
      if (typeof videoLink === 'object') {
        // If it's a movie object, construct the movie data
        return {
          movieURLPartOne: videoLink.movieURLPartOne,
          movieURLPartTwo: videoLink.movieURLPartTwo
        };
      } else {
        // If it's an ad video link, construct the ad data
        return { Videolink: videoLink };
      }
    }),
  };

  console.log(schedulerData);

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
  const datesFromData = new Set(); // Create a Set to store unique dates

  theatreandscreen.forEach(item => {
    datesFromData.add(item.date);
  });

  function convertDateFormat(dateString) {
    // Parse the original date string
    const originalDate = new Date(dateString);
    
    // Get the month, day, and year
    const month = originalDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
    const day = originalDate.getDate();
    const year = originalDate.getFullYear();
    
    // Construct the new date string in "M/D/YYYY" format
    const newDateString = `${month}/${day}/${year}`;
    
    return newDateString;
}


console.log(theatreandscreen)

  // Filter theatreandscreen data based on the selected date
  const selectedDateData = theatreandscreen.find(item => item.date === selectedDate[schedulerIndex]);
  const movieDataForDate = selectedDateData ? selectedDateData.movieData : null;

  // Display showtimes for the selected date
  const showTimes = movieDataForDate ? Object.values(movieDataForDate[selectedMovieName] || {}) : [];

  return Array(15).fill().map((_, slotIndex) => {

    // Check if the slot belongs to the selected date
    const slotDate = new Date(startDate);

    slotDate.setDate(slotDate.getDate() + schedulerIndex);

    const convertedDateString = convertDateFormat(slotDate.toDateString());


console.log(selectedShowtime); 
console.log(convertedDateString); 




    if (selectedDate.undefined === convertedDateString) {
      return (
        <div key={slotIndex} className="dropdown-container">
          <label>{`Scheduler ${schedulerIndex + 1} - Slot ${slotIndex + 1}`}</label>

          <select
            value={selectedSchedules[schedulerIndex][slotIndex]?.movieName || selectedSchedules[schedulerIndex][slotIndex]}
            onChange={(e) => handleVideoChange(schedulerIndex, slotIndex, e.target.value)}
          >
            <option value="" disabled>Select a video</option>
            {getAvailableOptions(schedulerIndex, slotIndex).map(video => {
              const value = video.adVideoLink || video.movieURLPartOne;
              const optionOneText = video.adVideoLink ? `AD - ${video.adVideoLink}` : video.movieURLPartOne;
              let optionTwoText = "No Part Two";
              if (video.movieURLPartTwo) {
                const movieNamePartTwo = video.movieName || ""; // Movie name part two if available
                optionTwoText = `${movieNamePartTwo} - Part 2`;
              }

              return (
                <React.Fragment key={video.id || video.movieID}>
                  <option value={value}>
                    {video.adVideoLink ? optionOneText : `${video.movieName || ""} - Part 1`}
                  </option>
                  {video.movieURLPartTwo && (
                    <option value={video.movieURLPartTwo}>
                      {optionTwoText}
                    </option>
                  )}
                </React.Fragment>
              );
            })}
          </select>
        </div>
      );
    } else {
      return null; // Render nothing if the slot date doesn't match the selected date
    }
  });
};


  // console.log(selectedSchedules)

  const renderSchedulers = () => {

    function convertDate(dateString) {
      const date = new Date(dateString);
      const month = date.getMonth() + 1; // Adding 1 because months are zero-indexed
      const day = date.getDate();
      const year = date.getFullYear();
      
      return `${month}/${day}/${year}`;
  }

    function convertDateFormat(dateString) {
      // Parse the original date string
      const originalDate = new Date(dateString);
      
      // Get the month, day, and year
      const month = originalDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
      const day = originalDate.getDate();
      const year = originalDate.getFullYear();
      
      // Construct the new date string in "M/D/YYYY" format
      const newDateString = `${month}/${day}/${year}`;
      
      return newDateString;
  }

    if (videos.length === 0) {
      return (
        <h1>No data added in the slot page.</h1>
      );
    } else {
      return theatreandscreen.map((theatreAndScreenData, index) => {
        const startDate = new Date(theatreAndScreenData.date);
        const convertedDateString = convertDateFormat(startDate.toDateString());
        const converted = convertDate(selectedDate.undefined);


        // console.log(converted, convertedDateString)

  
        if (converted === convertedDateString) {
          return (
            <div key={index} className="scheduler-container">
              <h2>{`Slot ${index + 1} - ${startDate.toDateString()}`}</h2>
              <p>Selected Movie: {selectedMovieName}</p>
              <p>Showtime: {selectedShowtime}</p>
              <p>Show Date: {selectedDate.undefined}</p>
  
              {renderDropdowns(startDate, 0)}
              {/* Display selected movie and showtime */}
              <button onClick={() => handleSaveClick(index)}>Save</button>
              <p className="slot-limit-info">{`Slot limit: ${slotLimit} minutes`}</p>
              {errors[index] && <p className="error-message">{errors[index]}</p>}
            </div>
          );
        } else {
          return null; // Render nothing if the selected date doesn't match the scheduler date
        }
      });
    }
  };
  
  


  const renderDropdown = (schedulerIndex) => {

    const datesFromData = new Set();
    theatreandscreen.forEach(item => {
      datesFromData.add(item.date);
    });

    const handleMovieNameChange = (event) => {
      const selectedMovie = event.target.value;
      setSelectedMovieName(selectedMovie);
    
      // Find the movie data for the selected date
      const movieDataForDate = theatreandscreen.find(item => item.date === selectedDate[schedulerIndex])?.movieData;
    

      console.log()
      if (movieDataForDate) {
        // Set the selected showtime to the first showtime available for the selected movie
        setSelectedShowtime(movieDataForDate[selectedMovie][0]);
        // Set the showtimes for the selected movie
        setShowTimes(movieDataForDate[selectedMovie].map((part, index) => part));
      } else {
        setSelectedShowtime('');
        setShowTimes([]);
      }
    };
    
    const handleShowChange = (event) => {
      setSelectedShowtime(event.target.value);
    };

    const handleDateChange = (schedulerIndex, date) => {
      const updatedSelectedDates = [...selectedDate];
      updatedSelectedDates[schedulerIndex] = date || ''; // Set an empty string if no date is selected
      setSelectedDate(updatedSelectedDates);
    };
    

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
        <br />
        <h3>Select The Screen</h3>
        <select
          className='selecttag'
          value={selectedScreen}
          onChange={(e) => setSelectedScreen(e.target.value)}
        >
          <option value="" disabled>Select a screen</option>
          {screens.map(screen => (
            <option key={screen.id} value={screen.screenNo}>
              {`Screen ${screen.screenNo}`}
            </option>
          ))}
        </select>
        <h3>Select a Date</h3>
        <select
  className='selecttag'
  value={selectedDate[schedulerIndex] || ''} // Initialize with an empty string
  onChange={(e) => handleDateChange(schedulerIndex, e.target.value)}
>
  <option value="">Select a date</option>
  {Array.from(datesFromData).map(date => (
    <option key={date} value={date}>
      {date}
    </option>
  ))}
</select>


        {selectedDate[schedulerIndex] && (
          <>
            <label>Select Movie:</label>
            <select 
             className='selecttag'
            value={selectedMovieName} onChange={handleMovieNameChange}>
              <option value="">Select a movie</option>
              {Object.keys(theatreandscreen.find(item => item.date === selectedDate[schedulerIndex])?.movieData || {}).map(movieName => (
                <option key={movieName} value={movieName}>
                  {movieName}
                </option>
              ))}
            </select>
           {selectedMovieName && (
  <div>
    <label>Select Show Time:</label>
    <select  
      className='selecttag'
      value={selectedShowtime} 
      onChange={handleShowChange}
    >
      <option value="">Select a show time</option>
      {showTimes.map(showTime => (
        <option key={showTime} value={showTime}>
          {showTime}
        </option>
      ))}
    </select>
  </div>
)}

          </>
        )}
        {/* <label>Number of Slots:</label>
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
        </select> */}
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

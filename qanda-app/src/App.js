import React, { useState, useEffect } from 'react';

function App() {
  const [currentVideo, setCurrentVideo] = useState({});
  const [response, setResponse] = useState({
    Date_time: new Date(),
    card_id: 'user_card_id', // Replace with actual card ID
    option_selected: null,
    image_name: null,
    question_id: null,
  });

  const fetchCurrentVideo = async () => {
    const response = await fetch('http://localhost:8001/api/current-video');
    const data = await response.json();
    setCurrentVideo(data);
  };

  useEffect(() => {
    fetchCurrentVideo();
  }, [response]);

  const handleOptionClick = async (selectedOption) => {
    // Use the callback function to get the latest state
    setResponse(prevResponse => ({
      ...prevResponse,
      option_selected: selectedOption,
      image_name: currentVideo.image,
      question_id: currentVideo.question_id,
    }));

    // Send the response to the server
    await fetch('http://localhost:8001/api/response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response), // Use the updated response state
    });

    // Fetch the next video after sending the response
    await fetchCurrentVideo();
  };

  return (
    <div>
      <h1>Current Video</h1>
      <p>Q. {currentVideo.video_id}</p>
      <p>{currentVideo.question}</p>
      {currentVideo.options &&
        Object.entries(currentVideo.options).map(([key, value]) => (
          <button key={key} onClick={() => handleOptionClick(value)}>
            {value}
          </button>
        ))}
    </div>
  );
}

export default App;

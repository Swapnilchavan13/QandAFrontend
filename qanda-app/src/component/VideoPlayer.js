import React, { useState, useRef, useEffect } from 'react';

export const VideoPlayer = () => {
  const [videoLinks, setVideoLinks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoID, setVideoID] = useState(null); // Added state to store videoID
  const videoRef = useRef(null);

  useEffect(() => {
    // Retrieve video links from localStorage
    const storedVideoLinks = JSON.parse(localStorage.getItem('videoLinks'));

    if (storedVideoLinks && storedVideoLinks.length > 0) {
      setVideoLinks(storedVideoLinks);
    }
  }, []);

  useEffect(() => {
    // Update the video source when currentIndex changes
    if (videoRef.current) {
      videoRef.current.src = videoLinks[currentIndex];
      videoRef.current.load(); // Reload the video element

    }
  }, [currentIndex, videoLinks]);

     // Fetch video data from API and compare with the current video URL
     fetch('http://192.168.0.113:8010/api/allVideos')
     .then(response => response.json())
     .then(data => {
       console.log(data.results)
       const matchingVideo = data.results.find(video => video.videoURL == videoLinks[currentIndex]);
       if (matchingVideo) {
         setVideoID(matchingVideo.videoID);
       } else {
         setVideoID(null);
       }
     })
     .catch(error => {
       console.error('Error fetching video data:', error);
     });
 

  const handleVideoEnded = () => {
    // Check if the current index is less than the length before incrementing
    if (currentIndex < videoLinks.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div>
      <h1>Video Player</h1>
      {videoLinks.length > 0 && (
        <div>
          <h1>video src link : {videoLinks[currentIndex]}</h1>
          <h2>Video ID: {videoID}</h2>
          <video
            id="videoElement"
            width="1240"
            height="660"
            autoPlay
            controls
            onEnded={handleVideoEnded}
            src={`http://192.168.0.113:3000${videoLinks[currentIndex]}`}></video>
        </div>
      )}
    </div>
  );
};

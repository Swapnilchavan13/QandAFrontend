// // App.js
// import React from 'react';
// import useVideoController from './controller';

// import './App.css';

// function App() {
//   const {
//     videos,
//     currentVideoIndex,
//     currentTime,
//     isPlaying,
//     videoRef,
//     fetchAllVideos,
//     handleVideoChange,
//     handleTimeUpdate,
//     getCurrentTime,
//     handlePlay,
//     handlePause,
//     savePlaybackPosition,
//   } = useVideoController();

//   return (
//     <div className='maindiv'>
//       <h1>All Videos</h1>

//       <h1>Current Video</h1>
//       <video
//         ref={videoRef}
//         src={videos[currentVideoIndex]?.video}
//         controls
//         onPlay={handlePlay}
//         onPause={handlePause}
//       />
//       <div>
//       <div>
//         <p>Elapsed Time: {formatTime(Math.floor(currentTime))}</p>
//         <button style={{display:"none"}} onClick={getCurrentTime}>
//           Get Current Time
//         </button>
//       </div>
      
//       {videos.map((video) => (
//   <button key={video.video_id} onClick={() => handleVideoChange(video.video_id)}>
//     {video.video_id} Video
//   </button>
// ))}

//     </div>
//     </div>
//   );
// }

// const formatTime = seconds => {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
// };

// export default App;


// App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Scheduler  from './component/Scheduler';
import { Theateroperator } from './component/Theateroperator';
import  Addvideodata  from './component/Addvideodata';
import { Navbar } from './component/Navbar';
import { VideoPlayer } from './component/VideoPlayer';
import { UserResponse } from './component/UserResponce';

function App() {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(1); // Set initial video ID

  const videoRef = useRef();
  const currentTimeButtonRef = useRef(null);
  const parentURL = 'D:/qandabackend/QandA-main';

  const fetchAllVideos = async () => {
    try {
      const response = await fetch('http://192.168.0.113:8010/allVideos');
      const data = await response.json();
      console.log("data",data.videos)
      setVideos(data.videos);
    } catch (error) {
      console.error('Error fetching all videos', error);
    }
  };
  
  const fetchCurrentVideo = async (videoID) => {
    try {
      const response = await fetch('http://192.168.0.113:8010/currentVideo/'+videoID);
      console.log(videoID)
      const data = await response.json();
      setCurrentTime(data.currentTime);
      setIsPlaying(data.state === 'true');
    } catch (error) {
      console.error('Error fetching current video', error);
    }
  };
  const handleVideoChange = (videoId) => {
    console.log("videoId",videoId)
    const newIndex = videos.findIndex(video => video.video_id === videoId);
    console.log("newIndex",newIndex)
   // if (newIndex > -1) {
      setCurrentVideoIndex(newIndex);
      setIsPlaying(false);
      setCurrentVideoID(videoId);

      const currentVideo = videos[newIndex];
      setCurrentTime(currentVideo?.currentTime || 0);

      // Update video pointer
      if (videoRef.current) {
        videoRef.current.currentTime = currentVideo?.currentTime || 0;
      }

      savePlaybackPosition();
       // }
  };

  const handleTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    setCurrentTime(currentTime <= duration ? currentTime : duration);
  };

  const getCurrentTime = () => {
    const currentVideo = videos.find(video => video.video_id === currentVideoIndex + 1);
    if (currentVideo) {
      setCurrentTime(currentVideo.currentTime);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };


  const handlePause = () => {

    setIsPlaying(false);
    fetch('http://localhost:8010/api/current-video')
      .then(response => response.json())
      .then(data => {
        fetch('http://localhost:8010/api/update-video-state', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            video_id: videos[currentVideoIndex]?.video_id,
            state: 'false',
            currentTime: videoRef.current.currentTime,
          }),
        })
        .then(response => response.json())
        .then(result => {
          console.log('Video state updated successfully:', result);
        })
        .catch(error => {
          console.error('Error updating video state:', error);

        });
      })
      .catch(error => {
        console.error('Error fetching current video:', error);
      });
  };

  
  const savePlaybackPosition = () => {
    if (currentVideoIndex !== undefined && videos[currentVideoIndex]) {
      localStorage.setItem(`video_${videos[currentVideoIndex].video_id}`, JSON.stringify({ currentTime, isPlaying }));



    }
  };

  useEffect(() => {
    fetchAllVideos();
  }, [currentVideoIndex]);
  useEffect(() => {
    var numberr = parseInt(currentVideoIndex+1);
    fetchCurrentVideo(numberr);
  }, [currentVideoIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [videoRef]); 

  // Additional useEffect to handle initial setup
  useEffect(() => {
    if (videos.length > 0) {

      setCurrentTime(videos[currentVideoIndex]?.currentTime || 0);
    }
  }, [videos, currentVideoIndex]);

  const handleNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    handleVideoChange(videos[nextIndex].videoID);
  };
  const handlePreviousVideo = () => {
    const previousIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    handleVideoChange(videos[previousIndex].videoID);
  }

 
  return (
<>
{/* <Scheduler /> */}

<BrowserRouter>
<Navbar />
      <Routes>
          <Route path="addvideodata" element={<Addvideodata />} />   
          <Route path="scheduler" element={<Scheduler />} />
          <Route path="theateroperator" element={<Theateroperator />} />
          <Route path="video-player" element={<VideoPlayer />} />
          <Route path="userresponse" element={<UserResponse />} />

      </Routes>
    </BrowserRouter>
</>

//     <div className='maindiv'>
//       <h1>All Videos</h1>

//       <h1>Current Video</h1>

//       <video
//         ref={videoRef}
//         //src={fetchCurrentVideo(currentVideoID)}
//         src={`http://192.168.0.113:8010/currentVideo/${currentVideoID}`}
//         controls
//         autoPlay
//         onPlay={handlePlay}
//         onPause={handlePause}
//         onEnded={handleNextVideo} // Automatically play the next video when the current video ends

//       />
//      {/* <h1>{currentVideoID}</h1> */}
//       <div>
//       <div>
        
//         <button style={{display:"none"}} ref={currentTimeButtonRef} onClick={getCurrentTime}>
//           Get Current Time
//         </button>
//       </div>

//       <div>
//         <button onClick={handlePreviousVideo}>Previous Video</button>
//         <button onClick={handleNextVideo}>Next Video</button>
//       </div>
     
//       {videos.map((video) => (
//   <button key={video.videoID} onClick={() => handleVideoChange(video.videoID)}>
//     {video.videoID} Video
//      </button>
// ))}
//     </div>
//   </div>
  );
}

// const formatTime = seconds => {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
// };

export default App;

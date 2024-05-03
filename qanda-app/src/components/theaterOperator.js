import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/theatre.css';
import config from '../config';
const apiUrl = `${config.apiBaseUrl}`;

export const Theateroperator = () => {
  const [schedulerData, setSchedulerData] = useState([ 
    {
        "id": 12,
        "theatreID": 3,
        "screenID": 1,
        "startDate": "2024-04-27T12:06:33.000Z",
        "slotIndex": 1,
        "videoLinks": "[{\"Videolink\":\"ElephantsDream.mp4\"},{\"Videolink\":\"BigBuckBunny.mp4\"},{\"Videolink\":\"BigBuckBunny.mp4\"},{\"Videolink\":\"ElephantsDream.mp4\"},{\"Videolink\":\"ForBiggerBlazes.mp4\"},{\"Videolink\":\"\"},{\"Videolink\":\"\"},{\"Videolink\":\"\"},{\"Videolink\":\"\"},{\"Videolink\":\"\"},{\"Videolink\":\"\"},{\"Videolink\":\"\"},{\"Videolink\":\"\"},{\"Videolink\":\"\"},{\"Videolink\":\"\"}]",
        "movieID": 1000,
        "advertisementIDList": "1,2,3",
        "isDeleted": 0
    }
]);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [downloadInitiate, setDownloadInitiate] = useState('');
  const [downloadPlaylist, setDownloadPlaylist] = useState();
  const [localParentFolderURL, setLocalParentFolderURL] = useState('');
  const [liveParentFolderURL, setLiveParentFolderURL] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'localParentFolderURL') {
      setLocalParentFolderURL(value);
    } else if (name === 'liveParentFolderURL') {
      setLiveParentFolderURL(value);
    }
  }
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

  const handlePlayButtonClick = (scheduler) => { // Extract video links from the scheduler
    console.log("scheduler",scheduler)
    console.log("scheduler.video_links",JSON.parse(scheduler.videoLinks))
    console.log(" type of scheduler.video_links",typeof(scheduler.videoLinks))
    if(scheduler.videoLinks){
    var validVideoLinks = (JSON.parse(scheduler.video_links))
      .filter(videoLink => videoLink && Object.values(videoLink)[0])
      .map(videoLink => videoLink && Object.values(videoLink)[0]);
    console.log("validVideoLinks",validVideoLinks)
    }
    else{
      console.log("UNDEF")
    }
      const myArray = Object.values(validVideoLinks);//convert object of values - link to array of links

   localStorage.setItem('videoLinks', JSON.stringify(myArray));
  
    // Redirect to the video player page
  window.location.href = 'video-player'; // Change the path as needed*/}
  };

const downloadAllVideos = (videoObject) => {
    const startDate = videoObject.startDate.replace(/[^\w\s]/gi, '');
    const downloadPath = `D:\\streesocial_new_LIVE01042024\\STREESOCIAL_FRONTEND\\public\\videos\\`; 
    const jsonData = JSON.parse(videoObject.videoLinks);
    const filteredData = jsonData.filter(item => item.Videolink !== "" && item.Videolink !== null);

    (filteredData).forEach((link, index) => {
        const linkKey = Object.keys(link)[0];
        const linkValue = Object.values(link)[0];
        console.log("linkValue",linkValue)
        const parts = linkValue.split('/'); // Split the URL by '/'
        const fileName = parts[parts.length - 1]; // Get the last part (file name)
        console.log("fileName",fileName)
        axios.get(`${apiUrl}/getFileDownloadOption`, {
          params: {
              videoURL: fileName,
              liveFileServerURL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/',
              localFileParentURL: downloadPath,
          }
      })
      .then((response) => {
        console.log(response)
        if(response.ok){
          setDownloadInitiate(response.data.download);
        }
      });     
  });

  axios.post(`${apiUrl}/createPlaylistTextFile`, {// Make a POST request to the server to create the text file
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: { videoLinks: JSON.parse(videoObject.videoLinks),
            localFileParentURL : downloadPath,
            playlistFileName: `${startDate}_ID_playlist`, },
})
.then(response => {
    if (response.ok) {
      setDownloadPlaylist(response.data.playlist)
    } else {
        throw new Error('Failed to create playlist text file');
    }
})
.then(data => {
  console.log(data.message); 
})
.catch(error => {
    console.error('Error:', error);
});
alert("Download : ",downloadInitiate, "Text file: ",downloadPlaylist );
};

const downloadFile = (downloadPath, linkKey, linkValue, index) => {
        // console.log("downloadFile initiated")
        // const anchor = document.createElement('a');// File exists, initiate download
        // anchor.href = linkValue;
        // anchor.download = `${downloadPath}/${linkKey}_${index}`;
        // anchor.click();
        // URL.revokeObjectURL(anchor.href);
        // anchor.remove();
        // console.log("downloadFile complete")
 };
  
  const playVideo = (videoUrl) => {
    console.log('Opening video:', videoUrl);

    // Redirect to the video URL in the same tab
    window.location.href = videoUrl;
  };


  const renderSchedulerPlaylist = () => {

    if (!schedulerData || schedulerData.length === 0) {
      return <p>No scheduler data available.</p>;
    }  
    //swapnil code eliminate duplicate data
    // Flatten the nested arrays
    // const flattenedSchedulerData = schedulerData.schedulerDetails.flat();

    // Use a Set to eliminate duplicates based on scheduler_id
    const uniqueSchedulers = Array.from(new Set(schedulerData.map(scheduler => scheduler.id)))
      .map(schedulerId => schedulerData.find(scheduler => scheduler.id === schedulerId));

      console.log("uniqueSchedulers",uniqueSchedulers);
      console.log("type of data",typeof(uniqueSchedulers[0].videoLinks))
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
            return (
              <li key={videoIndex}>
                <a href={linkValue} target="_blank" rel="noopener noreferrer">
                  {`${linkKey}: ${linkValue}`}
                </a>
                <br/>
              </li>
            );
          })}
        </ul>
        {/* <button onClick={() => handlePlayButtonClick(scheduler)}>Play All</button> */}
        {/* <button>Play All</button> */}
        <button onClick={() => downloadAllVideos(scheduler)}>Download All</button>
      </div>
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
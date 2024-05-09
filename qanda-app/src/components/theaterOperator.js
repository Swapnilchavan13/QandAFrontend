import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/theatre.css';
import config from '../config';
const apiUrl = `${config.apiBaseUrl}`;
const apiUrl2 = `${config.apiBaseUrl2}`;


export const Theateroperator = () => {
  const [schedulerData, setSchedulerData] = useState([]);
  const [downloadInitiate, setDownloadInitiate] = useState('');
  const [downloadPlaylist, setDownloadPlaylist] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0); // State to track download progress

  useEffect(() => {
    axios.get(`${apiUrl}/getSchedulerData`)
      .then(response => {
        setSchedulerData(response.data);
      })
      .catch(error => {
        console.error('Error fetching scheduler data:', error);
      });
  }, []);

  const downloadAllVideos = (videoObject) => {
    const startDate = videoObject.startDate.replace(/[^\w\s]/gi, '');
    const downloadPath = `D:\\1Play\\videos\\`;
    const jsonData = JSON.parse(videoObject.videoLinks);
    const filteredData = jsonData.filter(item => item.Videolink !== "" && item.Videolink !== null);
    const totalVideos = filteredData.length; // Total number of videos to download
    let completedDownloads = 0; // Counter for completed downloads

    filteredData.forEach((link, index) => {
      const linkValue = Object.values(link)[0];
      const parts = linkValue.split('/');
      const fileName = parts[parts.length - 1];

      axios.get(`${apiUrl}/getFileDownloadOption`, {
        params: {
          videoURL: fileName,
          liveFileServerURL: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/',
          localFileParentURL: downloadPath,
        }
      })
      .then((response) => {
        if (response.ok) {
          completedDownloads++;
          const progress = Math.round((completedDownloads / totalVideos) * 100); // Calculate progress percentage
          setDownloadProgress(progress); // Update progress state
        }
      });
    });

    axios.post(`${apiUrl}/createPlaylistTextFile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        videoLinks: JSON.parse(videoObject.videoLinks),
        localFileParentURL: downloadPath,
        playlistFileName: `${startDate}_ID_playlist`,
      },
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

    alert("Download: ", downloadInitiate, "Text file: ", downloadPlaylist);
  };

  return (
    <>
      <h1>Operator Playlist</h1>

      <div className="scheduler-playlist-wrapper">
        {schedulerData.map((scheduler, index) => (
          <div key={index} className="nested-scheduler-container">
            <div className="scheduler-playlist-item">
              <h3>{`Slot ${scheduler.slotIndex} - ${new Date(scheduler.startDate).toDateString()}`}</h3>
              <button onClick={() => downloadAllVideos(scheduler)}>Download All</button>
              <p>{`Download Progress: ${downloadProgress}%`}</p> {/* Display download progress */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

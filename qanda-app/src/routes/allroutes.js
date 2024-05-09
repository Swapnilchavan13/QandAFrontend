import React from 'react';
import {Routes, Route } from "react-router-dom";
import Scheduler from '../components/scheduler.js';
import { Theateroperator } from '../components/theaterOperator.js';
import { VideoPlayer } from '../components/videoPlayer.js';
import UploadForm from '../components/videoUploadForm.js';
import { UserResponse } from '../components/userResponse.js';
import { MovieTable } from '../components/movieTable.js';
import { AdvertiseTable } from '../components/advertiseTable.js';
import { LocalPlaylist } from '../components/localPlaylist.js';
import ClickerAssignForm from '../components/ClickerAssignForm.js';
// import RegistrationForm from './components/registartionForm.js';

export const Allroutes = () => {

  return (
    <div>
      <Routes>
          <Route path="uploadform" element={<UploadForm/>} />   
          <Route path="movietable" element={<MovieTable/>} />   
          <Route path="advertisetable" element={<AdvertiseTable/>} />   
          <Route path="scheduler" element={<Scheduler />} />
          <Route path="theateroperator" element={<Theateroperator />} />
          <Route path="video-player" element={<VideoPlayer />} />
          <Route path="userResponse" element={<UserResponse />} />
          <Route path="localplaylist" element={<LocalPlaylist/>} />
           <Route path="clickerassign" element={<ClickerAssignForm />} /> 
      </Routes>


    </div>
  )
}

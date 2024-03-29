// App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Scheduler from './components/scheduler.js';
import { Navbar } from './components/navbar.js';
import { Theateroperator } from './components/theaterOperator.js';
import { VideoPlayer } from './components/videoPlayer.js';
import UploadForm from './components/videoUploadForm.js';
import { UserResponse } from './components/userResponse.js';
import { Demo } from './components/demo.js';
import RegistrationForm from './components/registartionForm.js';

function App() {
  
  return (
    <div className='maindiv'>
      <BrowserRouter>
      <Navbar />
      <Routes>
      <Route path="" element={<Demo />} />   

          <Route path="uploadform" element={<UploadForm />} />   
          <Route path="scheduler" element={<Scheduler />} />
          <Route path="theateroperator" element={<Theateroperator />} />
          <Route path="video-player" element={<VideoPlayer />} />
          <Route path="userResponse" element={<UserResponse />} />
          <Route path="register" element={<RegistrationForm />} />
      </Routes>
    </BrowserRouter>

    </div>
  );
}


export default App;

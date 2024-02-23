// App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Scheduler  from './component/Scheduler';
import { Theateroperator } from './component/Theateroperator';
import  Addvideodata  from './component/Addvideodata';
import { Navbar } from './component/Navbar';
import { VideoPlayer } from './component/VideoPlayer';
import { UserResponse } from './component/UserResponce';

function App() { 
  return (
<>
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

   );
}


export default App;

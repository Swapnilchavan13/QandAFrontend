import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/navbar';
import  { Allroutes } from './routes/allroutes';

function App() {
  return (
    <div className="saindiv">
      <BrowserRouter>
        <Navbar />
        <Allroutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
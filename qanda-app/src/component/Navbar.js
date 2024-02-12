import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

export const Navbar = () => {
  return (
    <div className="navbar">
      <Link to='addvideodata'>
        <h3>Add Videos</h3>
      </Link>
      <Link to='scheduler'>
        <h3>Schedule Playlist</h3>
      </Link>
      <Link to="theateroperator">
        <h3>See Playlist</h3>
      </Link>
    </div>
  );
};

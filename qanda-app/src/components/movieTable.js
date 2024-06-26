import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const MovieTable = () => {
  const [movieData, setMovieData] = useState([    {
    "movieID": 1000,
    "movieName": "abc movie",
    "movieDesc": "desc",
    "movieURLPartOne": "BigBuckBunny.mp4",
    "movieURLPartOneSize": 150,
    "movieURLPartTwo": "ElephantsDream.mp4",
    "movieURLPartTwoSize": 161,
    "movieRuntime": 12,
    "intervalTime": 12,
    "productionHouse": "abc house",
    "dateTime": "2024-04-22T13:38:25.000Z",
    "startDate": "2024-04-27T00:00:00.000Z",
    "endDate": "2024-04-27T00:00:00.000Z",
    "posterImage": {
        "type": "Buffer",
        "data": []
    },
    "displayToggle": 0,
    "userResponseToggle": 1,
    "isDeleted": 0,
    "isExpired": 0,
    "createdAt": "2024-04-22T13:38:25.000Z",
    "updatedAt": "2024-04-22T13:38:25.000Z"
}]);
  const [editedMovie, setEditedMovie] = useState(null);

  const formatDate = date => {
    return new Date(date).toISOString().split('T')[0];
  };

  // Function to fetch movie data from the backend API
  const fetchMovieData = async () => {
    try {
      const response = await axios.get('http://192.168.0.117:8012/getMovieDetails');
      setMovieData(response.data.movieData.flat());
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  // Fetch movie data on component mount
  useEffect(() => {
    fetchMovieData();
  }, []);

  // Function to handle editing movie details
  const handleEditMovie = async (id, updatedMovieDetails) => {
    try {
      const response = await axios.put(`http://192.168.0.117:8012/updateMovieDetails/${id}`, updatedMovieDetails);
      // Update the movie data with the edited movie
      setMovieData(prevMovieData => {
        return prevMovieData.map(movie => {
          if (movie.movieID === id) {
            return { ...movie, ...updatedMovieDetails };
          }
          return movie;
        });
      });
      // Clear the editedMovie state
      setEditedMovie(null);
    } catch (error) {
      console.error('Error updating movie data:', error);
    }
  };

  // Function to handle deleting a movie
  const handleDeleteMovie = async (id) => {
    try {
      const response = await axios.delete(`http://192.168.0.117:8012/deleteMovieDetails/${id}`);
      // Filter out the deleted movie from the movieData state
      setMovieData(prevMovieData => prevMovieData.filter(movie => movie.movieID !== id));
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  // Function to handle input change for editing movie details
  const handleInputChange = (e, key) => {
    const value = e.target.value;
    setEditedMovie(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // Render edit form or movie data based on edit state
  const renderMovieRow = movie => {
    if (editedMovie && editedMovie.movieID === movie.movieID) {
      return (
        <tr key={movie.movieID}>
          <td>{movie.movieID}</td>
          <td><input type="text" value={editedMovie.movieName} onChange={e => handleInputChange(e, 'movieName')} /></td>
          <td><input type="text" value={editedMovie.movieDesc} onChange={e => handleInputChange(e, 'movieDesc')} /></td>
          <td><input type="number" value={editedMovie.movieRuntime} onChange={e => handleInputChange(e, 'movieRuntime')} /></td>
          <td><input type="text" value={editedMovie.productionHouse} onChange={e => handleInputChange(e, 'productionHouse')} /></td>
          <td>
          <input type="date" value={formatDate(editedMovie.startDate) || formatDate(movie.startDate)} onChange={e => handleInputChange(e, 'startDate')} />
        </td>
        <td>
          <input type="date" value={formatDate(editedMovie.endDate) || formatDate(movie.endDate)} onChange={e => handleInputChange(e, 'endDate')} />
        </td>       
        <td>
            <select value={editedMovie.isDeleted} onChange={e => handleInputChange(e, 'isDeleted')}>
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          </td>
          <td>
            <select value={editedMovie.isExpired} onChange={e => handleInputChange(e, 'isExpired')}>
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          </td>
          <td>
            <button onClick={() => handleEditMovie(movie.movieID, editedMovie)}>Save</button>
            <button onClick={() => setEditedMovie(null)}>Cancel</button>
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={movie.movieID}>
          <td>{movie.movieID}</td>
          <td>{movie.movieName}</td>
          <td>{movie.movieDesc}</td>
          <td>{movie.movieRuntime}</td>
          <td>{movie.productionHouse}</td>
          <td>{movie.startDate}</td>
          <td>{movie.endDate}</td>
          <td>{movie.isDeleted === 1 ? 'Yes' : 'No'}</td>
          <td>{movie.isExpired === 1 ? 'Yes' : 'No'}</td>
          <td>
            <button onClick={() => setEditedMovie({...movie})}>Edit</button>
            <button onClick={() => handleDeleteMovie(movie.movieID)}>Delete</button>
          </td>
        </tr>
      );
    }
  };

  return (
    <div>
      <h2>Movie Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Movie Name</th>
            <th>Description</th>
            <th>Runtime</th>
            <th>Production House</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Is Deleted</th>
            <th>Is Expired</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movieData.map(movie => renderMovieRow(movie))}
        </tbody>
      </table>
    </div>
  );
};

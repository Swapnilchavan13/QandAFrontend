import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const AdvertiseTable = () => {
  const [advertisementData, setAdvertisementData] = useState([]);

  // Function to fetch advertisement data from the backend API
  const fetchAdvertisementData = async () => {
    try {
      const response = await axios.get('/api/advertisements'); // Replace '/api/advertisements' with your actual API endpoint
      setAdvertisementData(response.data);
    } catch (error) {
      console.error('Error fetching advertisement data:', error);
    }
  };

  // Fetch advertisement data on component mount
  useEffect(() => {
    fetchAdvertisementData();
  }, []);

  // Function to handle deletion of an advertisement by ID
  const deleteAdvertisement = async (id) => {
    try {
      await axios.delete(`/api/advertisements/${id}`); // Replace '/api/advertisements' with your actual API endpoint
      // Remove the deleted advertisement from the state
      setAdvertisementData(advertisementData.filter(ad => ad.id !== id));
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  // Function to handle editing of an advertisement by ID
  const editAdvertisement = (id) => {
    // Redirect the user to an edit page/component with the advertisement ID
    // You can implement this using React Router or any other routing solution
    // For simplicity, we're just logging the ID for now
    console.log('Editing advertisement with ID:', id);
  };

  return (
    <div>
      <h2>Advertisement Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad Video Link</th>
            {/* Add more table headers as needed */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {advertisementData.map(ad => (
            <tr key={ad.id}>
              <td>{ad.id}</td>
              <td>{ad.adVideoLink}</td>
              {/* Render other advertisement data as needed */}
              <td>
                <button onClick={() => deleteAdvertisement(ad.id)}>Delete</button>
                <button onClick={() => editAdvertisement(ad.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

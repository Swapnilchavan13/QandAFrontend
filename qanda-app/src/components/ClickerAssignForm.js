import React, { useEffect, useState } from 'react';
import config from '../config.js';
import axios from 'axios';
import "../styles/clicker.css";

const ClickerAssignForm = () => {
  const apiUrl = config.apiBaseUrl;
  const liveUrl = config.apiLiveBaseUrl;
  const [formData, setFormData] = useState({
    screenID: '',
    IPAddress: '',
    seatNo: '',
    isReplaced: '',
    dateTime: '',
    issueIfReplaced: '',
    macAddress: '',
    isDeleted: ''
  });
  const [screenDetails, setScreenDetails] = useState([]);

  useEffect(()=>{
    axios.get(`${liveUrl}/getScreenDetails/1`)
      .then(response => {
        setScreenDetails(response.data.screenTable);
        console.log("Response", response);
      })
      .catch(error => {
        console.error('Error fetching scheduler data:', error);
      });
  },[]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    try {
      const response = await fetch(`${apiUrl}/addClickerData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('ClickeeData saved successfully!');
        // Reset the form fields
        setFormData({
          screenID: '',
          IPAddress: '',
          seatNo: '',
          isReplaced: '',
          dateTime: '',
          issueIfReplaced: '',
          macAddress: '',
          isDeleted: ''
        });
       
      } else {
        console.error('Error uploading data');
        alert('Error uploading data!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  // Function to handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="form-container">
    <h2 className="form-title">Clicker Seat Update Form</h2>
      <form onSubmit={handleSubmit}>
        
        <div>
        <label className="form-label">Screen ID:</label>
        <select className="form-select" name="screenID" value={formData.screenID} onChange={handleChange}>
            <option value="" disabled>Select Screen ID</option>
            {screenDetails.map(screen => (
              <option key={screen.id} value={screen.id}>{`Screen - ${screen.screenNo}`}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">IP Address:</label>
          <input type="text" name="IPAddress" value={formData.IPAddress} onChange={handleChange} />
        </div>

        <div>
          <label className="form-label">Seat No:</label>
          <input type="text" name="seatNo" value={formData.seatNo} onChange={handleChange} />
        </div>

        <div>
          <label className="form-label">Is Replaced:</label>
          <select name="isReplaced" value={formData.isReplaced} onChange={handleChange}>
            <option value="">Select Is Replaced</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>

        <div>
          <label className="form-label">Date Time:</label>
          <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} />
        </div>

        <div>
          <label className="form-label">Issue If Replaced:</label>
          <input type="text" name="issueIfReplaced" value={formData.issueIfReplaced} onChange={handleChange} />
        </div>

        <div>
          <label className="form-label">MAC Address:</label>
          <input type="text" name="macAddress" value={formData.macAddress} onChange={handleChange} />
        </div>

        <div>
          <label className="form-label">Is Deleted:</label>
          <select name="isDeleted" value={formData.isDeleted} onChange={handleChange}>
            <option value="">Select Is Deleted</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ClickerAssignForm;

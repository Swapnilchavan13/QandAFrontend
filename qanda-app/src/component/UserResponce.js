import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import "../styles/userdata.css";

export const UserResponse = () => {
  const [userResponse, setUserResponse] = useState([]);
  const [filteredCardID, setFilteredCardID] = useState('');
  const [filteredPhoneNumber, setFilteredPhoneNumber] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.0.113:8010/api/getUserResponse');
        const data = await response.json();
        setUserResponse(data.result);
      } catch (error) {
        console.error('Error fetching user response:', error);
      }
    };

    fetchData();
  }, []);

  const handleCardIDChange = (event) => {
    setFilteredCardID(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setFilteredPhoneNumber(event.target.value);
  };

  const filteredUserResponse = userResponse.filter(response =>
    response.cardID.includes(filteredCardID) &&
    response.phoneNumber.includes(filteredPhoneNumber)
  );

   // Filtered data for charts
   const filteredChartData = filteredUserResponse.map(response => ({
    questionDesc: response.questionDesc,
    optionSelected: response.optionSelected,
    correctOption: response.correctOption,
  }));


  // Data for Bar Chart
  const barChartData = filteredChartData.reduce((acc, response) => {
    const key = response.optionSelected.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});


  return (
    <>
    <div className="chart-container">
        <h3>Bar Chart</h3>
        <BarChart width={250} height={300} data={Object.entries(barChartData)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="0" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="1" fill="#8884d8" />
        </BarChart>
      </div>

    <div className="container">
      <h2>User Response Details</h2>
      <div className="filter-container">
        <label>Filter by Card ID:</label>
        <input type="text" value={filteredCardID} onChange={handleCardIDChange} />
      </div>
      <div className="filter-container">
        <label>Filter by Phone Number:</label>
        <input type="text" value={filteredPhoneNumber} onChange={handlePhoneNumberChange} />
      </div>
      {filteredUserResponse.length > 0 ? (
        <table>
          
          <thead>
            <tr>
              <th>Sr Number</th>
              <th>Date and Time</th>
              <th>User Name</th>
              <th>User ID</th>
              <th>Card ID</th>
              <th>Phone Number</th>
              <th>Question Type ID</th>
              <th>Option Selected</th>
              <th>Correct Option</th>
              <th>User Answer</th>
            </tr>
          </thead>
         
          <tbody>
            {filteredUserResponse.reverse().map((userResponse, index) => (
              <tr key={userResponse.userResponseID} className="user-response-details">
                <td>{index + 1}</td>
                <td>{userResponse.dateAndTime!=null?(new Date(userResponse.dateAndTime)).toLocaleString():''}</td>                <td>{userResponse.userName}</td>
                <td>{userResponse.userID}</td>
                <td>{userResponse.cardID}</td>
                <td>{userResponse.phoneNumber}</td>
                <td>{userResponse.questionDesc}</td>
                <td>{userResponse.optionSelected.toUpperCase()}</td>
                <td>{userResponse.correctOption}</td>
                <td>{userResponse.optionSelected.toLowerCase() === userResponse.correctOption.toLowerCase()
                 ? 'Right Answer'
               : userResponse.correctOption === 'NIL'
                 ? 'N/A'
               : 'Wrong Answer'} </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No matching user responses found.</p>
      )}
    </div>


      </>
);
};

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import * as XLSX from 'xlsx';
import '../styles/userdata.css';

export const UserResponse = () => {
  const [userResponse, setUserResponse] = useState([]);
  const [filteredCardID, setFilteredCardID] = useState('');
  const [filteredPhoneNumber, setFilteredPhoneNumber] = useState('');
  const [selectedQuestionTypeID, setSelectedQuestionTypeID] = useState('');
  const [filteredQuestionDesc, setFilteredQuestionDesc] = useState('');
  const [uniqueQuestionTypeIDs, setUniqueQuestionTypeIDs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.0.113:8010/api/getUserResponse');
        const data = await response.json();
        setUserResponse(data.result);

        // Extract unique question type IDs from the data
        const uniqueIDs = Array.from(new Set(data.result.map(response => response.questionDesc)));
        setUniqueQuestionTypeIDs(uniqueIDs);
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

  const handleQuestionTypeIDChange = (event) => {
    setSelectedQuestionTypeID(event.target.value);
  };
   
  const filteredUserResponse = userResponse.filter(
    (response) =>
      response.cardID.includes(filteredCardID) &&
      response.phoneNumber.includes(filteredPhoneNumber) &&
      (selectedQuestionTypeID === '' || response.questionDesc === selectedQuestionTypeID)
  );

    // Function to export data to Excel
    const exportToExcel = () => {
      const sheetData = filteredUserResponse.map((userResponse) => ({
        'Date and Time': userResponse.dateAndTime ? new Date(userResponse.dateAndTime).toLocaleString() : '',
        'User Name': userResponse.userName,
        'User ID': userResponse.userID,
        'Card ID': userResponse.cardID,
        'Phone Number': userResponse.phoneNumber,
        'Question Type ID': userResponse.questionDesc,
        'Option Selected': userResponse.optionSelected.toUpperCase(),
        'Correct Option': userResponse.correctOption,
        'User Answer': userResponse.optionSelected.toLowerCase() === userResponse.correctOption.toLowerCase()
          ? 'Right Answer'
          : userResponse.correctOption === 'NIL'
          ? 'N/A'
          : 'Wrong Answer'
      }));
  
      const ws = XLSX.utils.json_to_sheet(sheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'UserResponse');
      XLSX.writeFile(wb, 'user_response.xlsx');
    };

  // Filtered data for charts
  const filteredChartData = filteredUserResponse.map((response) => ({
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
        <BarChart width={1250} height={400} data={Object.entries(barChartData)}>
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
        <div className="filter-container">
          <label>Filter by Question Type ID:</label>
          <select value={filteredQuestionDesc} onChange={handleQuestionTypeIDChange}>
            <option value="">All</option>
            {uniqueQuestionTypeIDs.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
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
                  <td>
                    {userResponse.dateAndTime != null
                      ? new Date(userResponse.dateAndTime).toLocaleString()
                      : ''}
                  </td>
                  <td>{userResponse.userName}</td>
                  <td>{userResponse.userID}</td>
                  <td>{userResponse.cardID}</td>
                  <td>{userResponse.phoneNumber}</td>
                  <td>{userResponse.questionDesc}</td>
                  <td>{userResponse.optionSelected.toUpperCase()}</td>
                  <td>{userResponse.correctOption}</td>
                  <td>
                    {userResponse.optionSelected.toLowerCase() ===
                    userResponse.correctOption.toLowerCase()
                      ? 'Right Answer'
                      : userResponse.correctOption === 'NIL'
                      ? 'N/A'
                      : 'Wrong Answer'}{' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No matching user responses found.</p>
        )}
        <button onClick={exportToExcel}>Export to Excel</button>
      </div>
    </>
  );
};

import React, { useState, useEffect } from 'react';
import "../styles/userdata.css";

export const UserResponse = () => {
  const [userResponse, setUserResponse] = useState([]);

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

  return (
    <div className="container">
      <h2>User Response Details</h2>
      {userResponse ? (
        userResponse.map((userResponse) => (
          <div key={userResponse.userResponseID} className="user-response-details">
            <p>User Response ID: {userResponse.userResponseID}</p>
            <p>User ID: {userResponse.userID}</p>
            <p>Option Selected: {userResponse.optionSelected}</p>
            <p>Video Data ID: {userResponse.videoDataID}</p>
            <p>Is Correct: {userResponse.isCorrect ? 'Yes' : 'No'}</p>
            <p>Question Type ID: {userResponse.questionTypeID}</p>
            <p>User Name: {userResponse.userName}</p>
            <p>Card ID: {userResponse.cardID}</p>
            <p>Phone Number: {userResponse.phoneNumber}</p>
            <p>Date and Time: {userResponse.dateAndTime}</p>
          </div>
        ))
      ) : (
        <p>Loading user responses...</p>
      )}
    </div>
  );
};

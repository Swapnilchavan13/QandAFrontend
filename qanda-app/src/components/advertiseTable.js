import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const AdvertiseTable = () => {
  const [advertisementData, setAdvertisementData] = useState([  {
    "id": 1,
    "adVideoLink": "videos/ElephantsDream.mp4",
    "adFileSize": null,
    "totalOptionNumber": 4,
    "questionTableID": 1,
    "userResponseToggle": 1,
    "displayToggle": 0,
    "brandID": 1,
    "duration": 88,
    "adStartTime": 33,
    "isSample": 1,
    "isDeleted": 0,
    "createdAt": "2024-04-20T10:17:59.000Z",
    "updatedAt": "2024-04-20T10:17:59.000Z"
},
{
    "id": 2,
    "adVideoLink": "videos/ElephantsDream.mp4",
    "adFileSize": null,
    "totalOptionNumber": 4,
    "questionTableID": 1,
    "userResponseToggle": 1,
    "displayToggle": 0,
    "brandID": 1,
    "duration": 88,
    "adStartTime": 33,
    "isSample": 1,
    "isDeleted": 0,
    "createdAt": "2024-04-20T10:23:47.000Z",
    "updatedAt": "2024-04-20T10:23:47.000Z"
},
{
    "id": 7,
    "adVideoLink": "videos/BigBuckBunny.mp4",
    "adFileSize": null,
    "totalOptionNumber": 4,
    "questionTableID": 1,
    "userResponseToggle": 1,
    "displayToggle": 0,
    "brandID": 1,
    "duration": 88,
    "adStartTime": 33,
    "isSample": 1,
    "isDeleted": 0,
    "createdAt": "2024-04-20T11:36:21.000Z",
    "updatedAt": "2024-04-20T11:36:21.000Z"
},
{
    "id": 8,
    "adVideoLink": "videos/ForBiggerBlazes.mp4",
    "adFileSize": null,
    "totalOptionNumber": 2,
    "questionTableID": 1,
    "userResponseToggle": 1,
    "displayToggle": 0,
    "brandID": 1,
    "duration": 88,
    "adStartTime": 0,
    "isSample": 1,
    "isDeleted": 0,
    "createdAt": "2024-04-20T11:43:50.000Z",
    "updatedAt": "2024-04-20T11:43:50.000Z"
}
]);
  const [editedData, setEditedData] = useState({});

  const [questionDetails, setQuestionDetails] = useState([]);


    useEffect(() => {
      fetch(`http://192.168.0.117:8012/getQuestionDetails`)
        .then(response => response.json())
        .then(results => {
          setQuestionDetails(results.questionData);
        })
        .catch(error => {
          console.error('Error fetching videos:', error);
        });
      },[]);

  // Function to fetch advertisement data from the backend API
  const fetchAdvertisementData = async () => {
    try {
      const response = await axios.get('http://192.168.0.117:8012/getAdvertisementDetails');
      setAdvertisementData(response.data.adData);
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
      await axios.delete(`http://192.168.0.117:8012/deleteAdvertisementDetails/${id}`);
      setAdvertisementData(advertisementData.filter(ad => ad.id !== id));
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  // Function to handle editing of an advertisement by ID
  const editAdvertisement = (id) => {
    // Find the advertisement with the given ID
    const adToEdit = advertisementData.find(ad => ad.id === id);
    // Set the edited data to the advertisement's data
    setEditedData(adToEdit);
  };

  // Function to handle updating an advertisement
  const updateAdvertisement = async () => {
    const id = editedData.id;
    try {
      await axios.put(`http://192.168.0.117:8012/updateAdvertisement/${id}`, editedData);
      console.log('Advertisement updated successfully.');
      // Clear the edited data
      setEditedData({});
      // Refresh the advertisement data
      fetchAdvertisementData();
    } catch (error) {
      console.error('Error updating advertisement:', error);
    }
  };

  // Function to handle input change in the edit form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEditedData({ ...editedData, [name]: newValue });
  };

  return (
    <div>
      <h2>Advertisement Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad Video Link</th>
            <th>Total Option Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {advertisementData.map(ad => (
            <tr key={ad.id}>
              <td>{ad.id}</td>
              <td>{ad.adVideoLink}</td>
              <td>{ad.totalOptionNumber}</td>
              <td>
                <button onClick={() => deleteAdvertisement(ad.id)}>Delete</button>
                <button onClick={() => editAdvertisement(ad.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      <div>
        <h2>Edit Advertisement</h2>
        <form>
          <label>ID: </label>
          <input type="text" name="id" value={editedData.id || ''} readOnly />
          <br />
          <label>Ad Video Link: </label>
          <input type="text" name="adVideoLink" value={editedData.adVideoLink || ''} onChange={handleInputChange} />
          <br />
          <label>Total Option Number: </label>
          <input type="number" name="totalOptionNumber" value={editedData.totalOptionNumber || ''} onChange={handleInputChange} />
          <br />
          <br />
          <label>Total Option Number: </label>
          <input type="number" name="totalOptionNumber" value={editedData.totalOptionNumber || ''} onChange={handleInputChange} />
          <br />
          <label>Is Deleted: </label>
          <select name="isDeleted" value={editedData.isDeleted || ''} onChange={handleInputChange}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
          <br />
          <label>Is Expired: </label>
          <select name="isExpired" value={editedData.isExpired || ''} onChange={handleInputChange}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>

          <br />
          <label>Question Table ID: </label>
          <input type="number" name="questionTableID" value={editedData.questionTableID || ''} onChange={handleInputChange} />

          <label>
          Question:
          <select name="questionDescription">
            <option value="" disabled>Select Question</option>
            {questionDetails.map(question => (
              <option key={question.id} value={question.questionDescription}>{question.questionDescription}</option>
            ))}
          </select>
        </label>
          <button type="button" onClick={updateAdvertisement}>Update</button>
        </form>
      </div>
    </div>
  );
};

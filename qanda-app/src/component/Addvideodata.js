import React, { useState } from 'react';
import '../styles/addvideo.css';

export const Addvideodata = () => {
  const [formData, setFormData] = useState({
    video_id: '',
    video: '',
    Date_time: '',
    show_id: '',
    video_type: '',
    question_type: '',
    question: '',
    question_id: '',
    options_option_1: '',
    options_option_2: '',
    options_option_3: '',
    image: '',
    state: '',
    currentTime: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8002/api/add-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Video added successfully!');
      } else {
        console.error('Failed to add video.');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className='abody'>
      <h1>Add Video</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="video_id">Video ID:</label>
        <input
          type="number"
          id="video_id"
          name="video_id"
          value={formData.video_id}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="video">Video URL:</label>
        <input
          type="text"
          id="video"
          name="video"
          value={formData.video}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="Date_time">Date and Time:</label>
        <input
          type="datetime-local"
          id="Date_time"
          name="Date_time"
          value={formData.Date_time}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="show_id">Show ID:</label>
        <input
          type="text"
          id="show_id"
          name="show_id"
          value={formData.show_id}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="video_type">Video Type:</label>
        <input
          type="text"
          id="video_type"
          name="video_type"
          value={formData.video_type}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="question_type">Question Type:</label>
        <input
          type="text"
          id="question_type"
          name="question_type"
          value={formData.question_type}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="question">Question:</label>
        <input
          type="text"
          id="question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="question_id">Question ID:</label>
        <input
          type="text"
          id="question_id"
          name="question_id"
          value={formData.question_id}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="options_option_1">Option 1:</label>
        <input
          type="text"
          id="options_option_1"
          name="options_option_1"
          value={formData.options_option_1}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="options_option_2">Option 2:</label>
        <input
          type="text"
          id="options_option_2"
          name="options_option_2"
          value={formData.options_option_2}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="options_option_3">Option 3:</label>
        <input
          type="text"
          id="options_option_3"
          name="options_option_3"
          value={formData.options_option_3}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="image">Image:</label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
        /><br />

        <label htmlFor="state">State:</label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="currentTime">Current Time:</label>
        <input
          type="number"
          id="currentTime"
          name="currentTime"
          value={formData.currentTime}
          onChange={handleChange}
          required
        /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

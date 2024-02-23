import { useState, useEffect } from "react";
import"../styles/addvideo.css";

function Addvideodata() {
  const [formData, setFormData] = useState({
    videoURL: '',
    imageURL: '',
    dateAndTime:'',
    brandName:'',
    questionType: '',
    videoType:'',
    questionDesc:'',
    questionTypeID: '',
    option: '',
    optionDesc:'',
    duration:'',
    optionOne:'',
    optionTwo:'',
    optionThree:'',
    optionFour:'',
    optionFive:'',
    adStartTime:'',
    correctOption:''
  });

  const [showAlert, setShowAlert] = useState(false);
  var showAlertMessage = "";
  var buttonClick = false;
  const [videoType,setVideoType] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  
  const questionMapping = {
    1: "WOULD YOU LIKE TO A SAMPLE OF THIS LIPSTIK RIGHT NOW?",
    2: "HONESTLY, HOW WAS THIS AD?",
    3: "YOUR ANSWER WILL HELP US MAKE SUITABLE & CUSTOMISED OFFERS FOR YOU",
    4: "WHICH FEMALE ACTOR WAS IN THE AD?",
  };

  const optionMapping = {
    2: "CSS For 2",
    3: "CSS For 3",
    4: "CSS For 4",
    5: "CSS For 5"
  };


  const handleQuestionTypeIDChange = (e) => {
    const selectedQuestionTypeID = e.target.value;
    setFormData({
      ...formData,
      questionTypeID: selectedQuestionTypeID,
      questionDesc: questionMapping[selectedQuestionTypeID] || "", // Set the question based on the mapping
    });
  };

  
  const handleoption = (e) => {
    const optionid = e.target.value;
    setFormData({
      ...formData,
      option: optionid,
      optionDesc: optionMapping[optionid] || "",

    });
  };

  const handleVideoTypeChange = (videoType) => {
    setVideoType(videoType);
    setFormData({ ...formData, 'videoType': videoType });
  }

  useEffect(() => {

    if(formData.questionType.trim() === ''){
        setShowAlert(true);
        showAlertMessage = "Please enter a valid Question type";
      const timeoutId = setTimeout(() => {
        setShowAlert(false);
      }, 10000);

      return () => clearTimeout(timeoutId);
    }

    else if(isNaN(formData.questionTypeID) || formData.questionTypeID < 1){
        setShowAlert(true);
        showAlertMessage = "Please enter a valid Question Type ID (a positive number)";
      const timeoutId = setTimeout(() => {
        setShowAlert(false);
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  },[buttonClick===true]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData); 
  };

  const handleVideoChange = (e) => {
    const myArray = ( e.target.value).split("\\");
    setFormData({ ...formData, 'videoURL' :  myArray[2]});
    console.log(myArray[2]);
    console.log(formData)
  }
  
  const handleImageChange = (e) => {
    const myArray = ( e.target.value).split("\\");
    console.log("image",myArray[2]);
    setFormData({ ...formData, 'imageURL' :  myArray[2]});
  }

  const handleSubmit = async (e) => {
    console.log('hello')
    e.preventDefault();
     
      
      console.log("final form data:",formData);

    try {
      const response = await fetch('http://192.168.0.113:8010/uploadVideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      //console.log("response.body",response.body)
      if (response.ok) {
        alert('Data saved successfully!');
        console.log('Data uploaded successfully');
        console.log(formData);
        // Add any additional logic or state updates as needed
      } else {
        console.error('Error uploading data');
        alert('Error uploading data!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="video-form" onSubmit={handleSubmit}>
      <h1>Add Video Data</h1>
      <label>
        Video URL:
        <input type="file" onChange={handleVideoChange} />
      </label>
      <br />
      <br/> 
      <label>
        Image URL:
        <input type="file" onChange={handleImageChange} />
      </label>
      <br />
      <br/>     
      <label>
        Date:
        <input type="datetime-local" name="dateAndTime" value={formData.dateAndTime} onChange={handleChange} />
      </label>
      <br/>
      <br/>
      <label>
        Brand Name:
        <input type="text" name="brandName" value={formData.brandName} onChange={handleChange} />
      </label>
      <br />
      <br/>      
      <label>
        Video Type:
         <input type="text" list="options" name="videoType" value={formData.videoType} onChange={handleChange}/>
          <datalist id="options">
            <option value="Advertisement" />
            <option value="Content" />
          </datalist>
      </label>
      <br />
      <br/>      
      <label>
        Question Type:
        <input type="text" list="options1" name="questionType" value={formData.questionType} onChange={handleChange}/>
          <datalist id="options1">
            <option value="Image" />
            <option value="Text" />
          </datalist>
      </label>
      <br />
      <br/>      
      <label>
        Question Type ID:
        <select
          name="questionTypeID"
          value={formData.questionTypeID}
          onChange={handleQuestionTypeIDChange}
        >
          <option value="">Select Question Type ID</option>
          {[1, 2, 3, 4].map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </label>
      <br />
      <br />
      <label>
        Question:
        <input
          type="text"
          name="questionDesc"
          value={formData.questionDesc}
          onChange={handleChange}
          readOnly
        />
      </label>
      <br />
      <br />
      <label>
        Option Type:
        <select
          name="option"
          value={formData.option}
          onChange={handleoption}
        >
          <option value="">Select Available Options</option>
          {[2, 3, 4, 5].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <br />
      <br />
      <label>
        Option CSS Selected:
        <input
          type="text"
          name="optionDesc"
          value={formData.optionDesc}
          onChange={handleChange}
          readOnly
        />
      </label>
      <br />
      <br/>      
      <label>
      Duration ( in minutes ):
        <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
      </label>
      <br />
      <br/>      
      <label>
      Option 1:
        <input type="text" name="optionOne" value={formData.optionOne} onChange={handleChange} />
      </label>
      <br />
      <br/>
      <label>
      Option 2:
        <input type="text" name="optionTwo" value={formData.optionTwo} onChange={handleChange} />
      </label>
      <br />
      <br/>
      <label>
      Option 3:
        <input type="text" name="optionThree" value={formData.optionThree} onChange={handleChange} />
      </label>
      <br />
      <br/>
      <label>
      Option 4:
        <input type="text" name="optionFour" value={formData.optionFour} onChange={handleChange} />
      </label>
      <br />
      <br/>
      <label>
      Option 5:
        <input type="text" name="optionFive" value={formData.optionFive} onChange={handleChange} />
      </label>
      <br />
      <br/>
      <label>
      Correct Option:
        <input type="text" name="correctOption" value={formData.correctOption} onChange={handleChange} />
      </label>
      <br />
      <br/>
      <label>
      Seconds when AD starts:
        <input type="text" name="adStartTime" value={formData.adStartTime} onChange={handleChange} />
      </label>
      <br />
      <br/>
      <button type="submit" onClick={() =>{
        buttonClick = true

      }}>Upload Video</button>
      <br/>
      
    </form>
    
  );
}

export default Addvideodata
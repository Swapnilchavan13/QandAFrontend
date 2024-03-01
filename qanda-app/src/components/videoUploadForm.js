import { useState, useEffect } from "react";
import '../styles/videoUploadForm.css';
import config from '../config';  // Adjust the path accordingly

const apiUrl = `${config.apiBaseUrl}`;

function UploadForm() {
  const [formData, setFormData] = useState({

    videoURL: '',
    imageURL: '',
    dateAndTime:'',
    questionType: '',
    videoType:'',
    questionDesc:'',
    questionTypeID: '',
    option: '',
    padX:'',
    padY:'',
    text:'',
    x:'',
    y:'',
    colours:'',
    duration:'',
    optionOne:'',
    optionTwo:'',
    optionThree:'',
    optionFour:'',
    optionFive:'',
    adStartTime:'',
    correctOption:'',
    brandName:'',
    brandLogo:'',
    contactPersonName:'',
    contactPersonNumber:''
  });

  const [numOptions, setNumOptions] = useState(2);

  const handleNumOptionsChange = (e) => {
    const selectedNumOptions = parseInt(e.target.value, 10);
    setNumOptions(selectedNumOptions);
    setFormData({
      ...formData,
      optionOne: '',
      optionTwo: '',
      optionThree: '',
      optionFour: '',
      optionFive: '',
      correctOption: '',
    });
  };

  const [showAlert, setShowAlert] = useState(false);
  var showAlertMessage = "";
  var buttonClick = false;
  const [videoType,setVideoType] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const optionMapping = {
    2: [
      {"padx1":177,"padx2":192}, 
      {"pady1":60,"pady2":54,}, 
      {text: "font_style_45"}, 
      {"x1":0,"x2":0},
      {"y1":424,"y2":617},
      {color:"red"}
    ],

  3: [
    {"padx1":177,"padx2":192}, 
    {"pady1":60,"pady2":54}, 
    {"x1":0,"x2":0},
    {text: "font_style_45"}, 
    {"y1":424,"y2":617},
    {color:"red"}
  ],    

    4: [
      {"padx1":57,"padx2":4, "padx3":64, "padx4":44},
      {"pady1":27, "pady2":27, "pady3":27, "pady4":27},
      {text:"font_style_45"},
      {"x1":0,"x2":0,"x3":0,"x4":0},
      {"y1":291,"y2":418,"y3":545,"y4":672},
      {color:"red"}
],

5: [
  {"padx1":20,"padx2":20, "padx3":45, "padx4":128, "padx5":39},
  {"pady1":22, "pady2":22, "pady3":20, "pady4":22, "pady5":17},
  {text:"font_style_45"},
  {"x1":0,"x2":0,"x3":0,"x4":0,"x5":0},
  {"y1":230,"y2":345,"y3":462,"y4":575, "y5":692},
  {color:"red"}
],
};

  const handleQuestionTypeIDChange = (e) => {
    const selectedQuestionTypeID = e.target.value;
    setFormData({
      ...formData,
      questionTypeID: selectedQuestionTypeID,
    });
  };

  const handleoption = (e) => {
    const optionid = e.target.value;
    setFormData({
      ...formData,
      option: optionid,
      padX: JSON.stringify(optionMapping[optionid][0]) || "",
      padY: JSON.stringify(optionMapping[optionid][1])|| "",
      text: JSON.stringify(optionMapping[optionid][2]) || "",
      x: JSON.stringify(optionMapping[optionid][3])|| "",
      y: JSON.stringify(optionMapping[optionid][4]) || "",
      colours: JSON.stringify(optionMapping[optionid][5]) || "",
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

  const handleBrandLogoChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, brandLogo: file });
  };  

  const handleSubmit = async (e) => {
    console.log('hello')
    e.preventDefault();
      console.log("final form data:",formData);

     try {
      const response = await fetch(`${apiUrl}/api/uploadVideo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Data saved successfully!');
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
      <span>Video URL:</span>
      <div className="custom-file-input">
        <input type="file" onChange={handleVideoChange} />
        Choose a File
      </div>
      <span className="file-name">{formData.videoURL}</span>
    </label>
      <br/>
      <br/> 
      <label>
        <span>Image URL:</span>
      <div className="custom-file-input">
        <input type="file" onChange={handleImageChange} />
        Choose a File
      </div>
      <span className="file-name">{formData.imageURL}</span>
      </label>

      <br/>
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
       <span>Brand Logo:</span>
       <div className="custom-file-input">
      <input type="file" accept="image/*" onChange={handleBrandLogoChange} />
      Choose a File
      </div>
      </label>
      <br/>
      <br/> 
      <label>
        Brand Contact Name:
        <input type="text" name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} />
      </label>
      <br />
      <br/> 
      <label>
        Brand Contact Phone:
        <input type="text" name="contactPersonNumber" value={formData.contactPersonNumber} onChange={handleChange} />
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
        Question:
        <input
          type="text"
          name="questionDesc"
          value={formData.questionDesc}
          onChange={handleChange}
        />
      </label> 
      <br />
      <br />
      <label>
      Duration ( in minutes ):
        <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
      </label>
      <br />
      <br/> 
      <label>
        Number of Options:
        <select
          name="numOptions"
          value={numOptions}
          onChange={handleNumOptionsChange}
        >
          {[2, 3, 4, 5].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label> 
      <br />
      <br/>        
      <label>
        Option 1:
        <input type="text" name="optionOne" value={formData.optionOne} onChange={handleChange} />
      </label>
      <br />
      <br/>
      <label style={{ display: numOptions > 1 ? 'block' : 'none' }}>
        Option 2:
        <input
          type="text"
          name="optionTwo"
          value={formData.optionTwo}
          onChange={handleChange}
        />
      </label>
      <br />
      <br/>

      <label style={{ display: numOptions > 2 ? 'block' : 'none' }}>
        Option 3:
        <input
          type="text"
          name="optionThree"
          value={formData.optionThree}
          onChange={handleChange}
        />
      </label>
      <br />
      <br/>

      <label style={{ display: numOptions > 3 ? 'block' : 'none' }}>
        Option 4:
        <input
          type="text"
          name="optionFour"
          value={formData.optionFour}
          onChange={handleChange}
        />
      </label>
      <br />
      <br/>

      <label style={{ display: numOptions > 4 ? 'block' : 'none' }}>
        Option 5:
        <input
          type="text"
          name="optionFive"
          value={formData.optionFive}
          onChange={handleChange}
        />
      </label>
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
      <br/>
      <br/>
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
        Padx:
        <input
          type="text"
          name="padX"
          value={formData.padX}
          onChange={handleoption}
          readOnly
        />
      </label>
      <br />
      <br/>  
      <label>
        Pady:
        <input
          type="text"
          name="padY"
          value={formData.padY}
          onChange={handleoption}
          readOnly
        />
      </label>
      <br />
      <br/>     
      <label>
        Text:
        <input
          type="text"
          name="text"
          value={formData.text}
          onChange={handleoption}
          readOnly
        />
      </label>
      <br />
      <br/> 
      <label>
        X:
        <input
          type="text"
          name="x"
          value={formData.x}
          onChange={handleoption}
          readOnly
        />
      </label>
      <br />
      <br/> 
      <label>
        Y:
        <input
          type="text"
          name="y"
          value={formData.y}
          onChange={handleoption}
          readOnly
        />
      </label>
      <br />
      <br/> 
      <label>
        Color:
        <input
          type="text"
          name="colours"
          value={formData.colours}
          onChange={handleoption}
          readOnly
        />
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

export default UploadForm;
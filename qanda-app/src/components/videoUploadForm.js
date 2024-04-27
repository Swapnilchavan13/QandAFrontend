import { useState, useEffect } from "react";
import '../styles/videoUploadForm.css';
import config from '../config';  // Adjust the path accordingly
// import { Demo } from "./demo";

const apiUrl = `${config.apiBaseUrl}`;

function UploadForm() {
  const [formData, setFormData] = useState({

    adVideoLink: '',
    imageURL: '',
    dateAndTime:'',
    questionType: '',
    videoType:'',
    questionDescription:'',
    questionTypeID: '',
    option: '',
    padx1:'', 
    padx2:'',
    padx3:'',  
    padx4:'',
    padx5:'',
    pady1:'',
    pady2:'',
    pady3:'', 
    pady4:'', 
    pady5:'', 
    padY:'',
    text1:'',
    text2:'',
    text3:'',
    text4:'',
    text5:'',
    x1:'',
    x2:'',
    x3:'',
    x4:'',
    x5:'',
    y1:'',
    y2:'',
    y3:'',
    y4:'',
    y5:'',
    color:'',
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
    isSample: '',
    // brandLogo:'',
    // contactPersonName:'',
    // contactPersonNumber:''
  });

  const handleIsSampleChange = (e) => {
    const isSampleValue = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      isSample: isSampleValue,
    }));
  };

  const [isQuestionExisting, setQuestionExisting] = useState(false);
   const handleQuestionChange = () => {
    setQuestionExisting(!isQuestionExisting);
  };

  const [questionDetails, setQuestionDetails] = useState([]);


    useEffect(() => {
      fetch(`${apiUrl}/getQuestionDetails`)
        .then(response => response.json())
        .then(results => {
          setQuestionDetails(results.questionData);
        })
        .catch(error => {
          console.error('Error fetching videos:', error);
        });
      },[]);

  const [brandDetails,setBrandDetails] = useState([]);
  useEffect(() => {
    fetch(`${apiUrl}/getBrandDetails`)
      .then(response => response.json())
      .then(results => {
        setBrandDetails(results.brandDetails);
      })
      .catch(error => {
        console.error('Error fetching videos:', error);
      });
    },[]);

  const [numOptions, setNumOptions] = useState(2);
  const [option, setOption] = useState(numOptions);

  const handleNumOptionsChange = (e) => {
    const selectedNumOptions = parseInt(e.target.value, 10);
    setNumOptions(selectedNumOptions);
    setOption(selectedNumOptions);
  
    setFormData(prevState => ({
      ...prevState,
      option: selectedNumOptions,
      optionOne: '',
      optionTwo: '',
      optionThree: '',
      optionFour: '',
      optionFive: '',
      correctOption: '',
    }));
  };

  const [showAlert, setShowAlert] = useState(false);
  var showAlertMessage = "";
  var buttonClick = false;
  const [videoType,setVideoType] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  

   const [isBrandExisting, setBrandExisting] = useState(false);
   const handleCheckboxChange = () => {
     setBrandExisting(!isBrandExisting);
   };

  const handleQuestionTypeIDChange = (e) => {
    const selectedQuestionTypeID = e.target.value;
    setFormData({
      ...formData,
      questionTypeID: selectedQuestionTypeID,
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
    // setOption(parseInt(e.target.value));
    const { name, value } = e.target;
  
    // For all fields except contactPersonNumber, simply update the state
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleVideoChange = (e) => {
    const myArray = ( e.target.value).split("\\");
    setFormData({ ...formData, 'adVideoLink' :  myArray[2]});
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
      const response = await fetch(`http://192.168.0.117:8012/addContentData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('Data saved successfully!');
        // Reset the form fields
       
      } else {
        console.error('Error uploading data');
        alert('Error uploading data!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderFormFields = () => {
    const fields = [];
    const optionData = {
      2: [
        { name: "padx1", placeholder: "Pad X1" },
        { name: "padx2", placeholder: "Pad X2" },
        { name: "pady1", placeholder: "Pad Y1" },
        { name: "pady2", placeholder: "Pad Y2" },
        { name: "text1", placeholder: "Text 1 Font" },
        { name: "text2", placeholder: "Text 2 Font" },
        { name: "x1", placeholder: "X1" },
        { name: "x2", placeholder: "X2" },
        { name: "y1", placeholder: "Y1" },
        { name: "y2", placeholder: "Y2" },
        { name: "color", placeholder: "Color" }
      ],
      4: [
        { name: "padx1", placeholder: "Pad X1" },
        { name: "padx2", placeholder: "Pad X2" },
        { name: "padx3", placeholder: "Pad X3" },
        { name: "padx4", placeholder: "Pad X4" },
        { name: "pady1", placeholder: "Pad Y1" },
        { name: "pady2", placeholder: "Pad Y2" },
        { name: "pady3", placeholder: "Pad Y3" },
        { name: "pady4", placeholder: "Pad Y4" },
        { name: "text1", placeholder: "Text 1 Font" },
        { name: "text2", placeholder: "Text 2 Font" },
        { name: "text3", placeholder: "Text 3 Font" },
        { name: "text4", placeholder: "Text 4 Font" },

        { name: "x1", placeholder: "X1" },
        { name: "x2", placeholder: "X2" },
        { name: "x3", placeholder: "X3" },
        { name: "x4", placeholder: "X4" },
        { name: "y1", placeholder: "Y1" },
        { name: "y2", placeholder: "Y2" },
        { name: "y3", placeholder: "Y3" },
        { name: "y4", placeholder: "Y4" },
        { name: "color", placeholder: "Color" }
      ],
      5: [
        { name: "padx1", placeholder: "Pad X1" },
        { name: "padx2", placeholder: "Pad X2" },
        { name: "padx3", placeholder: "Pad X3" },
        { name: "padx4", placeholder: "Pad X4" },
        { name: "padx5", placeholder: "Pad X5" },
        { name: "pady1", placeholder: "Pad Y1" },
        { name: "pady2", placeholder: "Pad Y2" },
        { name: "pady3", placeholder: "Pad Y3" },
        { name: "pady4", placeholder: "Pad Y4" },
        { name: "pady5", placeholder: "Pad Y5" },
        { name: "text1", placeholder: "Text 1 Font" },
        { name: "text2", placeholder: "Text 2 Font" },
        { name: "text3", placeholder: "Text 3 Font" },
        { name: "text4", placeholder: "Text 4 Font" },
        { name: "text5", placeholder: "Text 5 Font" },

        { name: "x1", placeholder: "X1" },
        { name: "x2", placeholder: "X2" },
        { name: "x3", placeholder: "X3" },
        { name: "x4", placeholder: "X4" },
        { name: "x5", placeholder: "X5" },
        { name: "y1", placeholder: "Y1" },
        { name: "y2", placeholder: "Y2" },
        { name: "y3", placeholder: "Y3" },
        { name: "y4", placeholder: "Y4" },
        { name: "y5", placeholder: "Y5" },
        { name: "color", placeholder: "Color" }
      ]
    };

    const optionFields = optionData[option];
    if (!optionFields) return null; // Add null check here

    optionFields.forEach((field, index) => {
      fields.push(
        <div key={index}>
          <h4>{field.placeholder}</h4>
          <input
            type="text"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        </div>
      );
    });
    return fields;
  };


  return (
    <form className="video-form" onSubmit={handleSubmit}>
      <h1>Add Video Data</h1>
      <label>
  <span>Video URL:</span>
  <div className="custom-file-input">
    <input type="file" accept="video/mp4" onChange={handleVideoChange} />
    Choose a MP4 File
  </div>
  <span className="file-name">{formData.adVideoLink}</span>
</label>

<label>
  <span>Image URL:</span>
  <div className="custom-file-input">
    <input type="file" accept="image/*" onChange={handleImageChange} />
    Choose an Image File
  </div>
  <span className="file-name">{formData.imageURL}</span>
</label>
    
      <label>
        Date:
        <input type="datetime-local" name="dateAndTime" value={formData.dateAndTime} onChange={handleChange} />
      </label>
     
      <label>
        Video Type:
        <select name="videoType" value={formData.videoType} onChange={handleChange}>
          <option value="" disabled selected>Select the video type</option>
          <option value="Content">Content</option>
          <option value="Advertisement">Advertisement</option>
        </select>
      </label>

<label style={{ display: formData.videoType === "Advertisement" && !isBrandExisting ? 'block' : 'none' }}>
  Brand Name:
  <select name="brandName" value={formData.brandName} onChange={handleChange}>
    <option value="" disabled>Select brand</option>
    {brandDetails.map(brand => (
      <option key={brand.id} value={brand.brandName}>{brand.brandName}</option>
    ))}
  </select>
</label>
            
      <label style={{ display: formData.videoType =="Advertisement" ? 'block' : 'none' }}>
        Question Type:       
          <select name="questionType" value={formData.questionType} aria-placeholder="" onChange={handleChange}>
            <option value="" disabled selected>Select the question type</option>
            <option value="Image" >Image</option>
            <option value="Text" >Text</option>
          </select>
      </label>

      <div className="checkbox-container" style={{ display: formData.videoType =="Advertisement" ? 'block' : 'none' }}>

        <h4>Choose Option:</h4><label className={`checkbox-label ${isQuestionExisting ? 'isQuestionExisting' : ''}`}>
    <input
      type="checkbox"
      checked={isQuestionExisting}
      onChange={handleQuestionChange}
      className="checkbox-input"

    />
    Add New Question
  </label> 
  <label className={`checkbox-label ${!isQuestionExisting ? 'isQuestionExisting' : ''}` }>
    <input
      type="checkbox"
      checked={!isQuestionExisting}
      onChange={handleQuestionChange}
      className="checkbox-input"
      disabled={questionDetails.length<=0 ? 'disabled' : ''}
    />
    Choose From Existing Question
  </label>
</div>  
           
   
      <label disable={true} style={{ display: formData.videoType === "Advertisement" && !isQuestionExisting ? 'block' : 'none' }}>
          Question:
          <select name="questionDescription" value={formData.questionDescription} onChange={handleChange}>
            <option value="" disabled>Select Question</option>
            {questionDetails.map(question => (
              <option key={question.id} value={question.questionDescription}>{question.questionDescription}</option>
            ))}
          </select>
        </label>

        <label style={{ display: formData.videoType === "Advertisement" && isQuestionExisting ? 'block' : 'none'}}>
        Enter New Question Here:
          <input type="text" name="questionDescription" value={formData.durquestionDescriptionation} onChange={handleChange} />
      </label>

     
      <label>
      Duration ( in minutes ):
        <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
      </label>
    

 <label style={{ display: formData.videoType === "Advertisement" ? 'block' : 'none' }}>
  Is this a sample?
  <select
    name="isSample"
    value={formData.isSample}
    onChange={handleIsSampleChange}>
    <option value="">Select</option>
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
</label>


      <label style={{ display: formData.videoType =="Advertisement" ? 'block' : 'none' }}>
        Number of Options:
        <select
        id="option"
          name="totalOptionNumber"
          value={option}
          onChange={handleNumOptionsChange}>
          {[2, 3, 4, 5].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {renderFormFields()}
      </label>
   
      <label style={{ display: formData.videoType =="Advertisement" ? 'block' : 'none' }}>         Option 1:
        <input type="text" name="optionOne" value={formData.optionOne} onChange={handleChange} />
      </label>
     
      <label style={{ display: formData.videoType =="Advertisement" ? 'block' : 'none' }}>         Option 2:
        <input
          type="text"
          name="optionTwo"
          value={formData.optionTwo}
          onChange={handleChange}
        />
      </label>
      
      <label style={{ display: numOptions > 2 ? 'block' : 'none' }}>
        Option 3:
        <input
          type="text"
          name="optionThree"
          value={formData.optionThree}
          onChange={handleChange}
        />
      </label>
     
      <label style={{ display: numOptions > 3 ? 'block' : 'none' }}>
        Option 4:
        <input
          type="text"
          name="optionFour"
          value={formData.optionFour}
          onChange={handleChange}
        />
      </label>
      
      <label style={{ display: numOptions > 4 ? 'block' : 'none' }}>
        Option 5:
        <input
          type="text"
          name="optionFive"
          value={formData.optionFive}
          onChange={handleChange}
        />
      </label>
          
      <label style={{ display: formData.videoType =="Advertisement" ? 'block' : 'none' }}>       Correct Option ( ENTER nil WHEN THIS OPTION ISNT NEEDED FOR THE QUESTION GIVEN):
        <input type="text" name="correctOption" value={formData.correctOption} onChange={handleChange} />
      </label>
    
      <label>
      Seconds when AD starts:
        <input type="text" name="adStartTime" value={formData.adStartTime} onChange={handleChange} />
      </label>

{/* <div style={{ display: formData.videoType =="Advertisement" ? 'block' : 'none' }}>

<label htmlFor="option">Select Number of Buttons:</label>
<select id="option" value={option} disabled>
  <option value={2}>2</option>
  <option value={4}>4</option>
  <option value={5}>5</option>
</select>

        
</div> */}
      
      <button type="submit" onClick={() =>{
        buttonClick = true
      }}>Upload Video</button>
      
    </form>
  );
}

export default UploadForm;
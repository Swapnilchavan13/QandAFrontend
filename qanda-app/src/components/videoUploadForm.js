import { useState, useEffect } from "react";
import '../styles/videoUploadForm.css';
import config from '../config';  // Adjust the path accordingly
// import { Demo } from "./demo";

const apiUrl = `${config.apiBaseUrl}`;

function UploadForm() {
  const [isQuestionExisting, setQuestionExisting] = useState(false);
  const [formData, setFormData] = useState({

    adVideoLink: '',
    adVideoLinkSize:'',
    movieURLPartOne: '',
    movieURLPartTwo: '',
    movieURLPartOneSize:'',
    movieURLPartTwoSize: '',
    imageURL: '',
    dateAndTime:'',
    questionType: '',
    videoType:'',
    isQuestionExists:'',
    questionDescription:'',
    questionTableID:'',
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
    brandIDForm:'',
    isSample: '',
    movieName:'',
    sampleID:'',
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

  const handleSampleDetailsChange = (e) => {
    const sampleDetails = e.target.value;
    setFormData({
      ...formData,
      sampleID: sampleDetails,
    })};

 
  //  const handleQuestionChange = (e) => {
  //   const newValue = e.target.checked;
  //   if(e.target.value == "existingQuestion"){
  //     setQuestionExisting(!newValue);
  //   }
  //   else if(e.target.value == "newQuestion"){
  //     setQuestionExisting(newValue);
  //   }
  //   console.log(isQuestionExisting, e.target.value)
  //   //setQuestionExisting(!isQuestionExisting);
  //    setFormData({
  //          ...formData,
  //          isQuestionExists: newValue,
  //        });

  //       console.log(isQuestionExisting, formData);

  // };

  const handleQuestionChange = (e) => {
    const newValue = e.target.checked;
    const checkboxValue = e.target.value;
  
    // Update the state based on the value of the checkbox
    if (checkboxValue === "newQuestion") {
      setQuestionExisting(false);
      setFormData({
        ...formData,
        isQuestionExists: false,
      });
    } else if (checkboxValue === "existingQuestion") {
      setQuestionExisting(true);
      setFormData({
        ...formData,
        isQuestionExists: true,
      });
      
    }
    console.log(isQuestionExisting,formData);
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
        console.error('Error fetching brand details:', error);
      });
    },[]);

    const [movieDetails,setMovieDetails] = useState([]);
    useEffect(() => {
      fetch(`${apiUrl}/getMovieDetails`)
        .then(response => response.json())
        .then(results => {
          setMovieDetails(results.movieData);
        })
        .catch(error => {
          console.error('Error fetching movie details:', error);
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
  

   const [isBrandExisting, setBrandExisting] = useState(true);
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
    console.log("handle change: ",name,value)
    // For all fields except contactPersonNumber, simply update the state
    setFormData({
      ...formData,
      [name]: value,
    });

    console.log(isQuestionExisting,formData)
  };
  

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleVideoChange = async (e) => {
    const myArray = e.target.value.split("\\");
    setFormData({ ...formData, 'adVideoLink': myArray[2] });//, 'adVideoLinkSize': fileSize});
    console.log("myArray[2]",myArray[2])
    try {
      const fileSize = await calculateFileSize(myArray[2]);
      console.log("file size",fileSize, e.target.value)
      if (fileSize !== null) {
        handleVideoSizeChange(fileSize,myArray[2]);
       } else {
         alert('Unable to calculate file size. Please check your file URL.');
       }
    } catch (error) {
      console.error('Error calculating file size:', error);
      alert('Error calculating file size. Please check your file URL.');
    }
    console.log(myArray[2]);
    console.log("handleVideoChange", formData);
  };


  const handleVideoSizeChange = (fileSize,fileName) => {
    setFormData({ ...formData, 'adVideoLink': fileName,'adVideoLinkSize': fileSize});
  }

  const handlePartOneURLChange = async (e) => {
    const myArray = ( e.target.value).split("\\");
    setFormData({ ...formData, 'movieURLPartOne' :  myArray[2]});
    try {
      const fileSize = await calculateFileSize(myArray[2]);
      console.log("file size",fileSize, e.target.value)
      if (fileSize !== null) {
        setFormData({ ...formData, 'movieURLPartOne' :  myArray[2], 'movieURLPartOneSize': fileSize});
       } else {
         alert('Unable to calculate file size. Please check your file URL.');
       }
    } catch (error) {
      console.error('Error calculating file size:', error);
      alert('Error calculating file size. Please check your file URL.');
    }
    console.log("part 1one",myArray[2]);
    console.log(formData)
  }

  const handlePartTwoURLChange = async (e) => {
    const myArray = ( e.target.value).split("\\");
    setFormData({ ...formData, 'movieURLPartTwo' :  myArray[2]});
    try {
      const fileSize = await calculateFileSize(myArray[2]);
      console.log("file size",fileSize, e.target.value)
      if (fileSize !== null) {
        setFormData({ ...formData, 'movieURLPartTwo' :  myArray[2], 'movieURLPartTwoSize': fileSize});
       } else {
         alert('Unable to calculate file size. Please check your file URL.');
       }
    } catch (error) {
      console.error('Error calculating file size:', error);
      alert('Error calculating file size. Please check your file URL.');
    }
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
      const response = await fetch(`${apiUrl}/addContentData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('Data saved successfully!');
        // Reset the form fields
        setFormData({
          
    adVideoLink: '',
    adVideoLinkSize:'',
    movieURLPartOne: '',
    movieURLPartTwo: '',
    movieURLPartOneSize:'',
    movieURLPartTwoSize: '',
    imageURL: '',
    dateAndTime:'',
    questionType: '',
    videoType:'',
    isQuestionExists:'',
    questionDescription:'',
    questionTableID:'',
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
    brandIDForm:'',
    isSample: '',
    movieName:'',
    sampleID:'',
        });
       
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

  const calculateFileSize = async (fileUrl) => {
    try {//live link eg. http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4
      console.log("calculateFileSize",fileUrl)
      const response = await fetch(`videos\\${fileUrl}`, { method: 'HEAD' });
      const contentLength = response.headers.get('Content-Length');
      if (contentLength) {
        return parseInt(contentLength);
      } else {
        throw new Error('Content-Length header not found in response.');
      }
    } catch (error) {
      console.error('Error calculating file size:', error);
      return null;
    }
  };
   


  return (
    <form className="video-form" onSubmit={handleSubmit}>

      <label>
        Video Type:
        <select name="videoType" value={formData.videoType} onChange={handleChange}>
          <option value="" disabled selected>Select the video type</option>
          <option value="Content">Content ( Movie )</option>
          <option value="Advertisement">Advertisement</option>
        </select>
      </label>

      <label style={{ display: formData.videoType === "Content" ? 'block' : 'none' }}>
        Choose the movie you want to add the content videos in:
        <select name="movieName" value={formData.movieName} onChange={handleChange}>
          <option value="" disabled>Select movie</option>
          {movieDetails.map(movie => (
            <option key={movie.movieID} value={movie.movieName}>{movie.movieName}</option>
          ))}
        </select>
      </label>
         

      <h1>Add Video Data</h1>
      <label style={{ display: formData.videoType === "Advertisement" ? 'block' : 'none' }}>
  <span>Video URL:</span>
  <div className="custom-file-input">
    <input type="file" accept="video/*" onChange={handleVideoChange} />
    Choose a File
  </div>
  <span className="file-name"><h4>{formData.adVideoLink}</h4></span>
</label>

    {/* <label style={{ display: formData.videoType =="Advertisement" ? 'block' : 'none' }}>      <span>Ad Video Size (MB):</span>
      <input type="text" name="adVideoLinkSize" value={formData.adVideoLinkSize} onChange={handleChange} readOnly/>
    </label> */}

    <label style={{ display: formData.videoType =="Content" ? 'block' : 'none' }}>      <span>Movie Part One URL:</span>
      <div className="custom-file-input">
        <input type="file" accept="video/*" onChange={handlePartOneURLChange} />
        Enter Movie Part One File
      </div>
      <span className="file-name"><h4>{formData.movieURLPartOne}</h4></span>
    </label>

    <label style={{ display: formData.videoType =="Content" ? 'block' : 'none' }}>      <span>Movie Part Two URL:</span>
      <div className="custom-file-input">
        <input type="file" accept="video/*" onChange={handlePartTwoURLChange} />
        Enter Movie Part Two File
      </div>
      <span className="file-name"><h4>{formData.movieURLPartTwo}</h4></span>
    </label>

    {/* <label style={{ display: formData.videoType =="Content" ? 'block' : 'none' }}> 
      <div className="custom-file-input">
        <input type="text" name="movieURLPartOneSize" value={formData.movieURLPartOneSize} onChange={handleChange} readOnly/>
        Calculated Movie Part One File Size (Bytes):
      </div>
    </label> 

    <label style={{ display: formData.videoType =="Content" ? 'block' : 'none' }}> 
      <div className="custom-file-input">
      <input type="text" name="movieURLPartTwoSize" value={formData.movieURLPartTwoSize} onChange={handleChange} readOnly/>
      Calculated Movie Part Two File Size (Bytes):
      </div>
    </label>*/}
     
    <label style={{ display: formData.videoType === "Advertisement" ? 'block' : 'none' }}>
  <span>Image URL:</span>
  <div className="custom-file-input">
    <input type="file" accept="image/*" onChange={handleImageChange} />
    Choose a File
  </div>
  <span className="file-name">{formData.imageURL}</span>
</label>


<label style={{ display: formData.videoType === "Advertisement" && !isBrandExisting ? 'block' : 'none' }}>
  Brand Name:
  <select name="brandIDForm" value={formData.brandIDForm} onChange={handleChange}>
    <option value="" disabled>Select brand</option>
    {brandDetails.map(brand => (
      <option key={brand.id} value={brand.id}>{brand.brandName}</option>
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

      {/* <div className="checkbox-container" style={{ display: formData.videoType =="Advertisement" ? 'block' : 'none' }}>

        <h4>Choose Option:</h4><label className={`checkbox-label ${isQuestionExisting ? 'isQuestionExisting' : ''}`}>
    <input
      type="checkbox"
      checked={!isQuestionExisting}
      value="newQuestion"
      onChange={handleQuestionChange}
      className="checkbox-input"

    />
    Add New Question
  </label> 
  <label className={`checkbox-label ${!isQuestionExisting ? 'isQuestionExisting' : ''}` }>
    <input
      type="checkbox"
      checked={isQuestionExisting}
      value="existingQuestion"
      onChange={handleQuestionChange}
      className="checkbox-input"
      disabled={questionDetails.length<=0 ? 'disabled' : ''}
    />
    Choose From Existing Question
  </label>
</div>   */}

<div className="checkbox-container" style={{ display: formData.videoType === "Advertisement" ? 'block' : 'none' }}>
  <h4>Choose Option:</h4>
  <label className={`checkbox-label ${isQuestionExisting ? 'isQuestionExisting' : ''}`}>
    <input
      type="checkbox"
      checked={!isQuestionExisting}
      value="newQuestion"
      onChange={handleQuestionChange}
      className="checkbox-input"
    />
    Add New Question
  </label> 
  <label className={`checkbox-label ${isQuestionExisting ? 'isQuestionExisting' : ''}`}>
    <input
      type="checkbox"
      checked={isQuestionExisting==true}
      value="existingQuestion"
      onChange={handleQuestionChange}
      className="checkbox-input"
      disabled={questionDetails.length <= 0 ? 'disabled' : ''}
    />
    Choose From Existing Question
  </label>
</div>

           
   
      <label disable={true} style={{ display: formData.videoType === "Advertisement" && !isQuestionExisting ? 'block' : 'none' }}>
          Question:
          <select name="questionTableID" value={formData.questionTableID} onChange={handleChange}>
            <option value="" disabled>Select Question</option>
            {questionDetails.map(question => (
              <option key={question.id} value={question.id}>{question.questionDescription}</option>
            ))}
          </select>
        </label>

        <label style={{ display: formData.videoType === "Advertisement" && isQuestionExisting ? 'block' : 'none'}}>
        Enter New Question Here:
          <input type="text" name="questionDescription" value={formData.questionDescription} onChange={handleChange} />
      </label>

     
      <label>
      Duration ( in seconds ):
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

{formData.isSample === "true" && formData.videoType === "Advertisement" && (
  <div>
    {/* Show another dropdown here */}
    <label>
      Select the Sample Being Displayed in the AD:
      <select
        name="anotherDropdown"
        value={formData.sampleID}>
        onChange={handleSampleDetailsChange}
        <option value={0}>Select</option>{/*HARDCODED DROPDOWN DATA FOR NOW*/}
        <option value={1}>Sugar Cosmetics: Eyeliner</option>
        <option value={2}>Myntra: T-shirt</option>
      </select>
    </label>
  </div>
)}


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
      
      <label style={{ display: numOptions > 2 && formData.videoType =="Advertisement" ? 'block' : 'none' }}>
        Option 3:
        <input
          type="text"
          name="optionThree"
          value={formData.optionThree}
          onChange={handleChange}
        />
      </label>
     
      <label style={{ display: numOptions > 3 && formData.videoType =="Advertisement" ? 'block'   : 'none' }}>
        Option 4:
        <input
          type="text"
          name="optionFour"
          value={formData.optionFour}
          onChange={handleChange}
        />
      </label>
      
      <label style={{ display: numOptions > 4 && formData.videoType =="Advertisement" ? 'block' : 'none' }}>
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